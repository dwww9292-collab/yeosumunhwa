-- ============================================================
-- 양주문화재단 - Supabase 스키마 (Phase 1: 인증 기반)
-- Supabase 대시보드 > SQL Editor 에 붙여넣고 실행하세요.
-- ============================================================

-- ------------------------------------------------------------
-- 1) profiles : auth.users 1:1 확장 (관리자 계정)
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text,
  role        text not null default 'editor' check (role in ('super_admin', 'editor')),
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- 관리자 여부 판별 helper (RLS에서 재사용, SECURITY DEFINER로 RLS 재귀 방지)
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_active = true
  );
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_active = true and role = 'super_admin'
  );
$$;

-- RLS 활성화
alter table public.profiles enable row level security;

-- 본인 프로필 조회
drop policy if exists "profiles_select_self_or_admin" on public.profiles;
create policy "profiles_select_self_or_admin" on public.profiles
  for select using (id = auth.uid() or public.is_super_admin());

-- 프로필 생성/수정/삭제는 super_admin만 (회원 관리 = 관리자 계정 관리)
drop policy if exists "profiles_write_super_admin" on public.profiles;
create policy "profiles_write_super_admin" on public.profiles
  for all using (public.is_super_admin()) with check (public.is_super_admin());

-- ------------------------------------------------------------
-- 2) 최초 슈퍼관리자 등록 안내
-- ------------------------------------------------------------
-- (1) 대시보드 > Authentication > Users > "Add user" 로
--     이메일 dwww92@naver.com + 비밀번호로 계정 생성 (Auto Confirm 체크).
-- (2) 생성된 유저의 UUID를 복사해 아래 INSERT 실행:
--
-- insert into public.profiles (id, name, role)
-- values ('여기에-복사한-UUID', '최고관리자', 'super_admin')
-- on conflict (id) do update set role = 'super_admin', is_active = true;
--
-- (3) 공개 회원가입 차단: 대시보드 > Authentication > Providers > Email
--     의 "Allow new users to sign up" 를 OFF.
