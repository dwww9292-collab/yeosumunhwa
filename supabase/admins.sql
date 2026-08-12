-- ============================================================
-- Phase 5: 관리자 계정 관리
-- super_admin이 기존 가입자를 이메일로 관리자 승격/권한변경/비활성화
-- SQL Editor 에 붙여넣고 Run 하세요.
-- ============================================================

-- 목록 표시용 이메일 컬럼
alter table public.profiles add column if not exists email text;

-- 기존 최고관리자 이메일 채우기 (auth.users에서 가져옴)
update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id and p.email is null;

-- ------------------------------------------------------------
-- 이메일로 관리자 승격 (대상자는 먼저 회원가입되어 있어야 함)
-- 호출자는 super_admin 이어야 함
-- ------------------------------------------------------------
create or replace function public.promote_admin(
  target_email text,
  target_role  text default 'editor',
  display_name text default null
)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  uid uuid;
  uemail text;
begin
  if not public.is_super_admin() then
    raise exception '권한이 없습니다.';
  end if;
  if target_role not in ('super_admin', 'editor') then
    raise exception '잘못된 권한입니다.';
  end if;

  select id, email into uid, uemail from auth.users where email = target_email;
  if uid is null then
    raise exception '해당 이메일의 가입자를 찾을 수 없습니다. 먼저 회원가입이 필요합니다.';
  end if;

  insert into public.profiles (id, name, email, role, is_active)
  values (uid, coalesce(display_name, uemail), uemail, target_role, true)
  on conflict (id) do update
    set role = excluded.role,
        is_active = true,
        name = coalesce(public.profiles.name, excluded.name),
        email = excluded.email;
end;
$$;

grant execute on function public.promote_admin(text, text, text) to authenticated;
