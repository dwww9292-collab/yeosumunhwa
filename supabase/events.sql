-- ============================================================
-- Phase 3: 공연·전시·축제 (events) + 포스터 Storage
-- SQL Editor 에 붙여넣고 Run 하세요.
-- ============================================================

-- 관리자 판별 helper (Phase 1에서 누락됐을 수 있어 재생성)
create or replace function public.is_admin()
returns boolean language sql security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_active = true
  );
$$;

-- ------------------------------------------------------------
-- events 테이블
-- ------------------------------------------------------------
create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  type        text not null check (type in ('performance','exhibition','festival')),
  title       text not null,
  image_url   text,
  tag         text not null default '기획' check (tag in ('기획','대관')),
  location    text,
  start_date  date,
  end_date    date,
  body        text,
  is_published boolean not null default true,
  sort_order  int not null default 0,
  created_by  uuid references auth.users(id),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists events_type_idx on public.events(type);

alter table public.events enable row level security;

-- 공개: 게시된 것만 조회 (관리자는 전체)
drop policy if exists "events_select_published" on public.events;
create policy "events_select_published" on public.events
  for select using (is_published = true or public.is_admin());

-- 관리자: 작성/수정/삭제
drop policy if exists "events_admin_write" on public.events;
create policy "events_admin_write" on public.events
  for all using (public.is_admin()) with check (public.is_admin());

-- ------------------------------------------------------------
-- 포스터 이미지 Storage 버킷
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('event-posters', 'event-posters', true)
on conflict (id) do nothing;

-- 누구나 읽기 (공개 이미지)
drop policy if exists "poster_public_read" on storage.objects;
create policy "poster_public_read" on storage.objects
  for select using (bucket_id = 'event-posters');

-- 관리자만 업로드/수정/삭제
drop policy if exists "poster_admin_write" on storage.objects;
create policy "poster_admin_write" on storage.objects
  for all
  using (bucket_id = 'event-posters' and public.is_admin())
  with check (bucket_id = 'event-posters' and public.is_admin());
