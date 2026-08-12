import { useState } from "react";
import SubPageLayout from "@/components/feature/SubPageLayout";
import { spaceData } from "@/mocks/rent";

const rentTabs = [
  { label: "대관현황", href: "/rent/status" },
  { label: "대관신청", href: "/rent/apply" },
  { label: "공간소개", href: "/rent/space" },
];

const venueList = ["시민회관", "양주사랑행복센터", "양주우정행복센터", "양주아트홀"];

export default function RentSpacePage() {
  const [activeVenue, setActiveVenue] = useState("시민회관");
  const [facilityImgIndex, setFacilityImgIndex] = useState(0);

  const venue = spaceData[activeVenue];

  return (
    <SubPageLayout
      categoryLabel="대관안내"
      categoryPath="/rent/status"
      currentLabel="공간소개"
      tabs={rentTabs}
    >
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">공간소개</h2>

      {/* Venue Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {venueList.map((v) => (
          <button
            key={v}
            onClick={() => { setActiveVenue(v); setFacilityImgIndex(0); }}
            className={`px-6 py-2 border rounded text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeVenue === v
                ? "bg-[#1a4fa0] border-[#1a4fa0] text-white"
                : "border-gray-300 text-gray-600 bg-white hover:bg-gray-50"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {venue && (
        <>
          <h3 className="text-xl font-bold text-gray-900 mb-6">{venue.title}</h3>

          {/* Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3 border-b pb-2">전경</h4>
              <div className="w-full h-[240px] overflow-hidden rounded-lg bg-gray-100">
                <img
                  alt={`${venue.title} 전경`}
                  className="w-full h-full object-cover object-top"
                  src={venue.exteriorImage}
                />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3 border-b pb-2">시설 및 공연장</h4>
              <div className="relative w-full h-[240px] overflow-hidden rounded-lg bg-gray-100">
                <img
                  alt={`${venue.title} 시설`}
                  className="w-full h-full object-cover object-top transition-opacity duration-300"
                  src={venue.facilityImages[facilityImgIndex]}
                />
                {venue.facilityImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setFacilityImgIndex((facilityImgIndex - 1 + venue.facilityImages.length) % venue.facilityImages.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60 cursor-pointer"
                    >
                      <i className="ri-arrow-left-s-line"></i>
                    </button>
                    <button
                      onClick={() => setFacilityImgIndex((facilityImgIndex + 1) % venue.facilityImages.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60 cursor-pointer"
                    >
                      <i className="ri-arrow-right-s-line"></i>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* 시설개요 */}
          <h4 className="text-base font-bold text-gray-800 border-b-2 border-[#1a4fa0] pb-2 mb-4">시설개요</h4>
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
            {venue.overview.map((item, i) => (
              <li key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border-b-2 border-gray-200">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                  <i className={`${item.icon} text-2xl text-[#1a4fa0]`}></i>
                </div>
                <dl>
                  <dt className="text-xs text-gray-500 mb-1">{item.label}</dt>
                  <dd className="text-sm font-medium text-gray-800 leading-snug">{item.value}</dd>
                </dl>
              </li>
            ))}
          </ul>

          {/* 주요시설내역 */}
          <h4 className="text-base font-bold text-gray-800 border-b-2 border-[#1a4fa0] pb-2 mb-4">주요시설내역</h4>
          <div className="overflow-x-auto mb-10">
            <table className="w-full text-sm border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 text-left font-medium text-gray-700 border border-gray-200">용도</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-700 border border-gray-200">기능</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-700 border border-gray-200">수용능력</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-700 border border-gray-200">면적</th>
                </tr>
              </thead>
              <tbody>
                {venue.mainFacilities.map((f, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border border-gray-200 font-medium text-gray-800">{f.name}</td>
                    <td className="py-3 px-4 border border-gray-200 text-gray-600 whitespace-pre-line">{f.function}</td>
                    <td className="py-3 px-4 border border-gray-200 text-gray-600">{f.capacity}</td>
                    <td className="py-3 px-4 border border-gray-200 text-gray-600">{f.area}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 시설현황 */}
          <h4 className="text-base font-bold text-gray-800 border-b-2 border-[#1a4fa0] pb-2 mb-4">시설현황</h4>
          <div className="overflow-x-auto mb-10">
            <table className="w-full text-sm border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 text-left font-medium text-gray-700 border border-gray-200">시설명</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-700 border border-gray-200">용도</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-700 border border-gray-200">무대 규격 (폭x깊이x높이)</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-700 border border-gray-200">내부 현수막 규격</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-700 border border-gray-200">야외 현수막 규격</th>
                </tr>
              </thead>
              <tbody>
                {venue.facilityStatus.map((f, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border border-gray-200 font-medium text-gray-800">{f.name}</td>
                    <td className="py-3 px-4 border border-gray-200 text-gray-600">{f.usage}</td>
                    <td className="py-3 px-4 border border-gray-200 text-gray-600">{f.stageSize}</td>
                    <td className="py-3 px-4 border border-gray-200 text-gray-600">{f.indoorBanner}</td>
                    <td className="py-3 px-4 border border-gray-200 text-gray-600">{f.outdoorBanner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 공연장 휴관일 안내 */}
          <h4 className="text-base font-bold text-gray-800 border-b-2 border-[#1a4fa0] pb-2 mb-4">공연장 휴관일 안내</h4>
          <ul className="list-disc list-inside text-sm text-gray-600 mb-10 pl-2">
            <li>매주 월요일 공연장 휴관일 및 법정 공휴일</li>
          </ul>

          {/* 오시는길 */}
          <h4 className="text-base font-bold text-gray-800 border-b-2 border-[#1a4fa0] pb-2 mb-4">오시는길</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-gray-50 rounded-lg p-5">
              <h5 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <i className="ri-bus-line text-[#1a4fa0]"></i>
                교통편 안내
              </h5>
              <p className="text-xs text-gray-600 whitespace-pre-line leading-relaxed">{venue.transportation}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-5">
              <h5 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <i className="ri-map-pin-line text-[#1a4fa0]"></i>
                주변 주요 시설
              </h5>
              <p className="text-xs text-gray-600 leading-relaxed">{venue.nearby}</p>
            </div>
          </div>

          {/* 서식 다운로드 */}
          <h4 className="text-base font-bold text-gray-800 border-b-2 border-[#1a4fa0] pb-2 mb-4">서식 다운로드</h4>
          <ul className="flex flex-wrap gap-3 mb-10">
            {venue.downloadForms.map((form, i) => {
              const ready = form.url && form.url !== "#";
              return (
                <li key={i}>
                  {ready ? (
                    <a
                      href={form.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-gray-300 text-sm text-gray-700 px-4 py-2 rounded hover:bg-gray-50 hover:border-[#1a4fa0] hover:text-[#1a4fa0] transition-colors cursor-pointer"
                    >
                      {form.label}
                      <i className="ri-download-line"></i>
                    </a>
                  ) : (
                    <span
                      title="관리자 페이지 연동 후 제공됩니다."
                      className="inline-flex items-center gap-2 border border-gray-200 text-sm text-gray-400 px-4 py-2 rounded cursor-not-allowed"
                    >
                      {form.label}
                      <span className="text-[11px] text-gray-400">(준비중)</span>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Contact */}
          <div className="bg-gray-50 rounded-lg p-5">
            <dl className="flex flex-col sm:flex-row gap-4 text-sm text-gray-700">
              {venue.contacts.map((c, i) => (
                <dd key={i} className="flex items-center gap-2">
                  <i className="ri-phone-line"></i>
                  {c}
                </dd>
              ))}
            </dl>
          </div>
        </>
      )}
    </SubPageLayout>
  );
}