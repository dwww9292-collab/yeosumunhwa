-- ============================================================
-- 공개 대관현황 뷰: 승인된 대관 건의 "비민감 정보"만 공개
-- (신청자 이름/전화/이메일/메모 등 개인정보는 절대 노출하지 않음)
-- Supabase SQL Editor 에 붙여넣고 Run 하세요.
-- ============================================================

create or replace view public.public_rental_bookings as
select
  id,
  space,
  use_date_from,
  use_date_to,
  -- 표시용 제목: 행사목적 > 단체명 순, 둘 다 없으면 '대관 예약'
  coalesce(nullif(btrim(purpose), ''), nullif(btrim(org), ''), '대관 예약') as title
from public.rental_applications
where status = 'approved';

-- 뷰는 소유자 권한으로 실행되어 기본 테이블 RLS를 우회하므로,
-- 위 SELECT에서 승인 건의 안전한 컬럼만 노출되도록 제한했다.
-- 누구나(비로그인 포함) 조회 가능하도록 권한 부여.
grant select on public.public_rental_bookings to anon, authenticated;

-- 확인
select * from public.public_rental_bookings order by use_date_from desc limit 20;
