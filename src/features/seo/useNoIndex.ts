import { useEffect } from "react";

/**
 * 마운트된 동안 <meta name="robots" content="noindex, nofollow"> 를 삽입해
 * 관리자/회원 전용 페이지가 검색엔진에 색인되지 않도록 한다.
 * 언마운트 시 원래 색인 정책(index, follow)으로 되돌린다.
 */
export function useNoIndex() {
  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const prev = meta?.getAttribute("content") ?? null;
    if (meta) {
      meta.setAttribute("content", "noindex, nofollow");
    }
    return () => {
      if (meta) {
        meta.setAttribute("content", prev ?? "index, follow");
      }
    };
  }, []);
}
