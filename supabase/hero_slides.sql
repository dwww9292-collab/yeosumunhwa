-- ============================================================
-- 축제(및 기타) 히어로 슬라이더 관리: hero_slides
-- 이미지는 기존 event-posters 버킷(공개) 재사용
-- SQL Editor 에 붙여넣고 Run 하세요. (시드는 한 번만)
-- ============================================================

create table if not exists public.hero_slides (
  id          uuid primary key default gen_random_uuid(),
  section     text not null default 'festival',   -- 어느 페이지 히어로인지
  image_url   text,
  title       text,        -- 큰 제목
  subtitle    text,        -- 소제목 / 슬라이드별 문구
  description text,        -- 보조 설명 (날짜·장소 등)
  sort_order  int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists hero_slides_section_idx on public.hero_slides(section);

alter table public.hero_slides enable row level security;

drop policy if exists "hero_select_active" on public.hero_slides;
create policy "hero_select_active" on public.hero_slides
  for select using (is_active = true or public.is_admin());

drop policy if exists "hero_admin_write" on public.hero_slides;
create policy "hero_admin_write" on public.hero_slides
  for all using (public.is_admin()) with check (public.is_admin());

-- 왕실축제 기본 슬라이드 3개 (이미지는 관리자에서 업로드해 채우세요)
insert into public.hero_slides (section, title, subtitle, description, sort_order) values
('festival', '제9회 양주 회암사지 왕실축제', '어가행렬', '2026. 04. 17.(금) ~ 04. 18.(토) · 양주 회암사지 일원', 1),
('festival', '제9회 양주 회암사지 왕실축제', '출정식 및 전야제', '2026. 04. 17.(금) ~ 04. 18.(토) · 양주 회암사지 일원', 2),
('festival', '제9회 양주 회암사지 왕실축제', '먹거리 한마당', '2026. 04. 17.(금) ~ 04. 18.(토) · 양주 회암사지 일원', 3);
