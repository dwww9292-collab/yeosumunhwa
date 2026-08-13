-- ============================================================
-- 적용 상태 진단 — 어느 SQL까지 실행됐는지 확인
--
-- 아무것도 바꾸지 않는 읽기 전용 쿼리다. 먼저 이걸 실행해서
-- "미적용" 으로 나온 파일부터 순서대로 돌리면 된다.
--
-- 테이블을 직접 조회하지 않고 시스템 카탈로그만 본다.
-- (없는 테이블을 SELECT 하면 이 진단 쿼리 자체가 42P01 로 실패하기 때문)
--
-- SQL Editor 에 붙여넣고 Run 하세요.
-- ============================================================

select
  step,
  file,
  case when applied then '적용됨' else '미적용  <-- 실행 필요' end as status,
  note
from (
  values
    (1,  'schema.sql',          to_regclass('public.profiles')            is not null, '관리자 프로필 · is_admin()'),
    (2,  'admins.sql',          to_regproc('public.promote_admin')        is not null, '관리자 승격 함수'),
    (3,  'events.sql',          to_regclass('public.events')              is not null, '공연·전시·축제'),
    (4,  'programs.sql',        to_regclass('public.programs')            is not null, '사업소개'),
    (5,  'hero_slides.sql',     to_regclass('public.hero_slides')         is not null, '축제 배너'),
    (6,  'rentals.sql',         to_regclass('public.rental_applications') is not null, '대관 신청'),
    (7,  'usernames.sql',       to_regclass('public.user_accounts')       is not null, '아이디 로그인'),
    (8,  'seed_accounts.sql',   to_regclass('public.user_accounts')       is not null, '계정 시드 — 7번 실행 후 별도 확인'),
    (9,  'posts.sql',           to_regclass('public.posts')               is not null, '알림마당 게시판'),
    (10, 'seed_posts.sql',      to_regclass('public.posts')               is not null, '게시글 시드 — 9번 실행 후 별도 확인'),
    (11, 'site_users.sql',      to_regproc('public.list_site_users')      is not null, '회원 관리'),
    (12, 'venue_schedules.sql', to_regclass('public.venue_schedules')     is not null, '대관현황 일정'),
    (13, 'pii_guard.sql',       to_regproc('public.detect_pii')           is not null, '개인정보 패턴 차단'),
    (14, 'access_logs.sql',     to_regclass('public.access_logs')         is not null, '접속기록')
) as t(step, file, applied, note)
order by step;

-- ------------------------------------------------------------
-- 시드 데이터는 테이블이 생긴 뒤에만 확인 가능하므로 따로 본다.
-- 위 목록에서 7·9번이 "적용됨" 인 경우에만 아래를 실행하세요.
-- ------------------------------------------------------------
-- select
--   (select count(*) from public.user_accounts) as 계정수,
--   (select count(*) from public.posts)         as 게시글수,
--   (select count(*) from public.profiles where role = 'super_admin' and is_active) as 최고관리자수;
