// ============================================================
// 실제 재단/여수시 공개 자산 (여수시청 yeosu.go.kr 공개 이미지)
// 임시(readdy) 자산보다 "우선/상단" 노출되도록 각 컴포넌트에서 앞에 합쳐 씁니다.
// 임시 자산은 일괄 삭제 예정이므로 이 파일의 실자산은 그대로 두면 됩니다.
//   - 로고/캐릭터는 사용자가 직접 제작한 자산이라 교체하지 않습니다.
// ============================================================

const Y = "https://www.yeosu.go.kr";

// 히어로 슬라이드 — 실제 여수 문화행사 사진 (제목 오버레이 표시)
export const realHeroSlides = [
  {
    id: 9001,
    title: "국가무형유산 여수별산대놀이 상설공연",
    link: `${Y}/www/index.do`,
    image: `${Y}/DATA/bbs/14/20260610014932603rxrixu.jpg`,
  },
  {
    id: 9002,
    title: "여수시립합창단 정기연주회",
    link: `${Y}/www/index.do`,
    image: `${Y}/DATA/bbs/14/20260605093345131OmbkU9.jpg`,
  },
];

// 소식(공지/보도) — 실제 여수 문화행사 헤드라인 (이 섹션은 이미지 없이 제목만 노출)
export const realNewsItems = [
  { id: 9001, category: "보도자료", title: "국가무형유산 여수별산대놀이 상설공연 개최 안내", date: "2026-06-10", isNew: true },
  { id: 9002, category: "보도자료", title: "여수시립합창단 정기연주회 개최", date: "2026-06-05", isNew: true },
  { id: 9003, category: "공지사항", title: "청년 취업 멘토링 콘서트 참가자 모집", date: "2026-06-05", isNew: true },
];

// 협력기관 — 실제 여수시 로고
export const realPartners: { id: number; name: string; link: string; image: string }[] = [];
