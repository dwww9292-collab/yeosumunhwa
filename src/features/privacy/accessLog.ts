import { supabase } from "@/lib/supabase";

/**
 * 개인정보처리시스템 접속기록
 *
 * 「개인정보의 안전성 확보조치 기준」 제8조에 따라 개인정보취급자의
 * 접속기록을 남긴다. 실제 기록은 DB 함수(log_access)가 수행하며,
 * 계정 식별자와 접속지 정보는 서버가 채우므로 클라이언트가 위조할 수 없다.
 *
 * 기록 실패가 본 업무를 막아서는 안 되므로 모든 오류를 삼킨다.
 */

export type AccessAction =
  | "login"
  | "logout"
  | "view"
  | "create"
  | "update"
  | "delete"
  | "export";

export async function logAccess(
  action: AccessAction,
  targetTable?: string,
  targetId?: string,
  detail?: string,
): Promise<void> {
  try {
    await supabase.rpc("log_access", {
      p_action: action,
      p_target_table: targetTable ?? null,
      p_target_id: targetId ?? null,
      p_detail: detail ?? null,
    });
  } catch {
    /* 기록 실패는 무시한다 */
  }
}
