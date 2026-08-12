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

export default function EstablishmentPage() {
  return (
    <SubPageLayout
      categoryLabel="재단소개"
      categoryPath="/introduce/greeting"
      currentLabel="설립 및 운영"
      tabs={introduceTabs}
    >
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">설립 및 운영</h2>

      <div className="px-4 md:px-8 py-10">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">설립 및 운영</h2>

        {/* Vision */}
        <div className="mb-8 flex flex-col items-center">
          <p className="text-sm font-semibold text-gray-500 mb-3">비전</p>
          <div className="w-full max-w-xl bg-[#1a4fa0] rounded-full px-8 py-4 text-center text-white text-base md:text-lg font-bold">
            시민과 동행하는 문화도시 여수
          </div>
        </div>

        {/* Mission */}
        <div className="mb-10 flex flex-col items-center">
          <p className="text-sm font-semibold text-gray-500 mb-3">목표</p>
          <div className="w-full max-w-xl border-2 border-[#1a4fa0]/40 rounded-full px-8 py-4 text-center text-[#1a4fa0] text-base font-bold">
            문화예술로 사회적 가치를 실현하는 여수문화재단
          </div>
        </div>

        {/* Strategic Goals */}
        <div className="mb-10">
          <p className="text-sm font-semibold text-gray-500 text-center mb-5">전략과제</p>
          <div className="max-w-2xl mx-auto border-2 border-[#1a4fa0]/10 rounded-2xl p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "시민 문화권 확산", items: ["생활문화 활성화", "공연 및 문화예술 강좌를 통한 시민 삶의 질 향상"] },
                { title: "문화복지 실현", items: ["공정한 문화접근성 확대", "예술인 지원을 통한 창작여건 개선"] },
                { title: "지역문화예술자원활성화", items: ["지역 문화 콘텐츠 활용 축제, 행사, 기획", "지역 문화유산 활용 사업"] },
                { title: "소통과 협력의 열린 경영", items: ["민관 동반 성장 도모", "문화예술 거버넌스 실현"] },
              ].map((g, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-sm font-bold text-white bg-[#1a4fa0]/70 rounded px-3 py-1.5 mb-3 text-center">
                    {g.title}
                  </h3>
                  <ul className="space-y-1">
                    {g.items.map((item, j) => (
                      <li key={j} className="text-xs text-gray-600 flex items-start gap-1">
                        <span className="text-[#1a4fa0] mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Projects */}
        <div>
          <p className="text-sm font-semibold text-gray-500 text-center mb-6">주요사업</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { icon: "ri-music-line", title: "문화예술진흥사업", desc: "생활문화사업,\n지역문화예술\n인력양성 등" },
              { icon: "ri-heart-line", title: "문화복지사업", desc: "취약계층 문화복지 지원,\n예술 창작지원 등" },
              { icon: "ri-gamepad-line", title: "지역문화콘텐츠사업", desc: "문화유산 활용사업,\n축제·공연" },
              { icon: "ri-building-2-line", title: "공연시설운영사업", desc: "공연장 등 문화시설\n운영·관리" },
            ].map((p, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-5 text-center hover:border-[#1a4fa0]/40 transition-colors">
                <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3 bg-[#1a4fa0]/10 rounded-full">
                  <i className={`${p.icon} text-3xl text-[#1a4fa0]`}></i>
                </div>
                <h3 className="text-xs font-bold text-gray-800 mb-2">{p.title}</h3>
                <p className="text-xs text-gray-500 whitespace-pre-line leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SubPageLayout>
  );
}