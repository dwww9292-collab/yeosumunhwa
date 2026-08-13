import { useState } from "react";

/**
 * 공공누리 제1유형 마크
 *
 * ⚠️ 공식 마크 이미지는 반드시 공공누리 누리집(kogl.or.kr)에서 배포하는
 *    정품 파일을 사용해야 한다. 임의로 유사하게 그린 마크는 사용할 수 없다.
 *
 * TODO: kogl.or.kr > 공공누리 소개 > 유형안내에서 제1유형 마크를 내려받아
 *       public/images/kogl-type1.png 로 저장할 것.
 *       파일이 없는 동안에는 아래 텍스트 배지가 대신 표시된다.
 */
export default function KoglMark({ className = "" }: { className?: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className={`inline-flex flex-shrink-0 items-center gap-1.5 rounded border border-[#1a4fa0] bg-white px-2.5 py-1.5 text-xs font-bold text-[#1a4fa0] ${className}`}
      >
        <span aria-hidden="true">OPEN</span>
        공공누리 제1유형
      </span>
    );
  }

  return (
    <img
      src="/images/kogl-type1.png"
      alt="공공누리 제1유형 : 출처표시"
      onError={() => setFailed(true)}
      className={`h-12 w-auto flex-shrink-0 ${className}`}
    />
  );
}
