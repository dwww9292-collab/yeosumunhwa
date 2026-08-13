/**
 * 개인정보 패턴 검출
 *
 * 여수시 지침: "게시글 등록 시 주민번호, 전화번호 등 개인정보 패턴을
 *              자동으로 감지해 등록을 차단"
 *
 * ⚠️ 이 모듈은 화면에서 즉시 알려주기 위한 1차 방어선일 뿐이다.
 *    브라우저 코드는 우회할 수 있으므로, 실제 차단은 DB 트리거가 담당한다.
 *    (supabase/pii_guard.sql — 두 곳의 규칙을 함께 고쳐야 한다)
 */

export type PiiKind = "rrn" | "phone" | "card" | "account" | "foreigner";

export interface PiiMatch {
  kind: PiiKind;
  label: string;
  sample: string;
}

const LABEL: Record<PiiKind, string> = {
  rrn: "주민등록번호",
  foreigner: "외국인등록번호",
  phone: "전화번호",
  card: "카드번호",
  account: "계좌번호",
};

/** 주민등록번호: 앞 6자리(생년월일) + 뒤 7자리, 성별코드 1~4 또는 5~8 */
const RRN = /(?<!\d)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[-\s]?[1-4]\d{6}(?!\d)/g;

/** 외국인등록번호: 성별코드 5~8 */
const FOREIGNER = /(?<!\d)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[-\s]?[5-8]\d{6}(?!\d)/g;

/** 휴대폰 및 지역번호 유선전화 */
const PHONE = /(?<!\d)(?:01[016789]|0(?:2|[3-6]\d))[-.\s]?\d{3,4}[-.\s]?\d{4}(?!\d)/g;

/** 신용카드: 4-4-4-4 */
const CARD = /(?<!\d)\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}(?!\d)/g;

/** 계좌번호로 흔한 형태 — 은행명이 함께 있을 때만 본다(오탐 방지) */
const ACCOUNT = /(?:은행|계좌|입금)\D{0,10}(?<!\d)\d{2,6}[-]\d{2,6}[-]\d{2,7}(?!\d)/g;

const RULES: { kind: PiiKind; re: RegExp }[] = [
  { kind: "rrn", re: RRN },
  { kind: "foreigner", re: FOREIGNER },
  { kind: "card", re: CARD },
  { kind: "phone", re: PHONE },
  { kind: "account", re: ACCOUNT },
];

/** 검출된 앞 4자리만 남기고 가린다 (경고 문구에 원문을 그대로 싣지 않기 위해) */
function mask(value: string): string {
  const head = value.slice(0, 4);
  return `${head}${"*".repeat(Math.max(value.length - 4, 3))}`;
}

/**
 * 여러 필드를 한 번에 검사한다.
 * @returns 검출된 항목들. 비어 있으면 통과.
 */
export function detectPii(...texts: (string | null | undefined)[]): PiiMatch[] {
  const joined = texts.filter(Boolean).join("\n");
  if (!joined.trim()) return [];

  const found: PiiMatch[] = [];
  const seen = new Set<PiiKind>();

  for (const { kind, re } of RULES) {
    re.lastIndex = 0;
    const m = re.exec(joined);
    if (m && !seen.has(kind)) {
      seen.add(kind);
      found.push({ kind, label: LABEL[kind], sample: mask(m[0]) });
    }
  }
  return found;
}

/** 사용자에게 보여줄 안내 문구 */
export function piiWarningMessage(matches: PiiMatch[]): string {
  const list = matches.map((m) => `${m.label}(${m.sample})`).join(", ");
  return `개인정보로 보이는 내용이 포함되어 등록할 수 없습니다: ${list}\n해당 부분을 삭제한 뒤 다시 시도해 주세요.`;
}
