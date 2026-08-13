import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * SPA 라우트 이동 시 접근성 보완
 *
 * 일반 웹사이트는 페이지가 새로 로드되면서 스크린리더가 새 문서를 읽어준다.
 * SPA 는 문서가 바뀌지 않아 화면만 갈아끼워지므로, 스크린리더 사용자는
 * 이동이 일어난 사실조차 알 수 없고 포커스도 이전 위치에 남는다.
 * WA 심사에서 지적되는 항목이라 직접 처리한다.
 *
 * 1) 본문 영역(#main-content)으로 포커스를 옮기고
 * 2) 페이지 제목을 aria-live 로 알린다
 */
export default function RouteAnnouncer() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 렌더가 끝난 뒤 제목을 읽어야 하므로 한 프레임 뒤로 미룬다
    const raf = window.requestAnimationFrame(() => {
      const main = document.getElementById("main-content");
      if (main) {
        main.setAttribute("tabindex", "-1");
        main.focus({ preventScroll: true });
      }

      const heading = document.querySelector("h1, h2");
      const title = heading?.textContent?.trim() || document.title;
      const live = document.getElementById("route-announcer");
      if (live) live.textContent = `${title} 페이지로 이동했습니다.`;
    });

    return () => window.cancelAnimationFrame(raf);
  }, [pathname]);

  return (
    <div
      id="route-announcer"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    />
  );
}
