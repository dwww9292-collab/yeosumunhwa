-- ============================================================
-- 최종 검증 — 14개 SQL 적용 후 상태 확인
--
-- 읽기 전용이다. 모든 행이 OK 로 나와야 정상.
-- SQL Editor 에 붙여넣고 Run 하세요.
-- ============================================================

select item, result,
       case when ok then 'OK' else '확인 필요' end as status
from (
  values
    -- 테이블 · 함수 존재
    ('posts 테이블',
     coalesce(to_regclass('public.posts')::text, '없음'),
     to_regclass('public.posts') is not null),

    ('posts.pii_reviewed 컬럼 (pii_guard.sql이 추가)',
     coalesce((select 'exists' from information_schema.columns
               where table_schema='public' and table_name='posts'
                 and column_name='pii_reviewed'), '없음'),
     exists (select 1 from information_schema.columns
             where table_schema='public' and table_name='posts'
               and column_name='pii_reviewed')),

    ('access_logs 테이블',
     coalesce(to_regclass('public.access_logs')::text, '없음'),
     to_regclass('public.access_logs') is not null),

    ('user_accounts 테이블 (아이디 로그인)',
     coalesce(to_regclass('public.user_accounts')::text, '없음'),
     to_regclass('public.user_accounts') is not null),

    ('venue_schedules 테이블',
     coalesce(to_regclass('public.venue_schedules')::text, '없음'),
     to_regclass('public.venue_schedules') is not null),

    -- 트리거 설치 여부
    ('posts 개인정보 차단 트리거',
     coalesce((select tgname from pg_trigger
               where tgname = 'posts_pii_guard' and not tgisinternal), '없음'),
     exists (select 1 from pg_trigger where tgname='posts_pii_guard' and not tgisinternal)),

    ('대관신청 개인정보 차단 트리거',
     coalesce((select tgname from pg_trigger
               where tgname = 'rentals_pii_guard' and not tgisinternal), '없음'),
     exists (select 1 from pg_trigger where tgname='rentals_pii_guard' and not tgisinternal)),

    -- 패턴 검출 동작
    ('개인정보 검출 — 전화번호',
     coalesce(public.detect_pii('문의는 010-1234-5678 로 주세요'), '검출 안 됨'),
     public.detect_pii('문의는 010-1234-5678 로 주세요') = '전화번호'),

    ('개인정보 검출 — 주민등록번호',
     coalesce(public.detect_pii('주민번호 900101-1234567'), '검출 안 됨'),
     public.detect_pii('주민번호 900101-1234567') = '주민등록번호'),

    ('개인정보 검출 — 정상 문장은 통과',
     coalesce(public.detect_pii('2026년 공연 안내입니다'), 'null(정상)'),
     public.detect_pii('2026년 공연 안내입니다') is null),

    -- 접속기록 위·변조 방지: SELECT 정책만 있고 UPDATE/DELETE 정책은 없어야 한다
    ('접속기록 위·변조 방지 (수정·삭제 정책 없음)',
     (select count(*)::text || '개 정책'
      from pg_policies where schemaname='public' and tablename='access_logs'),
     not exists (select 1 from pg_policies
                 where schemaname='public' and tablename='access_logs'
                   and cmd in ('UPDATE','DELETE','ALL')))
) as t(item, result, ok)
order by status desc, item;

-- ------------------------------------------------------------
-- 데이터 현황
-- ------------------------------------------------------------
select
  (select count(*) from public.posts)             as 게시글,
  (select count(*) from public.user_accounts)     as 계정,
  (select count(*) from public.access_logs)       as 접속기록,
  (select count(*) from public.profiles
    where role='super_admin' and is_active)       as 최고관리자;

-- ※ 접속기록이 0건인 것은 정상입니다.
--    log_access() 는 auth.uid() 가 있을 때만 기록하는데,
--    SQL Editor 는 로그인 세션이 아니라 auth.uid() 가 null 입니다.
--    앱에서 실제로 로그인하면 그때부터 쌓입니다.
