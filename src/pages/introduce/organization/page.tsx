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

const teamData = [
  {
    name: "경영지원팀",
    description: "재단 운영의 근간을 책임지는 팀으로, 인사·재무·시설관리·총무 등 조직의 안정적 운영을 총괄합니다.",
    color: "#1a4fa0",
    members: [
      { role: "팀장", phone: "031-950-8410", duties: ["경영지원업무 총괄", "유관기관 협력", "감사(윤리 및 인권경영)", "경영전략(ESG)", "기관 홍보"] },
      { role: "팀원", phone: "031-950-8411", duties: ["조직·정원·인사·노무", "예산", "경영평가", "이사회·제규정", "시·시의회 대응"] },
      { role: "팀원", phone: "031-950-8412", duties: ["건축 시설 유지관리", "시민회관 청사관리", "안전·보건관리", "계약(물품·공사)", "직원 교육"] },
      { role: "팀원", phone: "031-950-8413", duties: ["재무·세무관리, 결산", "급여", "복리후생", "경영공시 및 통합공시", "홈페이지 관리"] },
      { role: "팀원", phone: "031-950-8414", duties: ["소방 안전관리", "기계설비 유지관리", "소방 시스템 관리", "전산시스템 관리", "정보보안, 차량관리"] },
      { role: "팀원", phone: "031-950-8415", duties: ["지출, 회계관리", "계약(물품·공사·용역)", "복무관리", "총무 및 기록물관리"] },
      { role: "팀원", phone: "031-950-8416", duties: ["전기안전관리", "전기 및 승강기 유지관리", "공공요금 납부", "물품구매 및 자산관리", "개인정보보호(CCTV), 통신"] },
    ],
  },
  {
    name: "문화사업팀",
    description: "지역문화 활성화와 문화예술교육을 기획·운영하며, 시민 누구나 문화를 누릴 수 있도록 다양한 프로그램을 발굴합니다.",
    color: "#2d8c4a",
    members: [
      { role: "팀장", phone: "031-950-8420", duties: ["문화사업 총괄 기획", "지역문화 활성화 사업", "문화예술교육 사업", "공연창작 지원사업"] },
      { role: "팀원", phone: "031-950-8421", duties: ["가가호호 프로그램 운영", "율곡문화학당 운영", "찾아가는 문화하루 운영", "혜음원지 방문자센터 운영"] },
      { role: "팀원", phone: "031-950-8422", duties: ["지원사업 공모 및 심사", "예술인 지원", "문화복지 사업", "생활문화 지원사업"] },
    ],
  },
  {
    name: "공연전시팀",
    description: "수준 높은 공연과 전시를 기획하고 운영하는 팀으로, 시민들에게 품격 있는 문화예술 경험을 제공합니다.",
    color: "#f5a623",
    members: [
      { role: "팀장", phone: "031-950-8430", duties: ["공연사업 총괄", "기획공연 운영", "문화살롱 운영", "실내악 시리즈 운영"] },
      { role: "팀원", phone: "031-950-8431", duties: ["대관 심사 및 관리", "공연장 운영", "전시 기획", "축제 운영"] },
      { role: "팀원", phone: "031-950-8432", duties: ["공연 기술 지원", "음향·조명 운영", "무대 제작", "장비 관리"] },
    ],
  },
  {
    name: "무대운영팀",
    description: "공연장 무대의 기술적 운영을 책임지는 전문 팀으로, 안전하고 완벽한 공연 환경을 조성합니다.",
    color: "#8b5cf6",
    members: [
      { role: "팀장", phone: "031-950-8440", duties: ["무대 총괄 운영", "시설 유지보수", "안전 관리", "장비 점검"] },
      { role: "팀원", phone: "031-950-8441", duties: ["무대 설치 및 철수", "음향 장비 운영", "조명 시스템 운영"] },
      { role: "팀원", phone: "031-950-8442", duties: ["영상 장비 운영", "인터넷 방송 지원", "공연장 청소 및 관리"] },
    ],
  },
];

