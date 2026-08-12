-- ============================================================
-- 대관현황 캘린더 직접 등록 (venue_schedules)
--   승인된 대관신청 외에, 재단 자체 행사 · 휴관 · 시설공사 등
--   관리자가 캘린더에 직접 올려야 하는 일정을 관리한다.
--   /rent/status 캘린더는 [승인된 신청] + [직접 등록 일정] 을 함께 보여준다.
-- SQL Editor 에 붙여넣고 Run 하세요.
-- ============================================================

create table if not exists public.venue_schedules (
  id            uuid primary key default gen_random_uuid(),
  space         text not null,        -- 시민회관 / 여수사랑행복센터 / 여수우정행복센터 / 여수아트홀
  hall          text,                 -- 대공연장 / 소공연장 / 다목적실 등 (선택)
  title         text not null,        -- 캘린더에 표시될 문구
  use_date_from date not null,
  use_date_to   date,
  is_closed     boolean not null default false,  -- 휴관 표시
  memo          text,
  created_by    uuid references auth.users(id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists venue_schedules_space_idx
  on public.venue_schedules(space, use_date_from);

alter table public.venue_schedules enable row level security;

-- 캘린더는 공개 정보이므로 누구나 조회
drop policy if exists "venue_schedules_public_select" on public.venue_schedules;
create policy "venue_schedules_public_select" on public.venue_schedules
  for select using (true);

drop policy if exists "venue_schedules_admin_write" on public.venue_schedules;
create policy "venue_schedules_admin_write" on public.venue_schedules
  for all using (public.is_admin()) with check (public.is_admin());

-- ------------------------------------------------------------
-- 공개 캘린더 뷰 재정의: 승인 신청 + 직접 등록 일정 통합
--   기존 뷰에 hall / is_closed / source 컬럼이 추가되므로 drop 후 재생성한다.
-- ------------------------------------------------------------
drop view if exists public.public_rental_bookings;

create view public.public_rental_bookings as
  -- (1) 승인된 대관신청: 개인정보는 절대 노출하지 않고 표시용 제목만
  select
    r.id,
    r.space,
    null::text as hall,
    r.use_date_from,
    r.use_date_to,
    coalesce(nullif(btrim(r.purpose), ''), nullif(btrim(r.org), ''), '대관 예약') as title,
    false as is_closed,
    'rental'::text as source
  from public.rental_applications r
  where r.status = 'approved'

  union all

  -- (2) 관리자가 직접 등록한 일정
  select
    s.id,
    s.space,
    s.hall,
    s.use_date_from,
    s.use_date_to,
    s.title,
    s.is_closed,
    'schedule'::text as source
  from public.venue_schedules s;

-- 뷰는 소유자 권한으로 실행되어 기본 테이블 RLS를 우회하므로,
-- 위 SELECT 에서 안전한 컬럼만 노출되도록 제한했다.
grant select on public.public_rental_bookings to anon, authenticated;

-- 확인
select * from public.public_rental_bookings order by use_date_from desc limit 20;
