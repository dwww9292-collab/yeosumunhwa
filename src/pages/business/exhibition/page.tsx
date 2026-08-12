import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SubPageLayout from "@/components/feature/SubPageLayout";
import { usePublicEvents } from "@/features/events/useEvents";
import EventHero from "@/features/hero/EventHero";
import { matchSearch } from "@/lib/search";

const performanceTabs = [
  { label: "공연", href: "/business/performance" },
  { label: "전시", href: "/business/exhibition" },
  { label: "축제", href: "/business/festival" },
];

type TagFilter = "all" | "기획" | "대관" | "종료";

export default function ExhibitionPage() {
  const [tagFilter, setTagFilter] = useState<TagFilter>("all");
  const [searchType, setSearchType] = useState("title");
  const [searchQuery, setSearchQuery] = useState("");
  const { items, loading } = usePublicEvents("exhibition");
  const navigate = useNavigate();

  const filtered = items.filter((item) => {
    const tagMatch =
      tagFilter === "all" ||
      (tagFilter === "종료" ? item.status === "종료" : item.tag === tagFilter);
    const searchMatch = matchSearch(searchQuery, searchType, item.title, [item.location, item.dateRange, item.tag]);
    return tagMatch && searchMatch;
  });

  const tagColor: Record<string, string> = {
    "기획": "bg-[#4db8a6]",
    "대관": "bg-[#f5a623]",
    "종료": "bg-[#999]",
  };

  return (
    <SubPageLayout
      categoryLabel="공연·전시·축제"
      categoryPath="/business/performance"
      currentLabel="전시"
      tabs={performanceTabs}
    >
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">전시</h2>

      <EventHero
        section="exhibition"
        activeHref="/business/exhibition"
        fallbackTitle="전시"
        fallbackDesc="여수 지역 예술가의 활동 기회를 제공하고 창작 의욕을 고취시키며, 지역 내 문화공간을 활용한 문화 향유를 제공합니다."
      />

      {/* Filters */}
      <div className="px-4 md:px-8 pt-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="text-sm text-gray-600">
            총 <strong className="text-[#1a4fa0]">{filtered.length}</strong> 개
          </div>
          <div className="flex items-center gap-2">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1.5 text-sm text-gray-700 bg-white cursor-pointer"
            >
              <option value="title">제목</option>
              <option value="content">내용</option>
              <option value="all">제목+내용</option>
            </select>
            <div className="flex items-center border border-gray-300 rounded overflow-hidden">
              <input
                type="text"
                placeholder="검색어를 입력하세요."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-1.5 text-sm w-48 outline-none"
              />
              <button className="px-3 py-1.5 bg-gray-800 text-white cursor-pointer hover:bg-gray-900">
                <i className="ri-search-line"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {(["all", "기획", "대관", "종료"] as TagFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setTagFilter(f)}
              className={`px-4 py-1.5 rounded text-sm font-medium cursor-pointer whitespace-nowrap transition-colors ${
                tagFilter === f
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f === "all" ? "전체" : f}
            </button>
          ))}
        </div>

        {loading && (
          <div className="py-20 text-center text-gray-400">
            <i className="ri-loader-4-line animate-spin text-2xl"></i>
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="py-20 text-center text-gray-400 text-sm">등록된 전시가 없습니다.</div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/business/exhibition/${item.id}`)}
              className="bg-white border border-gray-200 rounded overflow-hidden hover:border-[#1a4fa0]/40 transition-colors cursor-pointer"
            >
              <div className="relative w-full h-[200px]">
                <div className="absolute top-2 left-2 z-10">
                  <span className={`px-2 py-0.5 text-xs font-bold rounded ${tagColor[item.tag] || "bg-[#999]"} text-white`}>
                    {item.status === "종료" ? "종료" : item.tag}
                  </span>
                </div>
                <img
                  alt={item.title}
                  className="w-full h-full object-cover object-top"
                  src={item.image}
                />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-gray-800 mb-2 line-clamp-2 leading-snug">{item.title}</p>
                {item.location && (
                  <p className="text-xs text-gray-500 flex items-start gap-1 mb-1">
                    <i className="ri-map-pin-line mt-0.5"></i>
                    <span className="line-clamp-1">{item.location}</span>
                  </p>
                )}
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <i className="ri-calendar-line"></i>
                  <span>{item.dateRange}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SubPageLayout>
  );
}