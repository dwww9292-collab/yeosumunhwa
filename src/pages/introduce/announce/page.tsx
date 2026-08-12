import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SubPageLayout from "@/components/feature/SubPageLayout";
import { announceItems } from "@/mocks/introduce";
import { matchSearch } from "@/lib/search";

const introduceTabs = [
  { label: "인사말", href: "/introduce/greeting" },
  { label: "설립 및 운영", href: "/introduce/establishment" },
  { label: "조직소개", href: "/introduce/organization" },
  { label: "CI소개", href: "/introduce/ci" },
  { label: "재단소개", href: "/introduce/philosophy" },
  { label: "경영공시", href: "/introduce/announce" },
  { label: "오시는길", href: "/introduce/location" },
];

const announceCategories = [
  "인건비 집행 현황",
  "경영실적 평가결과",
  "외부기관 감사결과",
  "예·결산 현황",
  "계약현황",
  "업무추진비",
  "복리후생비 집행내역",
  "기타",
];

export default function AnnouncePage() {
  const [activeCategory, setActiveCategory] = useState(announceCategories[0]);
  const [searchType, setSearchType] = useState("title");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;
  const navigate = useNavigate();

  const filtered = announceItems.filter((item) => {
    const catMatch = item.category === activeCategory;
    const searchMatch = matchSearch(searchQuery, searchType, item.title, [item.category]);
    return catMatch && searchMatch;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const currentItems = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <SubPageLayout
      categoryLabel="재단소개"
      categoryPath="/introduce/greeting"
      currentLabel="경영공시"
      tabs={introduceTabs}
    >
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">경영공시</h2>

      <div className="px-4 md:px-8 py-10">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">경영공시</h2>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-1 mb-8">
          {announceCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setPage(1); }}
              className={`px-4 py-2 rounded border text-sm font-medium cursor-pointer transition-colors whitespace-nowrap ${
                activeCategory === cat
                  ? "bg-[#1a4fa0] text-white border-[#1a4fa0]"
                  : "bg-white text-gray-600 border-gray-300 hover:border-[#1a4fa0]/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Count */}
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
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                className="px-3 py-1.5 text-sm w-48 outline-none"
              />
              <button className="px-3 py-1.5 bg-gray-800 text-white cursor-pointer hover:bg-gray-900">
                <i className="ri-search-line"></i>
              </button>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="border-t-2 border-gray-800 mb-8">
          {currentItems.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-sm">등록된 게시물이 없습니다.</div>
          ) : (
            currentItems.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/introduce/announce/${item.id}`)}
                className="flex items-center justify-between px-4 py-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer group transition-colors"
              >
                <div className="flex items-center gap-5">
                  <span className="text-sm text-gray-400 w-6 text-center">{item.num}</span>
                  <p className="text-sm text-gray-800 group-hover:text-[#1a4fa0] transition-colors">{item.title}</p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">{item.date}</span>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => setPage(1)}
            className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-sm cursor-pointer hover:bg-gray-100"
          >
            <i className="ri-skip-left-line"></i>
          </button>
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-sm cursor-pointer hover:bg-gray-100"
          >
            <i className="ri-arrow-left-s-line"></i>
          </button>
          {Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 flex items-center justify-center border rounded text-sm cursor-pointer ${
                p === page
                  ? "border-gray-800 bg-gray-800 text-white"
                  : "border-gray-200 hover:bg-gray-100"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-sm cursor-pointer hover:bg-gray-100"
          >
            <i className="ri-arrow-right-s-line"></i>
          </button>
          <button
            onClick={() => setPage(totalPages)}
            className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-sm cursor-pointer hover:bg-gray-100"
          >
            <i className="ri-skip-right-line"></i>
          </button>
        </div>
      </div>
    </SubPageLayout>
  );
}