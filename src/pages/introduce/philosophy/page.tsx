import { useState } from "react";
import SubPageLayout from "@/components/feature/SubPageLayout";

const introduceTabs = [
  { label: "인사말", href: "/introduce/greeting" },
  { label: "설립 및 운영", href: "/introduce/establishment" },
  { label: "조직소개", href: "/introduce/organization" },
  { label: "CI소개", href: "/introduce/ci" },
  { label: "재단소개", href: "/introduce/philosophy" },
  { label: "경영공시", href: "/introduce/announce" },
  { label: "오시는길", href: "/introduce/location" },
];

type PhilosophyTab = "윤리경영" | "인권경영" | "ESG경영";

const philosophyContents: Record<PhilosophyTab, { title: string; items: string[] }> = {
  "윤리경영": {
    title: "반부패·청렴 서약서",
    items: [
      "모든 업무는 법과 원칙을 준수하고 사익보다 공익을 우선하며, 업무수행 과정에서 부당한 이익을 추구하지 않겠습니다.",
      "직위를 이용한 지위·권한 남용, 이권개입, 알선·청탁을 하지 않겠습니다.",
      "어떠한 경우에도 금품·향응을 받지 않으며, 청렴성에 의심을 받을 만한 일체의 행동을 하지 않겠습니다.",
      "외부의 부당한 간섭을 철저히 배제함으로써 청렴한 조직문화를 위해 솔선수범하고 행동강령과 공직윤리를 준수하겠습니다.",
    ],
  },
  "인권경영": {
    title: "인권경영 선언문",
    items: [
      "모든 임직원의 인권을 존중하고 차별 없는 근무환경을 조성하겠습니다.",
      "우리 사업과 관련된 모든 이해관계자의 인권을 보호하겠습니다.",
      "안전하고 건강한 근무환경을 제공하겠습니다.",
      "인권침해 사례가 발생할 경우 즉각적인 구제 조치를 시행하겠습니다.",
    ],
  },
  "ESG경영": {
    title: "ESG 경영 선언문",
    items: [
      "환경(E): 탄소 중립 실현을 위한 친환경 사업장 운영에 앞장서겠습니다.",
      "사회(S): 지역사회와 함께 성장하는 상생 경영을 실천하겠습니다.",
      "지배구조(G): 투명하고 공정한 경영으로 이해관계자의 신뢰를 확보하겠습니다.",
      "지속가능한 문화예술 생태계 조성을 위해 책임 있는 경영을 실천하겠습니다.",
    ],
  },
};

export default function PhilosophyPage() {
  const [activeTab, setActiveTab] = useState<PhilosophyTab>("윤리경영");
  const content = philosophyContents[activeTab];

  return (
    <SubPageLayout
      categoryLabel="재단소개"
      categoryPath="/introduce/greeting"
      currentLabel="재단소개"
      tabs={introduceTabs}
    >
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">재단소개</h2>

      <div className="px-4 md:px-8 py-10">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">경영철학</h2>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-10">
          {(["윤리경영", "인권경영", "ESG경영"] as PhilosophyTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-8 py-2.5 rounded-full text-sm font-medium cursor-pointer border transition-colors whitespace-nowrap ${
                activeTab === t
                  ? "bg-[#1a4fa0] text-white border-[#1a4fa0]"
                  : "bg-white text-gray-600 border-gray-300 hover:border-[#1a4fa0]/50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Content Card */}
        <div className="max-w-3xl mx-auto border-2 border-gray-200 rounded-2xl p-8 md:p-12">
          <h3 className="text-2xl font-bold text-center text-[#1a4fa0] mb-2">{content.title}</h3>
          <div className="flex justify-center mb-6">
            <div className="w-10 h-0.5 bg-[#1a4fa0]/30"></div>
          </div>
          <p className="text-sm text-gray-600 text-center leading-relaxed mb-8">
            본인은 여수문화재단 임직원으로서 임직원행동강령을 준수함은<br />
            물론 청렴하고 검소한 생활을 통해 공직사회의 부패를 척결하고<br />
            공정한 사회를 조성하는데 모범이 될 것을 다짐하며 다음과 같이 서약합니다.
          </p>
          <ol className="space-y-5 mb-10">
            {content.items.map((item, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-[#1a4fa0] text-white flex items-center justify-center text-xs font-bold">
                  하나.
                </span>
                <p className="text-sm text-gray-700 leading-relaxed pt-2">{item}</p>
              </li>
            ))}
          </ol>
          <div className="border-t border-gray-200 pt-6 text-center">
            <p className="text-sm text-gray-600 mb-3">만약 위사항을 위반하였을 경우에는 어떠한 처벌이나 불이익도 감수할 것을 다짐합니다.</p>
            <p className="text-base font-bold text-gray-800 mb-3">재단법인 여수문화재단 임직원 일동</p>
            <div className="flex justify-center">
              <img
                alt="여수문화재단 로고"
                className="h-8 object-contain"
                src="https://storage.readdy-site.link/project_files/82038e88-bc77-4e0d-916f-e97740fcc1f6/44994b6e-d2cb-414b-983e-4d8108dcb071_---.png?v=05b6e11fe497f095af4bda6ced60f4a8"
              />
            </div>
          </div>
        </div>
      </div>
    </SubPageLayout>
  );
}