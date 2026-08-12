import { supabase } from "@/lib/supabase";
import type { EventInput, EventRow, EventType } from "./types";

const TABLE = "events";
const BUCKET = "event-posters";

/** 공개 페이지용: 게시된 항목만 */
export async function fetchPublicEvents(type: EventType): Promise<EventRow[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("type", type)
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("start_date", { ascending: false, nullsFirst: false });
  if (error) throw error;
  return (data ?? []) as EventRow[];
}

/** 단일 이벤트 상세 조회 (게시본은 누구나, 미게시는 관리자만 — RLS가 보장) */
export async function fetchEvent(id: string): Promise<EventRow | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as EventRow | null) ?? null;
}

/** 관리자용: 전체(미게시 포함) */
export async function fetchAllEvents(type: EventType): Promise<EventRow[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("type", type)
    .order("start_date", { ascending: false, nullsFirst: false });
  if (error) throw error;
  return (data ?? []) as EventRow[];
}

export async function createEvent(input: EventInput): Promise<void> {
  const { error } = await supabase.from(TABLE).insert(input);
  if (error) throw error;
}

export async function updateEvent(id: string, input: Partial<EventInput>): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteEvent(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw error;
}

/** 포스터 이미지를 Storage에 업로드하고 공개 URL 반환 */
export async function uploadPoster(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
