-- ============================================================
-- 일반 회원(사이트 가입자) 관리
--   auth.users 는 PostgREST 로 직접 조회할 수 없으므로
--   관리자만 호출 가능한 SECURITY DEFINER 함수로 노출한다.
-- SQL Editor 에 붙여넣고 Run 하세요.
-- ============================================================

-- ------------------------------------------------------------
-- 회원 목록 (관리자 계정 제외 여부는 is_admin 플래그로 구분해 함께 반환)
-- ------------------------------------------------------------
-- 반환 컬럼이 바뀌면 create or replace 로는 교체할 수 없으므로 먼저 제거
drop function if exists public.list_site_users();

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
language sql
security definer
set search_path = public, auth
as $$
  select
    u.id,
    a.username::text,
    u.email::text,
    coalesce(p.name, u.raw_user_meta_data->>'name')::text as name,
    u.created_at,
    u.last_sign_in_at,
    u.email_confirmed_at is not null as confirmed,
    (u.banned_until is not null and u.banned_until > now()) as blocked,
    (p.id is not null and p.is_active) as is_admin,
    (select count(*) from public.rental_applications r where r.user_id = u.id) as rental_count
  from auth.users u
  left join public.profiles p      on p.id = u.id
  left join public.user_accounts a on a.user_id = u.id
  where public.is_admin()          -- 관리자가 아니면 0건 반환
  order by u.created_at desc;
$$;

grant execute on function public.list_site_users() to authenticated;

-- ------------------------------------------------------------
-- 회원 차단 / 차단 해제 (banned_until 을 조작)
-- 관리자 계정은 이 함수로 차단할 수 없다(회원관리 메뉴에서만 처리).
-- ------------------------------------------------------------
create or replace function public.set_site_user_blocked(target_id uuid, blocked boolean)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not public.is_admin() then
    raise exception '권한이 없습니다.';
  end if;
  if exists (select 1 from public.profiles where id = target_id and is_active) then
    raise exception '관리자 계정은 회원관리에서 차단할 수 없습니다. 관리자 관리 메뉴를 이용하세요.';
  end if;

  update auth.users
  set banned_until = case when blocked then now() + interval '100 years' else null end
  where id = target_id;
end;
$$;

grant execute on function public.set_site_user_blocked(uuid, boolean) to authenticated;

-- ------------------------------------------------------------
-- 회원 탈퇴 처리 (최고관리자만) — 신청 이력도 함께 삭제된다(on delete cascade)
-- ------------------------------------------------------------
create or replace function public.delete_site_user(target_id uuid)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not public.is_super_admin() then
    raise exception '최고관리자만 회원을 삭제할 수 있습니다.';
  end if;
  if exists (select 1 from public.profiles where id = target_id and is_active) then
    raise exception '관리자 계정은 삭제할 수 없습니다. 먼저 권한을 회수하세요.';
  end if;

  delete from auth.users where id = target_id;
end;
$$;

grant execute on function public.delete_site_user(uuid) to authenticated;

-- 확인
select * from public.list_site_users();
