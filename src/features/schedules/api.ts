import { supabase } from "@/lib/supabase";

const TABLE = "venue_schedules";

/** 관리자가 캘린더에 직접 등록하는 일정 (자체행사 · 휴관 · 시설공사 등) */
export interface VenueSchedule {
  id: string;
  space: string;
  hall: string | null;
  title: string;
  use_date_from: string;
  use_date_to: string | null;
  is_closed: boolean;
  memo: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface VenueScheduleInput {
  space: string;
  hall: string | null;
  title: string;
  use_date_from: string;
  use_date_to: string | null;
  is_closed: boolean;
  memo: string | null;
}

/** 시설별 홀 목록 (대관현황 캘린더 표기용) */
export const HALLS: Record<string, string[]> = {
  시민회관: ["대공연장", "소공연장", "다목적실", "전시실"],
  여수사랑행복센터: ["공연장", "다목적실", "강의실"],
  여수우정행복센터: ["공연장", "다목적실", "강의실"],
  여수아트홀: ["공연장", "전시실", "연습실"],
};

export async function fetchSchedules(space?: string): Promise<VenueSchedule[]> {
  let query = supabase.from(TABLE).select("*").order("use_date_from", { ascending: false });
  if (space) query = query.eq("space", space);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as VenueSchedule[];
}

export async function createSchedule(input: VenueScheduleInput): Promise<void> {
  const { data: userData } = await supabase.auth.getUser();
  const { error } = await supabase
    .from(TABLE)
    .insert({ ...input, created_by: userData.user?.id ?? null });
  if (error) throw error;
}

export async function updateSchedule(
  id: string,
  input: Partial<VenueScheduleInput>,
): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteSchedule(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw error;
}
