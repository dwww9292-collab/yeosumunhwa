export type AdminRole = "super_admin" | "editor";

export interface AdminProfile {
  id: string;
  name: string | null;
  email: string | null;
  role: AdminRole;
  is_active: boolean;
  created_at: string;
}
