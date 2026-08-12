import { supabase } from "@/lib/supabase";
import type { Attachment, ProgramInput, ProgramRow } from "./types";

const TABLE = "programs";
const BUCKET = "program-files";

export async function fetchPublicPrograms(): Promise<ProgramRow[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ProgramRow[];
}

export async function fetchAllPrograms(): Promise<ProgramRow[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ProgramRow[];
}

export async function fetchProgram(id: string): Promise<ProgramRow | null> {
  const { data, error } = await supabase.from(TABLE).select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return (data as ProgramRow | null) ?? null;
}

export async function createProgram(input: ProgramInput): Promise<void> {
  const { error } = await supabase.from(TABLE).insert(input);
  if (error) throw error;
}

export async function updateProgram(id: string, input: Partial<ProgramInput>): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteProgram(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw error;
}

/** 대표 이미지 업로드 → 공개 URL */
export async function uploadProgramImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `images/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false });
  if (error) throw error;
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

/** 첨부파일(PDF 등) 업로드 → {name, url} (원본 파일명 유지) */
export async function uploadProgramAttachment(file: File): Promise<Attachment> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "pdf";
  const path = `files/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false });
  if (error) throw error;
  const url = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  return { name: file.name, url };
}
