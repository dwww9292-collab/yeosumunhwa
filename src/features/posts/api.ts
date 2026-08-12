import { supabase } from "@/lib/supabase";
import type { Attachment, BoardKey, PostInput, PostRow } from "./types";
import { extOf } from "./types";

const TABLE = "posts";
const BUCKET = "board-files";

/** 공개 페이지용: 게시된 글만 (고정글이 위로) */
export async function fetchPublicPosts(board: BoardKey): Promise<PostRow[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("board", board)
    .eq("is_published", true)
    .order("is_pinned", { ascending: false })
    .order("published_at", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as PostRow[];
}

/** 관리자용: 미게시 포함 전체 */
export async function fetchAllPosts(board: BoardKey): Promise<PostRow[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("board", board)
    .order("is_pinned", { ascending: false })
    .order("published_at", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as PostRow[];
}

export async function fetchPost(id: string): Promise<PostRow | null> {
  const { data, error } = await supabase.from(TABLE).select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return (data as PostRow | null) ?? null;
}

export async function createPost(input: PostInput): Promise<void> {
  const { data: userData } = await supabase.auth.getUser();
  const { error } = await supabase
    .from(TABLE)
    .insert({ ...input, created_by: userData.user?.id ?? null });
  if (error) throw error;
}

export async function updatePost(id: string, input: Partial<PostInput>): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function deletePost(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw error;
}

/** 조회수 +1 (실패해도 본문 표시를 막지 않는다) */
export async function incrementView(id: string): Promise<void> {
  await supabase.rpc("increment_post_view", { post_id: id });
}

/** 게시판 이미지/첨부파일 업로드 → 공개 URL */
export async function uploadBoardFile(file: File): Promise<Attachment> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { name: file.name, url: data.publicUrl, ext: extOf(file.name) };
}
