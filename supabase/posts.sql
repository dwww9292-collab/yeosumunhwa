-- ============================================================
-- 알림마당 게시판 CMS (posts)
--   notice  공지사항   : 상단고정(is_pinned) + 첨부파일
--   news    보도자료   : 대표 이미지 + 본문
--   archive 재단소식   : 영상(video) / 사진(photo) 갤러리
--   data    자료실     : 첨부파일 중심
-- SQL Editor 에 붙여넣고 Run 하세요.
-- ============================================================

-- 관리자 판별 helper (앞 단계에서 누락됐을 수 있어 재생성)
create or replace function public.is_admin()
returns boolean language sql security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_active = true
  );
$$;

-- ------------------------------------------------------------
-- posts 테이블
-- ------------------------------------------------------------
create table if not exists public.posts (
  id           uuid primary key default gen_random_uuid(),
  board        text not null check (board in ('notice','news','archive','data')),
  title        text not null,
  body         text,
  image_url    text,                                   -- 보도자료/재단소식 대표 이미지
  media_type   text check (media_type in ('video','photo')),  -- 재단소식 탭 구분
  media_url    text,                                   -- 재단소식 영상 링크(YouTube 등)
  attachments  jsonb not null default '[]'::jsonb,     -- [{name, url, ext}]
  is_pinned    boolean not null default false,         -- 공지사항 상단 고정
  is_published boolean not null default true,
  view_count   int not null default 0,
  published_at date not null default current_date,     -- 목록에 표시되는 작성일
  created_by   uuid references auth.users(id),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists posts_board_idx on public.posts(board, published_at desc);

alter table public.posts enable row level security;

-- 공개: 게시된 글만 (관리자는 미게시 포함 전체)
drop policy if exists "posts_select_published" on public.posts;
create policy "posts_select_published" on public.posts
  for select using (is_published = true or public.is_admin());

-- 작성/수정/삭제는 관리자만
drop policy if exists "posts_admin_write" on public.posts;
create policy "posts_admin_write" on public.posts
  for all using (public.is_admin()) with check (public.is_admin());

-- ------------------------------------------------------------
-- 조회수 증가 (비로그인도 호출 가능해야 하므로 SECURITY DEFINER)
-- ------------------------------------------------------------
create or replace function public.increment_post_view(post_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.posts
  set view_count = view_count + 1
  where id = post_id and is_published = true;
$$;

grant execute on function public.increment_post_view(uuid) to anon, authenticated;

-- ------------------------------------------------------------
-- 게시판 첨부파일 / 이미지 Storage 버킷
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('board-files', 'board-files', true)
on conflict (id) do nothing;

drop policy if exists "board_files_public_read" on storage.objects;
create policy "board_files_public_read" on storage.objects
  for select using (bucket_id = 'board-files');

drop policy if exists "board_files_admin_write" on storage.objects;
create policy "board_files_admin_write" on storage.objects
  for all
  using (bucket_id = 'board-files' and public.is_admin())
  with check (bucket_id = 'board-files' and public.is_admin());

-- 확인
select board, count(*) from public.posts group by board;