export default function OrganizationPage() {
  const [activeTeam, setActiveTeam] = useState("경영지원팀");
  const team = teamData.find((t) => t.name === activeTeam)!;

  return (
    <SubPageLayout
      categoryLabel="재단소개"
      categoryPath="/introduce/greeting"
      currentLabel="조직소개"
      tabs={introduceTabs}
    >
      <div className="px-4 md:px-8 py-10 max-w-5xl mx-auto">
        {/* 페이지 타이틀 */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">조직소개</h2>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed">
            양주문화재단은 이사장과 대표이사를 중심으로 4개의 전문팀이 유기적으로 협력하여
            양주의 문화예술 발전을 위해 최선을 다하고 있습니다.
          </p>
        </div>

        {/* 조직도 */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-1.5 h-8 bg-[#1a4fa0] rounded-full"></span>
            <h3 className="text-lg font-bold text-gray-900">조직 구성</h3>
          </div>

          <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-8 md:p-10">
            {/* Top level */}
            <div className="flex justify-center mb-3">
              <div className="bg-[#1a4fa0] text-white px-10 py-3 rounded-full text-sm font-bold shadow-sm">이사장</div>
            </div>
            <div className="flex justify-center mb-3">
              <div className="w-0.5 h-5 bg-[#1a4fa0]/30"></div>
            </div>

            {/* Second level */}
            <div className="flex justify-center items-start gap-8 mb-3">
              <div className="flex flex-col items-center">
                <div className="border-2 border-[#1a4fa0]/30 text-[#1a4fa0] px-6 py-2.5 rounded-full text-xs font-medium bg-white">
                  이사회
                </div>
                <span className="text-[10px] text-gray-400 mt-1">비상임</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-[#1a4fa0]/85 text-white px-10 py-3 rounded-full text-sm font-bold shadow-sm">대표이사</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="border-2 border-[#1a4fa0]/30 text-[#1a4fa0] px-6 py-2.5 rounded-full text-xs font-medium bg-white">
                  감사
                </div>
              </div>
            </div>

            <div className="flex justify-center mb-4">
              <div className="w-0.5 h-5 bg-[#1a4fa0]/30"></div>
            </div>

            {/* Teams */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {teamData.map((t) => (
                <button
                  key={t.name}
                  onClick={() => setActiveTeam(t.name)}
                  className="py-3 px-2 rounded-xl text-xs font-bold cursor-pointer transition-all duration-200 border-2 text-center whitespace-nowrap"
                  style={{
                    borderColor: activeTeam === t.name ? t.color : `${t.color}30`,
                    backgroundColor: activeTeam === t.name ? `${t.color}15` : "white",
                    color: activeTeam === t.name ? t.color : "#6b7280",
                  }}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Team Detail */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span
              className="w-1.5 h-8 rounded-full"
              style={{ backgroundColor: team.color }}
            ></span>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{activeTeam}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{team.description}</p>
            </div>
          </div>

          {/* Members count */}
          <div className="flex items-center gap-4 mb-5">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <i className="ri-team-line"></i>
              <span>총 {team.members.length}명</span>
            </div>
          </div>

          {/* Team Table */}
          <div className="bg-gray-50/80 border border-gray-100 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-white border-b border-gray-100">
                    <th className="px-5 py-3.5 text-left text-gray-500 font-medium text-xs uppercase tracking-wider w-20">직위</th>
                    <th className="px-5 py-3.5 text-left text-gray-500 font-medium text-xs uppercase tracking-wider w-40">전화번호</th>
                    <th className="px-5 py-3.5 text-left text-gray-500 font-medium text-xs uppercase tracking-wider">주요 업무</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {team.members.map((m, i) => (
                    <tr key={i} className="hover:bg-white/60 transition-colors">
                      <td className="px-5 py-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                            m.role === "팀장"
                              ? "text-white"
                              : "text-gray-600 bg-gray-100"
                          }`}
                          style={m.role === "팀장" ? { backgroundColor: team.color } : {}}
                        >
                          {m.role}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <i className="ri-phone-line text-gray-400 text-xs"></i>
                          <span className="text-xs">{m.phone}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {m.duties.map((d, j) => (
                            <span
                              key={j}
                              className="inline-block px-2 py-1 bg-white border border-gray-200 rounded-md text-xs text-gray-600"
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Contact Notice */}
          <div className="mt-6 p-4 bg-[#f5a623]/5 border border-[#f5a623]/20 rounded-xl flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#f5a623]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <i className="ri-information-line text-[#f5a623] text-sm"></i>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800 mb-1">업무 시간 안내</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                평일 09:00 ~ 18:00 (점심시간 12:00 ~ 13:00) · 주말 및 공휴일 휴무<br />
                업무 시간 외 문의는 이메일(pr@yjcf.or.kr)을 이용해 주시기 바랍니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SubPageLayout>
  );
}