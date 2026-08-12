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

export default function LocationPage() {
  return (
    <SubPageLayout
      categoryLabel="재단소개"
      categoryPath="/introduce/greeting"
      currentLabel="오시는길"
      tabs={introduceTabs}
    >
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">오시는길</h2>

      <div className="px-4 md:px-8 py-10">
        {/* Map */}
        <div className="w-full h-[400px] md:h-[480px] rounded-xl overflow-hidden border border-gray-200 mb-8">
          <iframe
            title="여수문화재단 위치"
            src="https://www.google.com/maps?q=%EA%B2%BD%EA%B8%B0%EB%8F%84%20%EC%96%91%EC%A3%BC%EC%8B%9C%20%EA%B4%91%EC%A0%81%EB%A9%B4%20%EB%B6%80%ED%9D%A5%EB%A1%9C618%EB%B2%88%EA%B8%B8%20303&output=embed"
            width="100%"
            height="100%"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={{ border: 0 }}
          ></iframe>
        </div>

        {/* Address */}
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl border border-gray-200">
            <div className="w-10 h-10 flex items-center justify-center bg-[#1a4fa0]/10 rounded-full flex-shrink-0">
              <i className="ri-map-pin-2-fill text-[#1a4fa0] text-lg"></i>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-1">주소</h3>
              <p className="text-sm text-gray-600">(우)11461, 경기도 여수시 광적면 부흥로618번길 303</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 지하철 */}
            <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl border border-gray-200">
              <div className="w-10 h-10 flex items-center justify-center bg-[#4db8a6]/10 rounded-full flex-shrink-0">
                <i className="ri-train-line text-[#4db8a6] text-lg"></i>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-2">지하철 이용 시</h3>
                <p className="text-xs text-gray-500 leading-relaxed">수도권 전철 1호선 여수역 하차 → 버스 이용 (30분 소요)</p>
              </div>
            </div>

            {/* 버스 */}
            <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl border border-gray-200">
              <div className="w-10 h-10 flex items-center justify-center bg-[#f5a623]/10 rounded-full flex-shrink-0">
                <i className="ri-bus-line text-[#f5a623] text-lg"></i>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-2">버스 이용 시</h3>
                <p className="text-xs text-gray-500 mb-2">여수도시공사·문화예술회관 정류장 하차</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 bg-[#4db8a6] text-white text-xs font-bold rounded">마을버스</span>
                    <span className="text-xs text-gray-600">55, 55-1, 78</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 bg-[#f5a623] text-white text-xs font-bold rounded">시내버스</span>
                    <span className="text-xs text-gray-600">31, 39, 53, 360</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SubPageLayout>
  );
}