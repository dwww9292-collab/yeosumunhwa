import { supabase } from "@/lib/supabase";

/**
 * 아이디 ↔ 이메일
 *
 * 로그인은 아이디 + 비밀번호로 한다.
 * Supabase Auth 는 이메일로만 인증하므로, 아이디를 계정 이메일로 바꿔
 * signInWithPassword 에 넘긴다. 이메일 자체는 가입 인증 · 비밀번호 찾기
 * 등 메일 발송에만 쓰인다.
 */

export const USERNAME_RULE = /^[a-z0-9_]{3,20}$/;

/** 아이디 형식 안내 문구 (가입 화면에서 재사용) */
export const USERNAME_HINT = "영문 소문자·숫자·밑줄(_) 3~20자";

/** 아이디로 계정 이메일을 조회한다. 없으면 null */
export async function emailForUsername(username: string): Promise<string | null> {
  const { data, error } = await supabase.rpc("email_for_username", {
    p_username: username.trim().toLowerCase(),
  });
  if (error) throw error;
  return (data as string | null) ?? null;
}

/** 아이디 사용 가능 여부 */
export async function isUsernameAvailable(username: string): Promise<boolean> {
  const { data, error } = await supabase.rpc("username_available", {
    p_username: username.trim().toLowerCase(),
  });
  if (error) throw error;
  return data === true;
}

/**
 * 로그인 입력값을 계정 이메일로 변환한다.
 * 아이디가 원칙이지만, 이메일을 그대로 입력한 경우도 막지 않는다.
 */
export async function resolveLoginEmail(identifier: string): Promise<string | null> {
  const value = identifier.trim();
  if (!value) return null;
  if (value.includes("@")) return value;
  return emailForUsername(value);
}
