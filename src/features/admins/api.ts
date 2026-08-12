import { supabase } from "@/lib/supabase";
import type { AdminProfile, AdminRole } from "@/features/auth/types";

const TABLE = "profiles";

export async function listAdmins(): Promise<AdminProfile[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as AdminProfile[];
}

/** 기존 가입자를 이메일로 관리자 승격 (서버 함수) */
export async function promoteAdmin(email: string, role: AdminRole, name: string | null): Promise<void> {
  const { error } = await supabase.rpc("promote_admin", {
    target_email: email,
    target_role: role,
    display_name: name,
  });
  if (error) throw error;
}

export async function updateAdminRole(id: string, role: AdminRole): Promise<void> {
  const { error } = await supabase.from(TABLE).update({ role }).eq("id", id);
  if (error) throw error;
}

export async function setAdminActive(id: string, isActive: boolean): Promise<void> {
  const { error } = await supabase.from(TABLE).update({ is_active: isActive }).eq("id", id);
  if (error) throw error;
}

/** 관리자 권한 회수 (profiles 행 삭제 → 일반 회원으로) */
export async function removeAdmin(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw error;
}
