import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SubPageLayout from "@/components/feature/SubPageLayout";
import { businessCategories } from "@/mocks/business";
import { fetchPublicPrograms } from "@/features/programs/api";
import type { ProgramRow } from "@/features/programs/types";
import { matchSearch } from "@/lib/search";

const businessTabs = [
  { label: "사업소개", href: "/business" },
];

type FilterType = "all" | "교육" | "지원사업" | "행사" | "기타";
type StatusFilter = "all" | "진행중" | "예정" | "종료";

export default function BusinessPage() {
  const [categoryFilter, setCategoryFilter] = useState<FilterType>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchType, setSearchType] = useState("title");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  const [programs, setPrograms] = useState<ProgramRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicPrograms()
      .then(setPrograms)
      .catch(() => setPrograms([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = programs.filter((item) => {
    const catMatch = categoryFilter === "all" || item.category === categoryFilter;
    const statusMatch = statusFilter === "all" || item.status === statusFilter;
    const searchMatch = matchSearch(searchQuery, searchType, item.title, [item.category, item.status, item.location, item.date_range]);
    return catMatch && statusMatch && searchMatch;
  });

  const statusColor: Record<string, string> = {
    "진행중": "bg-[#4db8a6]",
    "예정": "bg-[#1a4fa0]",
    "종료": "bg-[#999]",
  };

  const categoryColor: Record<string, string> = {
    "교육": "bg-[#4db8a6]",
    "지원사업": "bg-[#f5a623]",
    "행사": "bg-[#4db8a6]",
    "기타": "bg-[#4db8a6]",
  };

  return (
    <SubPageLayout
      categoryLabel="문화사업"
      categoryPath="/business"
      currentLabel="사업소개"
      tabs={businessTabs}
    >
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">사업소개</h2>

      {/* Banner Slider */}
      <div className="relative overflow-hidden bg-[#1a1a2e] min-h-[280px] md:min-h-[360px] mb-0">
        {businessCategories.map((cat, idx) => (
          <div
            key={idx}
            className={`transition-opacity duration-500 ${idx === activeSlide ? "block" : "hidden"}`}
          >
            <div className="max-w-[900px] mx-auto px-8 py-12 md:py-16">
              <dl>
                <dt className="text-2xl md:text-3xl font-bold text-white mb-5">{cat.title}</dt>
                <dd className="text-sm md:text-base text-gray-300 leading-relaxed whitespace-pre-line">{cat.description}</dd>
              </dl>
            </div>
          </div>
        ))}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {businessCategories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`relative pb-1 text-xs font-medium cursor-pointer transition-colors border-b-2 ${
                idx === activeSlide ? "text-white border-white" : "text-gray-400 border-transparent"
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>
      </div>

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
              <button className="px-3 py-1.5 bg-gray-800 text-white cursor-pointer hover:bg-gray-900 transition-colors">
                <i className="ri-search-line"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700 w-8">과정</span>
          {(["all", "교육", "지원사업", "행사", "기타"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setCategoryFilter(f)}
              className={`px-4 py-1.5 rounded text-sm font-medium cursor-pointer whitespace-nowrap transition-colors ${
                categoryFilter === f
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f === "all" ? "전체" : f}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700 w-8">상태</span>
          {(["all", "진행중", "예정", "종료"] as StatusFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-4 py-1.5 rounded text-sm font-medium cursor-pointer whitespace-nowrap transition-colors ${
                statusFilter === f
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f === "all" ? "전체" : f}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading && (
          <div className="py-20 text-center text-gray-400"><i className="ri-loader-4-line animate-spin text-2xl"></i></div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="py-20 text-center text-gray-400 text-sm">등록된 사업이 없습니다.</div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {filtered.map((item) => (
            <Link
              key={item.id}
              to={`/business/${item.id}`}
              className="bg-white border border-gray-200 rounded overflow-hidden hover:border-[#1a4fa0]/40 transition-colors cursor-pointer block"
            >
              <div className="relative w-full h-[200px]">
                <div className="absolute top-2 left-2 flex gap-1 z-10">
                  <span className={`px-2 py-0.5 text-xs font-bold rounded ${statusColor[item.status] || "bg-gray-500"} text-white`}>
                    {item.status}
                  </span>
                  <span className={`px-2 py-0.5 text-xs font-bold rounded ${categoryColor[item.category] || "bg-gray-500"} text-white`}>
                    {item.category}
                  </span>
                </div>
                <img
                  alt={item.title}
                  className="w-full h-full object-cover object-top"
                  src={item.image_url ?? "https://placehold.co/800x600/e5e7eb/9ca3af?text=No+Image"}
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
                  <span>{item.date_range}</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </SubPageLayout>
  );
}