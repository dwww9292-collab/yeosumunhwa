/**
 * 목록 검색 헬퍼 — 검색 유형(제목/내용/제목+내용)에 따라 일치 여부를 판단한다.
 * 카드/목록에는 본문 전체가 로드되지 않으므로, "내용"은 로드된 부가 텍스트
 * (장소·일정·분류·날짜 등)를 대상으로 한다.
 *
 * @param query    사용자가 입력한 검색어
 * @param type     "title" | "content" | "all"
 * @param title    제목 텍스트
 * @param content  내용으로 간주할 부가 텍스트들
 */
export function matchSearch(
  query: string,
  type: string,
  title: string | null | undefined,
  content: (string | null | undefined)[] = [],
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const titleText = (title ?? "").toLowerCase();
  const contentText = content.filter(Boolean).join(" ").toLowerCase();
  if (type === "content") return contentText.includes(q);
  if (type === "title") return titleText.includes(q);
  return titleText.includes(q) || contentText.includes(q); // all (제목+내용)
}
