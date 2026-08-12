import { useParams } from "react-router-dom";
import SubPageLayout from "@/components/feature/SubPageLayout";

type Slug = "privacy" | "terms" | "video" | "email";

const TABS: { label: string; href: string; slug: Slug }[] = [
  { label: "개인정보처리방침", href: "/policy/privacy", slug: "privacy" },
  { label: "영상정보처리기기 운영·관리 방침", href: "/policy/video", slug: "video" },
  { label: "서비스 이용약관", href: "/policy/terms", slug: "terms" },
  { label: "이메일무단수집거부", href: "/policy/email", slug: "email" },
];

interface Section {
  heading: string;
  body: string;
}

const CONTENT: Record<Slug, { title: string; intro: string; sections: Section[] }> = {
  privacy: {
    title: "개인정보처리방침",
    intro:
      "여수문화재단(이하 '재단')은 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같이 개인정보처리방침을 수립·공개합니다.",
    sections: [
      {
        heading: "제1조 (개인정보의 처리 목적)",
        body:
          "재단은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.\n- 공연·전시·축제 관람 및 시설 대관 신청 처리\n- 문화예술교육 프로그램 신청 및 운영\n- 민원 처리 및 고지사항 전달",
      },
      {
        heading: "제2조 (개인정보의 처리 및 보유 기간)",
        body:
          "재단은 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 보유·이용기간 내에서 개인정보를 처리·보유합니다. 대관·교육 신청 정보는 처리 목적 달성 후 관련 법령에 따라 보관 후 파기합니다.",
      },
      {
        heading: "제3조 (정보주체의 권리·의무)",
        body:
          "정보주체는 재단에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다.",
      },
      {
        heading: "제4조 (개인정보 보호책임자)",
        body:
          // TODO: 재단 확정 대표전화 확보 후 입력 (기존 031-828-9772는 양주문화재단 번호)
          "재단은 개인정보 처리에 관한 업무를 총괄해서 책임지고, 정보주체의 불만처리 및 피해구제를 위하여 개인정보 보호책임자를 지정하고 있습니다.\n- 문의: 여수문화재단 대표전화 [확인필요]",
      },
    ],
  },
  video: {
    title: "영상정보처리기기 운영·관리 방침",
    intro:
      "여수문화재단은 「개인정보 보호법」 제25조 제7항에 따라 영상정보처리기기(CCTV)의 운영·관리에 관한 방침을 다음과 같이 수립·공개합니다.",
    sections: [
      { heading: "설치 근거 및 목적", body: "재단은 시설 안전 및 화재·범죄 예방, 시설 이용자의 안전 확보를 위하여 영상정보처리기기를 설치·운영합니다." },
      { heading: "설치 대수 및 촬영 범위", body: "각 문화시설의 주요 출입구·로비·공연장 주변 등에 설치되어 있으며, 24시간 연속 촬영합니다." },
      // TODO: 재단 확정 대표전화 확보 후 입력 (기존 031-828-9772는 양주문화재단 번호)
      { heading: "관리책임자 및 열람", body: "영상정보의 보관·관리 책임은 각 시설 운영팀에 있으며, 영상정보 열람 요청은 대표전화([확인필요])로 문의하시기 바랍니다." },
      { heading: "보관 기간 및 파기", body: "촬영된 영상정보는 관련 법령이 정한 기간 동안 보관 후 지체 없이 파기합니다." },
    ],
  },
  terms: {
    title: "서비스 이용약관",
    intro: "본 약관은 여수문화재단이 제공하는 웹사이트 및 관련 서비스의 이용 조건과 절차, 이용자와 재단의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.",
    sections: [
      { heading: "제1조 (목적)", body: "본 약관은 이용자가 재단 웹사이트를 통해 제공받는 공연·전시·축제 안내, 시설 대관 신청, 문화예술교육 신청 등 서비스의 이용에 관한 사항을 규정합니다." },
      { heading: "제2조 (약관의 효력 및 변경)", body: "본 약관은 웹사이트에 게시함으로써 효력이 발생하며, 재단은 관련 법령을 위배하지 않는 범위에서 약관을 변경할 수 있습니다. 변경 시 적용일자 및 변경 사유를 명시하여 사전 공지합니다." },
      { heading: "제3조 (서비스의 제공 및 변경)", body: "재단은 안정적인 서비스 제공을 위해 노력하며, 운영상·기술상의 필요에 따라 제공하는 서비스의 내용을 변경할 수 있습니다." },
      { heading: "제4조 (이용자의 의무)", body: "이용자는 관계 법령, 본 약관의 규정 및 이용 안내 등 재단이 통지하는 사항을 준수하여야 하며, 재단의 업무에 방해되는 행위를 하여서는 안 됩니다." },
    ],
  },
  email: {
    title: "이메일무단수집거부",
    intro: "본 웹사이트에 게시된 이메일 주소가 전자우편 수집 프로그램이나 그 밖의 기술적 장치를 이용하여 무단으로 수집되는 것을 거부하며, 이를 위반 시 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」에 의해 처벌됨을 유념하시기 바랍니다.",
    sections: [
      { heading: "관련 법령", body: "「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 제50조의2(전자우편주소의 무단 수집행위 등 금지)에 따라 누구든지 인터넷 홈페이지 운영자의 사전 동의 없이 자동 수집 프로그램 등을 이용하여 전자우편주소를 수집하여서는 안 됩니다." },
      { heading: "위반 시 조치", body: "본 방침을 위반하여 이메일 주소를 무단 수집·판매·유통하거나 이를 이용한 경우 관련 법령에 따라 형사처벌 대상이 될 수 있습니다." },
    ],
  },
};

export default function PolicyPage() {
  const { slug } = useParams<{ slug: string }>();
  const key: Slug = (["privacy", "terms", "video", "email"] as Slug[]).includes(slug as Slug)
    ? (slug as Slug)
    : "privacy";
  const content = CONTENT[key];

  return (
    <SubPageLayout categoryLabel="이용안내" categoryPath="/policy/privacy" currentLabel={content.title} tabs={TABS}>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{content.title}</h2>
      <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 border border-gray-100 rounded-lg p-5 mb-8 whitespace-pre-line">
        {content.intro}
      </p>
      <div className="space-y-7">
        {content.sections.map((s) => (
          <section key={s.heading}>
            <h3 className="text-base font-bold text-gray-800 mb-2 pb-2 border-b-2 border-[#1a4fa0]">{s.heading}</h3>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{s.body}</p>
          </section>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-10 pt-6 border-t border-gray-100">
        ※ 본 문서는 시연용 프로토타입의 표준 양식 예시이며, 실제 시행 문서는 재단 법무·운영 검토 후 확정됩니다.
      </p>
    </SubPageLayout>
  );
}
