/**
 * 관리자 영역 경로
 *
 * 여수시 지침: "관리자 URL의 은닉화 (예: /admin 사용 금지)"
 *
 * 경로를 한 곳에서만 정의하고 나머지는 전부 여기서 파생시킨다.
 * 배포 환경에서 VITE_ADMIN_PATH 로 덮어쓰며, 저장소에는 실제 경로를 남기지 않는다.
 *
 * ⚠️ 한계: 이 값은 빌드 시 JS 번들에 인라인되므로 번들을 열어보면 확인할 수 있다.
 *    따라서 "비밀"이 아니라 "자동 스캐너 차단" 수준의 조치다.
 *    실질적인 접근 통제는 IP 제한 + 2차 인증으로 해야 하며,
 *    그 둘은 서버 계층 확보 후 별도로 구현한다. (docs/compliance-plan.md P1-1, P1-9)
 */

function normalize(path: string): string {
  const trimmed = path.trim().replace(/\/+$/, "");
  if (!trimmed) return "";
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

/** 관리자 영역 base 경로 (예: /manage) */
export const ADMIN_BASE = normalize(import.meta.env.VITE_ADMIN_PATH || "/manage");

/** 관리자 하위 경로 생성. adminPath("posts") → "/manage/posts" */
export function adminPath(sub = ""): string {
  return sub ? `${ADMIN_BASE}/${sub}` : ADMIN_BASE;
}

/** 관리자 로그인 경로 */
export const ADMIN_LOGIN = adminPath("login");
