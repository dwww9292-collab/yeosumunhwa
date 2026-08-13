-- ============================================================
-- 시연용 계정 폐기 — 운영 전환 시 반드시 실행
--
-- seed_accounts.sql 로 만든 admin / user 계정은 비밀번호가 111111 인
-- 시연 전용 계정이다. 운영 오픈 전에 반드시 제거해야 한다.
--
-- 실행 전 확인:
--   1) 실제 담당자 계정이 최고관리자로 등록되어 있는지
--   2) 그 계정으로 로그인이 되는지
--   ↑ 확인하지 않고 실행하면 관리자 페이지에 아무도 들어갈 수 없게 된다.
--
-- SQL Editor 에 붙여넣고 Run 하세요.
-- ============================================================

-- ------------------------------------------------------------
-- 0) 안전장치 — 시연 계정 외에 활성 최고관리자가 있는지 먼저 확인
--    결과가 0 이면 아래 DELETE 를 실행하지 말 것.
-- ------------------------------------------------------------
select count(*) as other_super_admins
from public.profiles p
join auth.users u on u.id = p.id
where p.role = 'super_admin'
  and p.is_active
  and u.email not in ('dwww92@naver.com', 'dwww92+user@naver.com');

-- ------------------------------------------------------------
-- 1) 시연 계정 삭제
--    auth.users 삭제 시 profiles / user_accounts 는 on delete cascade 로 함께 정리된다.
--    ⚠️ 위 0번 결과가 1 이상일 때만 실행할 것.
-- ------------------------------------------------------------
-- delete from auth.users
-- where email in ('dwww92@naver.com', 'dwww92+user@naver.com');

-- ------------------------------------------------------------
-- 2) 삭제 대신 잠그기 (계정 이력을 남겨야 하는 경우)
--    비밀번호를 무효화하고 로그인을 차단한다.
-- ------------------------------------------------------------
-- update auth.users
-- set encrypted_password = null,
--     banned_until       = now() + interval '100 years'
-- where email in ('dwww92@naver.com', 'dwww92+user@naver.com');

-- ------------------------------------------------------------
-- 3) 확인
-- ------------------------------------------------------------
select a.username, u.email, p.role, p.is_active,
       (u.banned_until is not null and u.banned_until > now()) as blocked
from auth.users u
left join public.profiles p      on p.id = u.id
left join public.user_accounts a on a.user_id = u.id
order by p.role nulls last, u.created_at;

-- ============================================================
-- 비밀번호 정책 — Supabase 대시보드에서 설정 (SQL 로는 불가)
--
--   Authentication → Providers → Email
--     · Minimum password length : 10 이상 권장
--       (지침에 구체 수치는 없으나, 「개인정보의 안전성 확보조치 기준」은
--        문자·숫자·특수문자 조합에 따라 8~10자 이상을 요구한다)
--     · Password requirements : 영문 대/소문자 + 숫자 + 특수문자 조합 활성화
--     · Leaked password protection : 활성화 (유출 이력 있는 비밀번호 차단)
--
--   Authentication → Multi-Factor Authentication
--     · TOTP 활성화 → 관리자 계정 2차 인증 (지침 필수 항목)
--
--   Authentication → Sessions
--     · Time-box user sessions / Inactivity timeout 설정
--       (앱에서도 30분 무활동 로그아웃을 구현했으나, 서버측 설정을 함께 걸어야
--        클라이언트 우회 시에도 세션이 만료된다)
-- ============================================================
