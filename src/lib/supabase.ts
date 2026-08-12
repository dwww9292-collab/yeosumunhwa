import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // 개발 중 누락을 빠르게 알아채기 위한 경고. (.env 설정 필요)
  console.warn(
    "[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 가 설정되지 않았습니다. .env 파일을 확인하세요.",
  );
}

// env 누락 시에도 createClient 가 throw 하지 않도록 더미 URL을 사용한다.
// 실제 요청은 실패하지만 호출부의 .catch 가 fallback 데이터로 동작한다.
const safeUrl = url || "https://placeholder.supabase.co";
const safeKey = anonKey || "placeholder-anon-key";

export const supabase = createClient(safeUrl, safeKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
