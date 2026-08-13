-- ============================================================
-- 개인정보처리시스템 접속기록
--
-- 여수시 지침 / 「개인정보의 안전성 확보조치 기준」 제8조:
--   개인정보취급자의 접속기록을 최소 1년 보관.
--   5만 명 이상 정보주체의 개인정보를 처리하면 2년 이상.
--
-- Supabase 기본 로그는 플랜에 따라 보존기간이 짧아(수일 수준) 이 요건을
-- 충족할 수 없으므로 별도 테이블에 직접 기록한다.
--
-- 필수 기록 항목: 계정 식별자 / 접속 일시 / 접속지 정보 / 수행업무
--
-- SQL Editor 에 붙여넣고 Run 하세요.
-- ============================================================

create table if not exists public.access_logs (
  id            bigint generated always as identity primary key,
  occurred_at   timestamptz not null default now(),
  -- 계정 식별자 (탈퇴해도 기록은 남아야 하므로 FK를 걸지 않는다)
  actor_id      uuid,
  actor_name    text,
  -- 수행업무
  action        text not null,          -- login / logout / view / create / update / delete / export
  target_table  text,
  target_id     text,
  detail        text,
  -- 접속지 정보
  ip            inet,
  user_agent    text
);

create index if not exists access_logs_occurred_idx on public.access_logs(occurred_at desc);
create index if not exists access_logs_actor_idx    on public.access_logs(actor_id, occurred_at desc);

comment on table public.access_logs is
  '개인정보처리시스템 접속기록. 「개인정보의 안전성 확보조치 기준」 제8조에 따라 1년(5만명 이상 2년) 이상 보관.';

alter table public.access_logs enable row level security;

-- ------------------------------------------------------------
-- 조회는 최고관리자만. 수정·삭제는 누구도 할 수 없다.
-- 접속기록은 위·변조를 막아야 하므로 UPDATE/DELETE 정책을 만들지 않는다.
-- (RLS 가 켜져 있고 정책이 없으면 해당 동작은 전부 거부된다)
-- ------------------------------------------------------------
drop policy if exists "access_logs_select_super_admin" on public.access_logs;
create policy "access_logs_select_super_admin" on public.access_logs
  for select using (public.is_super_admin());

-- ------------------------------------------------------------
-- 기록 함수
--   SECURITY DEFINER 로 두어 로그인한 사용자가 자기 행위를 남기게 하되,
--   actor_id 는 호출자가 지정하지 못하고 auth.uid() 로 강제한다.
--   (남의 이름으로 기록을 남기는 것을 막는다)
-- ------------------------------------------------------------
create or replace function public.log_access(
  p_action       text,
  p_target_table text default null,
  p_target_id    text default null,
  p_detail       text default null
)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  uid  uuid := auth.uid();
  uname text;
  hdrs  json;
  fwd   text;
begin
  if uid is null then
    return;   -- 비로그인 요청은 기록 대상이 아니다
  end if;

  select coalesce(p.name, a.username, u.email)
  into uname
  from auth.users u
  left join public.profiles p      on p.id = u.id
  left join public.user_accounts a on a.user_id = u.id
  where u.id = uid;

  -- PostgREST 가 전달한 요청 헤더에서 접속지 정보를 얻는다
  begin
    hdrs := current_setting('request.headers', true)::json;
    fwd  := split_part(coalesce(hdrs ->> 'x-forwarded-for', ''), ',', 1);
  exception when others then
    hdrs := null; fwd := null;
  end;

  insert into public.access_logs
    (actor_id, actor_name, action, target_table, target_id, detail, ip, user_agent)
  values (
    uid,
    uname,
    p_action,
    p_target_table,
    p_target_id,
    p_detail,
    nullif(btrim(fwd), '')::inet,
    hdrs ->> 'user-agent'
  );
exception when others then
  -- 기록 실패가 본 업무를 막아서는 안 된다
  return;
end;
$$;

grant execute on function public.log_access(text, text, text, text) to authenticated;

-- ------------------------------------------------------------
-- 개인정보 열람 자동 기록
--   회원 목록 조회는 개인정보 열람이므로 호출될 때마다 기록한다.
-- ------------------------------------------------------------
create or replace function public.list_site_users()
returns table (
  id            uuid,
  username      text,
  email         text,
  name          text,
  created_at    timestamptz,
  last_sign_in_at timestamptz,
  confirmed     boolean,
  blocked       boolean,
  is_admin      boolean,
  rental_count  bigint
)
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not public.is_admin() then
    return;   -- 관리자가 아니면 0건
  end if;

  perform public.log_access('view', 'auth.users', null, '회원 목록 조회');

  return query
    select
      u.id,
      a.username::text,
      u.email::text,
      coalesce(p.name, u.raw_user_meta_data->>'name')::text,
      u.created_at,
      u.last_sign_in_at,
      u.email_confirmed_at is not null,
      (u.banned_until is not null and u.banned_until > now()),
      (p.id is not null and p.is_active),
      (select count(*) from public.rental_applications r where r.user_id = u.id)
    from auth.users u
    left join public.profiles p      on p.id = u.id
    left join public.user_accounts a on a.user_id = u.id
    order by u.created_at desc;
end;
$$;

grant execute on function public.list_site_users() to authenticated;

-- ------------------------------------------------------------
-- 보관기간 경과분 정리
--   기본 1년. 정보주체 5만 명을 넘으면 2년으로 바꿀 것.
--   pg_cron 이 있으면 예약 실행하고, 없으면 주기적으로 수동 실행한다.
-- ------------------------------------------------------------
create or replace function public.purge_access_logs(p_keep_years int default 1)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  removed integer;
begin
  if not public.is_super_admin() then
    raise exception '권한이 없습니다.';
  end if;

  delete from public.access_logs
  where occurred_at < now() - make_interval(years => p_keep_years);

  get diagnostics removed = row_count;
  return removed;
end;
$$;

grant execute on function public.purge_access_logs(int) to authenticated;

-- 확인
select public.log_access('login', null, null, '설치 확인');
select occurred_at, actor_name, action, detail from public.access_logs order by id desc limit 5;
