/**
 * 개인정보 수집·이용 동의 정의
 *
 * 개인정보 보호법 제15조에 따라 수집 목적 · 항목 · 보유기간을 고지하고
 * 정보주체의 동의를 받아야 한다. 화면마다 문구가 흩어지지 않도록 여기서 관리한다.
 *
 * 항목을 늘리거나 줄일 때는 반드시 실제 수집 필드와 일치시킬 것.
 * (고지 항목과 실제 수집 항목이 다르면 그 자체가 위반이다)
 */

export interface ConsentSpec {
  /** 동의 블록 제목 */
  title: string;
  /** 수집 목적 */
  purpose: string;
  /** 수집 항목 — 실제 폼 필드와 일치해야 한다 */
  items: string;
  /** 보유·이용 기간 */
  retention: string;
  /** 동의 거부 시 안내 (필수 항목일 때) */
  refusal: string;
  /** 필수 여부 */
  required: boolean;
}

/** 대관 신청 — 신청 처리와 시설 운영을 위해 수집 */
export const RENTAL_CONSENT: ConsentSpec = {
  title: "개인정보 수집·이용 동의",
  purpose: "시설 대관 신청 접수·심사, 심사 결과 안내, 대관 일정 관리",
  items: "신청자명, 연락처, 이메일, 소속(기관·단체명)",
  retention: "대관 종료 후 3년 (「공공기록물 관리에 관한 법률」에 따른 보존기간)",
  refusal: "동의를 거부하실 수 있으나, 거부 시 대관 신청이 불가능합니다.",
  required: true,
};

/** 회원가입 — 계정 식별과 신청 이력 관리를 위해 수집 */
export const SIGNUP_CONSENT: ConsentSpec = {
  title: "개인정보 수집·이용 동의",
  purpose: "회원 식별 및 관리, 대관 신청 이력 조회, 비밀번호 찾기 등 본인 확인",
  items: "아이디, 이름, 이메일",
  retention: "회원 탈퇴 시까지 (관계 법령에 따른 보존 의무가 있는 경우 해당 기간)",
  refusal: "동의를 거부하실 수 있으나, 거부 시 회원가입이 불가능합니다.",
  required: true,
};

/** 회원가입 시 함께 받는 이용약관 동의 */
export const TERMS_CONSENT: ConsentSpec = {
  title: "서비스 이용약관 동의",
  purpose: "웹사이트 서비스 이용에 관한 재단과 이용자의 권리·의무 확인",
  items: "-",
  retention: "-",
  refusal: "동의를 거부하실 수 있으나, 거부 시 회원가입이 불가능합니다.",
  required: true,
};
