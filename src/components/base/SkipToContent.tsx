/**
 * 건너뛰기 링크 (Skip Navigation)
 *
 * 한국형 웹 콘텐츠 접근성 지침 "반복 영역 건너뛰기" 항목.
 * 키보드 사용자가 매 페이지마다 헤더 메뉴를 전부 지나치지 않도록,
 * 첫 Tab 에서 본문으로 바로 이동할 수 있는 링크를 노출한다.
 *
 * 평소에는 화면 밖에 있다가 포커스를 받으면 나타난다.
 */
export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200]
                 focus:rounded-lg focus:bg-[#1a4fa0] focus:px-4 focus:py-2
                 focus:text-sm focus:font-medium focus:text-white focus:shadow-lg"
    >
      본문 바로가기
    </a>
  );
}
