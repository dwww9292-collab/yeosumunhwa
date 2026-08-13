// DEMO: 시연용 이미지 오버라이드. 실서비스 전환 시 제거
//
// 시연 프로토타입용 로컬 이미지 맵.
// DB(Supabase) 조회 로직은 그대로 두고 "이미지 소스만" 이 파일 값으로 덮어쓴다.
// 제목·날짜 등 텍스트는 DB 값을 그대로 사용한다.
//
// 이미지 추가 방법:
//   1) public/images/yeosu/ 에 파일을 넣고
//   2) 아래 DEMO_IMAGE_GROUPS 의 해당 그룹 배열에 파일명만 추가하면 된다.
//
// 끄는 방법: DEMO_IMAGE_OVERRIDE 를 false 로 바꾸면 전부 DB 이미지로 돌아간다.

/** 시연용 오버라이드 on/off 단일 스위치 */
export const DEMO_IMAGE_OVERRIDE = true;

const BASE_PATH = "/images/yeosu";

/**
 * 주제별 이미지 그룹.
 * 섹션 성격에 맞는 그룹을 배정해 같은 컷이 화면 곳곳에 반복되지 않게 한다.
 */
const DEMO_IMAGE_GROUPS = {
  /** 오동도 동백길 · 등대 (주간, 서정적) */
  odongdo: ["odongdo-1.png", "odongdo-2.png", "odongdo-3.png", "odongdo-4.png", "odongdo-5.png"],
  /** 2026 여수세계섬박람회 게이트 · 포토존 (주간, 밝고 공식적) */
  expo: ["expo-1.png", "expo-2.png", "expo-3.png", "expo-4.png", "expo-5.png"],
  /** 여수밤바다 · BIG-O SHOW (야간, 화려함) */
  bigo: ["bigo-1.png", "bigo-2.png", "bigo-3.png", "bigo-4.png", "bigo-5.png"],
} as const;

const toPath = (file: string) => `${BASE_PATH}/${file}`;

const ALL_FILES: string[] = Object.values(DEMO_IMAGE_GROUPS).flat();

/** 키(확장자 뺀 파일명) → 로컬 경로. 예: DEMO_IMAGES["expo-1"] */
export const DEMO_IMAGES: Record<string, string> = Object.fromEntries(
  ALL_FILES.map((file) => [file.replace(/\.\w+$/, ""), toPath(file)]),
);

/** 그룹 전체 경로 */
function group(name: keyof typeof DEMO_IMAGE_GROUPS): string[] {
  return DEMO_IMAGE_GROUPS[name].map(toPath);
}

/**
 * 히어로 슬라이드.
 * 주간(오동도) → 공식(섬박람회) → 야간(BIG-O) 순으로 섞어 단조로움을 피한다.
 * 5초 간격이라 6장이면 한 바퀴 30초.
 */
export const DEMO_HERO_IMAGES: string[] = [
  "/images/hero1.png",
  DEMO_IMAGES["odongdo-2"],
  "/images/island1.png",
  DEMO_IMAGES["odongdo-1"],
  DEMO_IMAGES["odongdo-3"],
  DEMO_IMAGES["odongdo-4"],
  DEMO_IMAGES["odongdo-5"],
].filter(Boolean);

/** 섹션별 카드 이미지 풀 */
export const DEMO_POOLS = {
  /** 문화사업 — 밝고 서정적인 주간 컷 */
  business: [...group("odongdo"), ...group("expo")],
  /** 공연·전시·축제 — 야간 축제 컷 위주 */
  performance: [...group("bigo"), ...group("expo")],
  /** 공간소개 배너 — 박람회장·전망 컷 */
  spaceBanner: [...group("expo"), ...group("bigo")],
} as const;

/** 전체 풀 (그룹 구분 없이 쓰고 싶을 때) */
export const DEMO_CARD_IMAGES: string[] = ALL_FILES.map(toPath);

/** 목록 index 로 이미지를 순환 배정 */
export function demoImageAt(pool: readonly string[], index: number): string {
  if (pool.length === 0) return "";
  return pool[index % pool.length];
}

/** 기본 풀(전체)에서 순환 배정 */
export function demoCardImage(index: number): string {
  return demoImageAt(DEMO_CARD_IMAGES, index);
}

/**
 * 시연 이미지는 16:9 가로형이라, 기존 세로형 카드(aspect-[3/4])에 넣으면
 * 캐릭터와 사인물 문구가 잘린다. 시연 중에는 원본 비율에 맞춘 카드 비율을 쓴다.
 */
export const DEMO_CARD_ASPECT = "aspect-[16/9]";

/**
 * 히어로 높이.
 * 기본값(모바일 600px)은 16:9 이미지를 세로로 크게 확대해 좌우를 심하게 잘라
 * 캐릭터가 화면 밖으로 밀린다. 시연 중에는 모바일 높이를 낮춰 잘림을 줄인다.
 */
export const DEMO_HERO_HEIGHT =
  "h-[440px] sm:h-[560px] md:h-[760px] lg:h-[900px] xl:h-[980px]";
