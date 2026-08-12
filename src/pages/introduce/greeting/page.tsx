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

const greetings = [
  {
    key: "chairman",
    label: "이사장",
    name: "여수문",
    position: "여수문화재단 이사장",
    title: "품격 있는 문화도시, 여수를 향한 힘찬 여정에 함께해 주십시오",
    subtitle: "여수문화재단을 찾아주신 시민 여러분, 반갑습니다.",
    image: "https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20a%20middle-aged%20Korean%20man%20in%20his%20mid-fifties%20wearing%20a%20dark%20navy%20suit%20with%20a%20white%20dress%20shirt%2C%20warm%20and%20trustworthy%20expression%2C%20soft%20natural%20studio%20lighting%2C%20clean%20white%20background%2C%20professional%20corporate%20headshot%20photography%20style%20with%20subtle%20smile%20and%20direct%20eye%20contact%2C%20conservative%20and%20dignified%20appearance%20suitable%20for%20a%20cultural%20foundation%20chairman%20portrait%20photography&width=520&height=640&seq=chairman-yeosumun-2026&orientation=portrait",
    content: `여수시는 인구 50만 명을 달성하며, 당당히 대도시로 도약했습니다. 풍부한 잠재력과 경쟁력을 지닌 여수는, 100만 문화도시로의 비상을 준비하고 있습니다.

이러한 변화와 도전 속에서, 지역민과 문화인들의 오랜 염원을 담아 여수문화재단이 출범하게 되었습니다. 재단은 지역의 역사와 문화, 예술 자원을 아우르는 통합 문화예술 플랫폼으로서, 누구나 차별 없이 마음껏 문화예술을 즐길 수 있는 환경을 조성하겠습니다.

시민 여러분의 다양한 목소리에 귀 기울이며, 모두가 참여하고 함께 만드는 문화예술을 실현해 나가겠습니다. 시민과 함께 성장하며, 예술과 문화가 일상 속에서 살아 숨 쉬는 '품격 있는 문화도시, 여수'를 만들어 가겠습니다.

여러분의 따뜻한 관심과 성원을 부탁드립니다.`,
    signature: "여수문화재단 이사장 여수문",
    visionItems: [
      { icon: "ri-user-heart-line", text: "모든 시민이 누리는 문화복지 실현" },
      { icon: "ri-building-2-line", text: "지역 예술인의 창작 활동 지원" },
      { icon: "ri-global-line", text: "글로벌 문화도시로의 도약" },
    ],
  },
  {
    key: "ceo",
    label: "대표이사",
    name: "화재단",
    position: "여수문화재단 대표이사",
    title: "시민의 삶에 문화의 가치를 더하는 재단이 되겠습니다",
    subtitle: "안녕하십니까, 여수문화재단 대표이사 화재단입니다.",
    image: "https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20a%20middle-aged%20Korean%20man%20in%20his%20late%20forties%20wearing%20a%20charcoal%20gray%20suit%20with%20a%20light%20blue%20tie%2C%20confident%20and%20approachable%20expression%2C%20soft%20diffused%20studio%20lighting%2C%20clean%20light%20gray%20background%2C%20modern%20corporate%20headshot%20photography%2C%20gentle%20professional%20smile%20with%20warm%20eye%20contact%2C%20competent%20and%20friendly%20appearance%20suitable%20for%20a%20cultural%20foundation%20CEO%20portrait&width=520&height=640&seq=ceo-hwajaedan-2026&orientation=portrait",
    content: `여수문화재단은 '시민과 함께하는 문화예술의 가치 실현'이라는 사명 아래, 공연·전시·교육·축제 등 다양한 문화예술 프로그램을 통해 여수 시민들의 삶의 질을 높이는 데 최선을 다하고 있습니다.

우리 재단은 단순한 문화시설 운영을 넘어, 지역 예술인들이 마음껏 창작 활동을 펼칠 수 있는 플랫폼이자, 시민 누구나 일상에서 문화를 향유할 수 있는 열린 공간이 되고자 합니다.

앞으로도 변함없는 열정과 사명감으로 여수의 문화예술 발전을 위해 정진하겠습니다. 여러분의 많은 관심과 참여를 부탁드립니다.`,
    signature: "여수문화재단 대표이사 화재단",
    visionItems: [
      { icon: "ri-music-2-line", text: "수준 높은 공연·전시 콘텐츠 제공" },
      { icon: "ri-group-line", text: "시민 참여형 문화 프로그램 확대" },
      { icon: "ri-lightbulb-line", text: "지역 문화예술 생태계 조성" },
    ],
  },
];

export default function GreetingPage() {
  const [activeTab, setActiveTab] = useState<"chairman" | "ceo">("chairman");
  const current = greetings.find((g) => g.key === activeTab)!;

  return (
    <SubPageLayout
      categoryLabel="재단소개"
      categoryPath="/introduce/greeting"
      currentLabel="인사말"
      tabs={introduceTabs}
    >
      <div className="px-4 md:px-8 py-10 max-w-5xl mx-auto">
        {/* 페이지 타이틀 */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">인사말</h2>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed">
            여수문화재단을 이끌어가는 이사장과 대표이사의 인사말을 통해
            재단이 추구하는 비전과 약속을 확인하실 수 있습니다.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-gray-100 rounded-full p-1">
            {greetings.map((g) => (
              <button
                key={g.key}
                onClick={() => setActiveTab(g.key as "chairman" | "ceo")}
                className={`px-8 py-2.5 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 whitespace-nowrap ${
                  activeTab === g.key
                    ? "bg-white text-[#1a4fa0] shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {g.label} 인사말
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
          {/* Photo */}
          <div className="flex-shrink-0 flex justify-center lg:justify-start">
            <div className="relative">
              <div className="w-[240px] h-[300px] lg:w-[260px] lg:h-[320px] overflow-hidden rounded-2xl">
                <img
                  alt={current.position}
                  className="w-full h-full object-cover object-top"
                  src={current.image}
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-full h-full rounded-2xl bg-[#1a4fa0]/10 -z-10"></div>
              <div className="mt-5 text-center">
                <p className="text-sm font-bold text-gray-900">{current.name}</p>
                <p className="text-xs text-gray-500">{current.position}</p>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="mb-2">
              <span className="text-4xl text-[#1a4fa0]/20 font-serif leading-none">&ldquo;</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug mb-2">
              {current.title}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {current.subtitle}
            </p>
            <div className="w-12 h-0.5 bg-[#f5a623] mb-6"></div>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-line mb-8">
              {current.content}
            </p>

            {/* Vision Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
              {current.visionItems.map((item, i) => (
                <div
                  key={i}
                  className="bg-gray-50/80 border border-gray-100 rounded-xl p-4 flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#1a4fa0]/10 flex items-center justify-center flex-shrink-0">
                    <i className={`${item.icon} text-[#1a4fa0] text-sm`}></i>
                  </div>
                  <span className="text-xs text-gray-700 font-medium leading-snug">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Signature */}
            <div className="text-right">
              <p className="text-sm font-bold text-gray-800 whitespace-pre-line">{current.signature}</p>
            </div>
          </div>
        </div>
      </div>
    </SubPageLayout>
  );
}