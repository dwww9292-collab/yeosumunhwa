-- ============================================================
-- 테스트 계정 생성 — 아이디 / 비밀번호로 로그인
--
--   아이디 admin / 비밀번호 111111  →  최고관리자
--   아이디 user  / 비밀번호 111111  →  일반 회원
--
-- 이메일은 로그인에 쓰지 않고, 가입 인증·비밀번호 찾기 등
-- 메일 발송 용도로만 계정에 보관한다.
--   admin → dwww92@naver.com
--   user  → dwww92+user@naver.com
-- (auth.users 는 이메일이 UNIQUE 라 두 계정이 같은 주소를 쓸 수 없어
--  일반 회원은 +user 별칭을 사용한다. 실제 메일 수신이 필요하면
--  회원 관리 화면이나 Supabase 대시보드에서 주소를 바꿔 주세요.)
--
-- 선행: usernames.sql 을 먼저 실행해야 한다.
-- 여러 번 실행해도 안전(비밀번호를 111111로 다시 맞춰줌).
-- Supabase Dashboard → SQL Editor 에 붙여넣고 Run 하세요.
-- ============================================================

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- 계정 생성/갱신 helper
-- ------------------------------------------------------------
create or replace function public.upsert_auth_user(
  p_email    text,
  p_password text,
  p_name     text,
  p_username text
)
returns uuid
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  uid uuid;
begin
  select id into uid from auth.users where email = p_email;

  if uid is null then
    uid := gen_random_uuid();

    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at
    ) values (
      '00000000-0000-0000-0000-000000000000',
      uid,
      'authenticated',
      'authenticated',
      p_email,
      crypt(p_password, gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', p_name, 'username', p_username),
      now(),
      now()
    );

    insert into auth.identities (
      id, user_id, provider_id, identity_data, provider,
      last_sign_in_at, created_at, updated_at
    ) values (
      gen_random_uuid(),
      uid,
      uid::text,
      jsonb_build_object('sub', uid::text, 'email', p_email, 'email_verified', true),
      'email',
      now(),
      now(),
      now()
    )
    on conflict do nothing;
  else
    -- 이미 있으면 비밀번호 재설정 + 인증 완료 + 차단 해제
    update auth.users
    set encrypted_password = crypt(p_password, gen_salt('bf')),
        email_confirmed_at = coalesce(email_confirmed_at, now()),
        banned_until       = null,
        raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb)
                             || jsonb_build_object('name', p_name, 'username', p_username),
        updated_at         = now()
    where id = uid;
  end if;

  -- 아이디 등록 (트리거가 이미 넣었더라도 원하는 값으로 맞춘다)
  insert into public.user_accounts (user_id, username)
  values (uid, p_username)
  on conflict (user_id) do update set username = excluded.username;

  return uid;
end;
$$;

-- ------------------------------------------------------------
-- 1) 두 계정 생성 (아이디 admin / user, 비밀번호 111111)
-- ------------------------------------------------------------
select public.upsert_auth_user('dwww92@naver.com',      '111111', '최고관리자',    'admin') as admin_id;
select public.upsert_auth_user('dwww92+user@naver.com', '111111', '테스트 사용자', 'user')  as user_id;

-- ------------------------------------------------------------
-- 2) admin 계정을 최고관리자로 승격 (profiles 행 생성)
-- ------------------------------------------------------------
insert into public.profiles (id, name, email, role, is_active)
select u.id, '최고관리자', u.email, 'super_admin', true
from auth.users u
where u.email = 'dwww92@naver.com'
on conflict (id) do update
  set role = 'super_admin', is_active = true, email = excluded.email;

-- ------------------------------------------------------------
-- 3) user 계정은 일반 회원이어야 하므로 profiles 에 남아있으면 제거
-- ------------------------------------------------------------
delete from public.profiles p
using auth.users u
where p.id = u.id and u.email = 'dwww92+user@naver.com';

-- ------------------------------------------------------------
-- 4) helper 정리 (계정 생성용 함수를 남겨두지 않는다)
-- ------------------------------------------------------------
drop function if exists public.upsert_auth_user(text, text, text, text);

-- ------------------------------------------------------------
-- 확인
-- ------------------------------------------------------------
select a.username                       as "아이디",
       u.email                          as "이메일(인증용)",
       u.email_confirmed_at is not null as confirmed,
       coalesce(p.role, '(일반회원)')   as role,
       coalesce(p.is_active, false)     as is_active
from auth.users u
left join public.profiles p      on p.id = u.id
left join public.user_accounts a on a.user_id = u.id
where u.email in ('dwww92@naver.com', 'dwww92+user@naver.com');
