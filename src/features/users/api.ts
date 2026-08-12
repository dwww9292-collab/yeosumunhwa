import { supabase } from "@/lib/supabase";

/** 사이트 가입자 (관리자 계정 포함, is_admin 으로 구분) */
export interface SiteUser {
  id: string;
  /** 로그인 아이디 */
  username: string | null;
  email: string | null;
  name: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  confirmed: boolean;
  blocked: boolean;
  is_admin: boolean;
  rental_count: number;
}

export async function listSiteUsers(): Promise<SiteUser[]> {
  const { data, error } = await supabase.rpc("list_site_users");
  if (error) throw error;
  return (data ?? []) as SiteUser[];
}

export async function setUserBlocked(id: string, blocked: boolean): Promise<void> {
  const { error } = await supabase.rpc("set_site_user_blocked", {
    target_id: id,
    blocked,
  });
  if (error) throw error;
}

export async function deleteSiteUser(id: string): Promise<void> {
  const { error } = await supabase.rpc("delete_site_user", { target_id: id });
  if (error) throw error;
}
