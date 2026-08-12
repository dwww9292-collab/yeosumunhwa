-- ============================================================
-- 테스트 계정 활성화 + 관리자 승격
-- Supabase Dashboard → SQL Editor 에 붙여넣고 Run 하세요.
--
-- 사전: 아래 두 계정은 이미 회원가입(signUp)되어 있습니다.
--   admin@yangjoo.kr / admin1234  -> 관리자(super_admin)
--   user1@yangjoo.kr / user1234   -> 일반 사용자
-- 가짜 도메인이라 이메일 인증 메일을 받을 수 없으므로 여기서 직접 확인 처리합니다.
-- ============================================================

-- 1) 두 테스트 계정 이메일 인증 강제 완료 (로그인 가능하게)
-- 주의: confirmed_at 은 generated 컬럼이라 직접 수정 불가(email_confirmed_at에서 자동 계산됨)
update auth.users
set email_confirmed_at = coalesce(email_confirmed_at, now())
where email in ('admin@yangjoo.kr', 'user1@yangjoo.kr');

-- 2) admin@yangjoo.kr 을 최고관리자로 승격 (profiles 행 생성)
insert into public.profiles (id, name, email, role, is_active)
select u.id, '테스트 관리자', u.email, 'super_admin', true
from auth.users u
where u.email = 'admin@yangjoo.kr'
on conflict (id) do update
  set role = 'super_admin', is_active = true, email = excluded.email;

-- 확인
select u.email, u.email_confirmed_at is not null as confirmed,
       p.role, p.is_active
from auth.users u
left join public.profiles p on p.id = u.id
where u.email in ('admin@yangjoo.kr', 'user1@yangjoo.kr');
