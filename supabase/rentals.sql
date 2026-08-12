-- ============================================================
-- Phase 4: 대관 신청 (rental_applications)
-- 회원이 신청하고 본인 현황을 조회, 관리자가 승인/거절
-- SQL Editor 에 붙여넣고 Run 하세요.
-- ============================================================

create table if not exists public.rental_applications (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  space          text not null,
  applicant_name text not null,
  phone          text,
  email          text,
  org            text,
  use_date_from  date not null,
  use_date_to    date,
  purpose        text,
  headcount      int,
  memo           text,
  status         text not null default 'pending' check (status in ('pending','approved','rejected')),
  admin_memo     text,
  reviewed_by    uuid references auth.users(id),
  created_at     timestamptz not null default now()
);

create index if not exists rental_user_idx on public.rental_applications(user_id);
create index if not exists rental_status_idx on public.rental_applications(status);

alter table public.rental_applications enable row level security;

-- 본인 신청만 조회 (관리자는 전체)
drop policy if exists "rental_select_own_or_admin" on public.rental_applications;
create policy "rental_select_own_or_admin" on public.rental_applications
  for select using (user_id = auth.uid() or public.is_admin());

-- 로그인한 본인 명의로만 신청 등록
drop policy if exists "rental_insert_self" on public.rental_applications;
create policy "rental_insert_self" on public.rental_applications
  for insert with check (user_id = auth.uid());

-- 승인/거절(수정)은 관리자만
drop policy if exists "rental_admin_update" on public.rental_applications;
create policy "rental_admin_update" on public.rental_applications
  for update using (public.is_admin()) with check (public.is_admin());

-- 삭제는 관리자만
drop policy if exists "rental_admin_delete" on public.rental_applications;
create policy "rental_admin_delete" on public.rental_applications
  for delete using (public.is_admin());
