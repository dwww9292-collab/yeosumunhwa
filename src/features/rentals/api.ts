import { supabase } from "@/lib/supabase";
import type { RentalApplication, RentalInput, RentalStatus } from "./types";

const TABLE = "rental_applications";

/** 공개 대관현황: 승인 건의 비민감 정보만 (public_rental_bookings 뷰) */
export interface PublicBooking {
  id: string;
  space: string;
  use_date_from: string;
  use_date_to: string | null;
  title: string;
}

export async function fetchApprovedBookings(): Promise<PublicBooking[]> {
  const { data, error } = await supabase.from("public_rental_bookings").select("*");
  if (error) throw error;
  return (data ?? []) as PublicBooking[];
}

/** 본인 신청 목록 (RLS가 user_id로 자동 필터) */
export async function fetchMyRentals(): Promise<RentalApplication[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as RentalApplication[];
}

/** 관리자: 전체 신청 (옵션: 상태 필터) */
export async function fetchAllRentals(status?: RentalStatus): Promise<RentalApplication[]> {
  let query = supabase.from(TABLE).select("*").order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as RentalApplication[];
}

/** 회원 신청 등록 (user_id는 현재 로그인 사용자) */
export async function createRental(input: RentalInput): Promise<void> {
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) throw new Error("로그인이 필요합니다.");
  const { error } = await supabase.from(TABLE).insert({ ...input, user_id: userData.user.id });
  if (error) throw error;
}

/** 관리자: 승인/거절 처리 */
export async function reviewRental(
  id: string,
  status: RentalStatus,
  adminMemo: string | null,
): Promise<void> {
  const { data: userData } = await supabase.auth.getUser();
  const { error } = await supabase
    .from(TABLE)
    .update({ status, admin_memo: adminMemo, reviewed_by: userData.user?.id ?? null })
    .eq("id", id);
  if (error) throw error;
}
