-- ============================================================
-- 아이디(username) 로그인 체계
--
--   로그인      : 아이디 + 비밀번호
--   이메일 용도 : 가입 인증 · 비밀번호 찾기 등 메일 발송에만 사용
--
-- Supabase Auth 자체는 이메일로만 인증하므로,
-- 아이디 → 계정 이메일을 찾아주는 조회 함수를 두고
-- 프론트에서 [아이디 → 이메일] 변환 후 로그인한다.
-- SQL Editor 에 붙여넣고 Run 하세요.
-- ============================================================

-- ------------------------------------------------------------
-- 1) 아이디 테이블
-- ------------------------------------------------------------
create table if not exists public.user_accounts (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  username   text not null unique check (username ~ '^[a-z0-9_]{3,20}$'),
  created_at timestamptz not null default now()
);

create index if not exists user_accounts_username_idx on public.user_accounts(username);

alter table public.user_accounts enable row level security;

-- 본인 아이디 조회 / 관리자는 전체 조회
drop policy if exists "user_accounts_select_self_or_admin" on public.user_accounts;
create policy "user_accounts_select_self_or_admin" on public.user_accounts
  for select using (user_id = auth.uid() or public.is_admin());

-- 변경은 관리자만 (신규 발급은 아래 트리거가 처리)
drop policy if exists "user_accounts_admin_write" on public.user_accounts;
create policy "user_accounts_admin_write" on public.user_accounts
  for all using (public.is_admin()) with check (public.is_admin());

-- ------------------------------------------------------------
-- 2) 회원가입 시 아이디 자동 등록
--    signUp 의 options.data.username 값을 읽어 행을 만든다.
--    (이메일 인증이 켜져 있어 세션이 없는 경우에도 동작하도록 트리거로 처리)
-- ------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  uname text;
begin
  uname := lower(nullif(btrim(new.raw_user_meta_data->>'username'), ''));
  if uname is not null then
    insert into public.user_accounts (user_id, username)
    values (new.id, uname)
    on conflict (user_id) do update set username = excluded.username;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------
-- 3) 아이디 → 계정 이메일 조회 (로그인/비밀번호찾기용)
--
--    주의: 아이디를 아는 사람은 해당 계정의 이메일을 알 수 있다.
--    운영상 문제가 되면 아이디를 추측하기 어렵게 발급하거나,
--    Edge Function 으로 옮겨 서버에서만 변환하도록 바꾸세요.
-- ------------------------------------------------------------
create or replace function public.email_for_username(p_username text)
returns text
language sql
security definer
stable
set search_path = public, auth
as $$
  select u.email::text
  from public.user_accounts a
  join auth.users u on u.id = a.user_id
  where a.username = lower(btrim(p_username));
$$;

grant execute on function public.email_for_username(text) to anon, authenticated;

-- ------------------------------------------------------------
-- 4) 아이디 중복 확인 (회원가입 화면용)
-- ------------------------------------------------------------
create or replace function public.username_available(p_username text)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select lower(btrim(p_username)) ~ '^[a-z0-9_]{3,20}$'
     and not exists (
       select 1 from public.user_accounts
       where username = lower(btrim(p_username))
     );
$$;

grant execute on function public.username_available(text) to anon, authenticated;

-- 확인
select a.username, u.email
from public.user_accounts a
join auth.users u on u.id = a.user_id
order by a.created_at;
