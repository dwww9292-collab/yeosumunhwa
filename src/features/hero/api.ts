import { supabase } from "@/lib/supabase";

const TABLE = "hero_slides";
const BUCKET = "event-posters"; // 공개 버킷 재사용

export interface HeroSlide {
  id: string;
  section: string;
  image_url: string | null;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface HeroSlideInput {
  section: string;
  image_url: string | null;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  sort_order: number;
  is_active: boolean;
}

export async function fetchActiveSlides(section: string): Promise<HeroSlide[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("section", section)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as HeroSlide[];
}

export async function fetchAllSlides(section: string): Promise<HeroSlide[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("section", section)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as HeroSlide[];
}

export async function createSlide(input: HeroSlideInput): Promise<void> {
  const { error } = await supabase.from(TABLE).insert(input);
  if (error) throw error;
}

export async function updateSlide(id: string, input: Partial<HeroSlideInput>): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteSlide(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw error;
}

export async function uploadHeroImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `hero/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false });
  if (error) throw error;
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}
