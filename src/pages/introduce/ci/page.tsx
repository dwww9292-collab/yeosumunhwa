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

const brandColors = [
  { name: "Blue", hex: "#1F4E8C", meaning: "시민과 문화의 포용과 연대" },
  { name: "Orange", hex: "#E65A2D", meaning: "풍자와 해학, 공연의 즐거움" },
  { name: "Green", hex: "#2E8F63", meaning: "자연과 역사, 지역의 정체성" },
  { name: "Black", hex: "#333333", meaning: "무대의 미소와 웃음, 문화의 무게" },
];

const logoUrl = "https://storage.readdy-site.link/project_files/c131d95e-3fd2-49fb-ba6a-132840b712bc/ba60fd5e-f242-4663-b1c8-d383e8733fca_--.png?v=93ff76686193c52cae3a05b60f3477b9";
const charactersUrl = "https://storage.readdy-site.link/project_files/c131d95e-3fd2-49fb-ba6a-132840b712bc/9c8f2833-e792-45cb-b046-64fb504c6cac_-.png?v=e358ee63a02090ab076d993a487f30ff";

export default function CIPage() {
  return (
    <SubPageLayout
      categoryLabel="재단소개"
      categoryPath="/introduce/greeting"
      currentLabel="CI소개"
      tabs={introduceTabs}
    >
      <div className="px-4 md:px-8 py-10 max-w-5xl mx-auto">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">CI소개</h2>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed">
            여수문화관광재단의 CI는 여수별산대놀이의 해학과 풍자, 그리고 여수의 전통과 자연을
            현대적으로 재해석하여 담아낸 브랜드 아이덴티티입니다.
          </p>
        </div>

        {/* ========== 심볼마크 ========== */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-1.5 h-8 bg-[#1F4E8C] rounded-full" />
            <h3 className="text-lg font-bold text-gray-900">심볼마크</h3>
          </div>

          <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-8 md:p-10">
            <div className="flex flex-col lg:flex-row gap-10 items-center">
              <div className="flex-shrink-0 w-full lg:w-72 flex items-center justify-center bg-white rounded-xl border border-gray-200 p-6">
                <img
                  alt="여수문화관광재단 심볼마크"
                  className="max-w-full max-h-[220px] object-contain"
                  src={logoUrl}
                />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-bold text-gray-900 mb-3">브랜드마크 형태 의미</h4>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  여수문화관광재단의 심볼마크는 여수별산대놀이의 세 가면 — <strong>말뚝이</strong>,
                  <strong>취발이</strong>, <strong>샌님</strong> — 의 특징을 현대적으로 추상화하여 담아냈습니다.
                  중앙의 오렌지 타원형은 취발이의 가면을, 좌측의 초록 곡선은 말뚝이의 풍자적인 미소를,
                  우측의 파란 곡선은 샌님의 유쾌한 형태를 상징합니다.
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  하단의 검정색 웃는 곡선은 무대의 미소와 웃음을, 풍자와 해학을 담은 공연의
                  즐거움을 표현합니다. 전체적으로 여수의 산과 흐름, 그리고 시민과 문화의
                  포용과 연대를 시각적으로 나타냅니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========== 컬러 시스템 ========== */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-1.5 h-8 bg-[#E65A2D] rounded-full" />
            <h3 className="text-lg font-bold text-gray-900">컬러 시스템</h3>
          </div>

          <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-8 md:p-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {brandColors.map((c) => (
                <div key={c.hex} className="bg-white rounded-xl border border-gray-200 p-5 text-center">
                  <div
                    className="w-16 h-16 rounded-full mx-auto mb-3"
                    style={{ backgroundColor: c.hex }}
                  />
                  <h5 className="text-sm font-bold text-gray-900 mb-1">{c.name}</h5>
                  <p className="text-xs text-gray-500 mb-2">{c.hex}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{c.meaning}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-6 leading-relaxed">
              ※ 상기 색상은 인쇄 매체와 디지털 매체에 따라 약간의 차이가 발생할 수 있으며,
              정확한 색상 재현을 위해서는 별도 배포되는 컬러 가이드북을 참고하시기 바랍니다.
            </p>
          </div>
        </section>

        {/* ========== 모티프 설명 ========== */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-1.5 h-8 bg-[#2E8F63] rounded-full" />
            <h3 className="text-lg font-bold text-gray-900">모티프 설명</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-5">
              <div className="w-10 h-10 rounded-full bg-[#E65A2D]/10 flex items-center justify-center mb-3">
                <i className="ri-emotion-happy-line text-[#E65A2D]" />
              </div>
              <h5 className="text-sm font-bold text-gray-900 mb-1">여수별산대놀이 가면</h5>
              <p className="text-xs text-gray-600 leading-relaxed">말뚝이 · 취발이 · 샌님</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">여수의 대표적인 무형문화재인 별산대놀이의 세 가면을 현대적으로 재해석</p>
            </div>
            <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-5">
              <div className="w-10 h-10 rounded-full bg-[#333333]/10 flex items-center justify-center mb-3">
                <i className="ri-emotion-laugh-line text-[#333333]" />
              </div>
              <h5 className="text-sm font-bold text-gray-900 mb-1">무대의 미소 / 웃음</h5>
              <p className="text-xs text-gray-600 leading-relaxed">풍자와 해학, 공연의 즐거움</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">별산대놀이의 핵심인 해학과 풍자, 그리고 관객과 함께 나누는 웃음과 즐거움</p>
            </div>
            <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-5">
              <div className="w-10 h-10 rounded-full bg-[#2E8F63]/10 flex items-center justify-center mb-3">
                <i className="ri-landscape-line text-[#2E8F63]" />
              </div>
              <h5 className="text-sm font-bold text-gray-900 mb-1">여수의 산과 흐름</h5>
              <p className="text-xs text-gray-600 leading-relaxed">자연과 역사, 지역의 정체성</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">여수의 아름다운 자연환경과 역사적 정체성을 곡선으로 표현</p>
            </div>
            <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-5">
              <div className="w-10 h-10 rounded-full bg-[#1F4E8C]/10 flex items-center justify-center mb-3">
                <i className="ri-group-line text-[#1F4E8C]" />
              </div>
              <h5 className="text-sm font-bold text-gray-900 mb-1">사람과 연결</h5>
              <p className="text-xs text-gray-600 leading-relaxed">시민과 문화의 포용과 연대</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">모든 시민이 문화를 향유하고 함께 만들어가는 열린 문화공간의 가치</p>
            </div>
          </div>
        </section>

        {/* ========== 로고타입 ========== */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-1.5 h-8 bg-[#1F4E8C] rounded-full" />
            <h3 className="text-lg font-bold text-gray-900">로고타입</h3>
          </div>

          <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-6 md:p-8 mb-6">
            <h4 className="text-sm font-bold text-gray-900 mb-1">가로형 시그니처</h4>
            <p className="text-xs text-gray-500 mb-5">
              심볼마크와 국문·영문 로고타입을 좌우로 배치한 기본 조합형입니다.
              웹사이트, 명함, 현수막 등 가로형 레이아웃에 적합합니다.
            </p>
            <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-center justify-center mb-4 h-32">
              <img
                alt="가로형 시그니처"
                className="max-h-full object-contain"
                src={logoUrl}
              />
            </div>
            <button className="px-5 py-2.5 bg-[#1F4E8C] text-white rounded-lg text-sm font-medium hover:bg-[#163e85] transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap">
              <i className="ri-download-line" />가로형 AI 다운로드
            </button>
          </div>

          <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-6 md:p-8 mb-6">
            <h4 className="text-sm font-bold text-gray-900 mb-1">세로형 시그니처</h4>
            <p className="text-xs text-gray-500 mb-5">
              심볼마크를 상단에 배치하고 국문·영문 로고타입을 하단에 배치한 세로 조합형입니다.
              세로형 현수막, 포스터, SNS 프로필 등에 적합합니다.
            </p>
            <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-center justify-center mb-4 h-40">
              <img
                alt="세로형 시그니처"
                className="max-h-full object-contain"
                src={logoUrl}
              />
            </div>
            <button className="px-5 py-2.5 bg-[#1F4E8C] text-white rounded-lg text-sm font-medium hover:bg-[#163e85] transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap">
              <i className="ri-download-line" />세로형 AI 다운로드
            </button>
          </div>

          <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-6 md:p-8">
            <h4 className="text-sm font-bold text-gray-900 mb-1">슬로건</h4>
            <p className="text-xs text-gray-500 mb-5">
              여수문화관광재단의 핵심 가치를 담은 브랜드 슬로건입니다.
            </p>
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <p className="text-lg font-bold text-gray-900 mb-1">
                여수의 전통과 오늘의 문화를 잇는 열린 문화플랫폼
              </p>
              <p className="text-xs text-gray-500">
                Yeosu Cultural Foundation — Bridging tradition and today's culture
              </p>
            </div>
          </div>
        </section>

        {/* ========== 캐릭터 소개 ========== */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-1.5 h-8 bg-[#E65A2D] rounded-full" />
            <h3 className="text-lg font-bold text-gray-900">캐릭터 소개</h3>
          </div>

          <p className="text-sm text-gray-500 mb-8 leading-relaxed">
            여수문화관광재단의 공식 캐릭터는 여수별산대놀이의 해학과 풍자를 담은 세 마스크 —
            말뚝이, 취발이, 샌님 — 을 현대적으로 재해석하여 제작되었습니다.
            세 캐릭터는 각기 다른 성격과 역할을 통해 여수의 문화와 전통을 유쾌하고 친근하게 전달합니다.
          </p>

          {/* 캐릭터 전체 이미지 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 mb-8 flex items-center justify-center">
            <img
              alt="여수문화관광재단 캐릭터 — 말뚝이, 취발이, 샌님"
              className="max-w-full object-contain"
              src={charactersUrl}
            />
          </div>

          {/* 개별 캐릭터 설명 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <h4 className="text-lg font-bold text-[#1F4E8C]">말뚝이</h4>
                <span className="px-2 py-0.5 bg-[#1F4E8C]/10 text-[#1F4E8C] text-xs font-medium rounded-full">MALDDUGI</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                제치있고 영리하며, 해학으로 남의 허물을 꼬집는 풍자꾼
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>컬러:</span>
                <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: "#1F4E8C" }} />
                <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: "#E65A2D" }} />
                <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: "#2E8F63" }} />
                <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: "#333333" }} />
              </div>
            </div>

            <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <h4 className="text-lg font-bold text-[#E65A2D]">취발이</h4>
                <span className="px-2 py-0.5 bg-[#E65A2D]/10 text-[#E65A2D] text-xs font-medium rounded-full">CHWIBARI</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                바르고 곧으며, 양반에게도 당당히 진실을 말하는 정의로운 인물
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>컬러:</span>
                <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: "#E65A2D" }} />
                <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: "#333333" }} />
                <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: "#2E8F63" }} />
                <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: "#1F4E8C" }} />
              </div>
            </div>

            <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <h4 className="text-lg font-bold text-[#2E8F63]">샌님</h4>
                <span className="px-2 py-0.5 bg-[#2E8F63]/10 text-[#2E8F63] text-xs font-medium rounded-full">SAENNIM</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                무능하고 허영심 가득한 양반으로, 풍자의 유쾌한 대상
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>컬러:</span>
                <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: "#2E8F63" }} />
                <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: "#E65A2D" }} />
                <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: "#1F4E8C" }} />
                <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: "#333333" }} />
              </div>
            </div>
          </div>
        </section>

        {/* ========== 캐릭터 활용 가이드 ========== */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-1.5 h-8 bg-[#333333] rounded-full" />
            <h3 className="text-lg font-bold text-gray-900">캐릭터 활용 가이드</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-[#1F4E8C]/10 flex items-center justify-center mx-auto mb-3">
                <i className="ri-checkbox-circle-line text-[#1F4E8C] text-xl" />
              </div>
              <h5 className="text-sm font-bold text-gray-900 mb-2">사용 가능</h5>
              <ul className="text-xs text-gray-600 space-y-1.5 text-left">
                <li>• 재단 공식 행사 홍보물</li>
                <li>• 교육·체험 프로그램 교재</li>
                <li>• SNS 및 디지털 콘텐츠</li>
                <li>• 문화상품(굿즈) 제작</li>
                <li>• 시설 사인물 및 안내판</li>
              </ul>
            </div>
            <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-[#E65A2D]/10 flex items-center justify-center mx-auto mb-3">
                <i className="ri-error-warning-line text-[#E65A2D] text-xl" />
              </div>
              <h5 className="text-sm font-bold text-gray-900 mb-2">사용 주의</h5>
              <ul className="text-xs text-gray-600 space-y-1.5 text-left">
                <li>• 비율 왜곡 및 변형 금지</li>
                <li>• 지정 색상 임의 변경 금지</li>
                <li>• 캐릭터 윤곽선 과도한 수정 금지</li>
                <li>• 정치·종교적 목적 사용 금지</li>
                <li>• 상업적 무단 사용 금지</li>
              </ul>
            </div>
            <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-[#2E8F63]/10 flex items-center justify-center mx-auto mb-3">
                <i className="ri-mail-send-line text-[#2E8F63] text-xl" />
              </div>
              <h5 className="text-sm font-bold text-gray-900 mb-2">사용 문의</h5>
              <ul className="text-xs text-gray-600 space-y-1.5 text-left">
                <li>• 사전 승인 후 사용 가능</li>
                <li>• 별도 가이드북 참조</li>
                <li>• 홍보마케팅팀 문의</li>
                {/* TODO: 재단 확정 연락처 확보 후 입력 (기존 값은 양주문화재단 도메인·경기 지역번호) */}
                <li>• 이메일: [확인필요]</li>
                <li>• 전화: [확인필요]</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ========== 하단 안내 ========== */}
        <div className="bg-gray-100/80 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-500">
            ※ 본 캐릭터는 여수별산대놀이 가면의 특징을 현대적으로 재해석하여 제작되었습니다.
          </p>
        </div>
      </div>
    </SubPageLayout>
  );
}