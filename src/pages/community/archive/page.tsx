import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SubPageLayout from "@/components/feature/SubPageLayout";
import { archiveItems } from "@/mocks/community";
import { matchSearch } from "@/lib/search";

const communityTabs = [
  { label: "공지사항", href: "/community/notice" },
  { label: "보도자료", href: "/community/news" },
  { label: "재단소식", href: "/community/archive" },
  { label: "자료실", href: "/community/data" },
];

export default function ArchivePage() {
  const [activeTab, setActiveTab] = useState<"video" | "photo">("video");
  const [searchType, setSearchType] = useState("title");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 8;
  const navigate = useNavigate();

  const filtered = archiveItems.filter((item) => {
    const typeMatch = activeTab === "video" ? item.type === "video" : item.type === "photo";
    return typeMatch && matchSearch(searchQuery, searchType, item.title, [item.date]);
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const currentItems = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <SubPageLayout
      categoryLabel="알림마당"
      categoryPath="/community/notice"
      currentLabel="재단소식"
      tabs={communityTabs}
    >
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">재단소식</h2>

      {/* Video/Photo Tab */}
      <div className="flex justify-center gap-0 mb-8">
        <button
          onClick={() => { setActiveTab("video"); setPage(1); }}
          className={`px-10 py-3 text-sm font-medium border transition-colors cursor-pointer ${
            activeTab === "video"
              ? "bg-[#1a4fa0] border-[#1a4fa0] text-white"
              : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
        >
          영상 이야기
        </button>
        <button
          onClick={() => { setActiveTab("photo"); setPage(1); }}
          className={`px-10 py-3 text-sm font-medium border border-l-0 transition-colors cursor-pointer ${
            activeTab === "photo"
              ? "bg-[#1a4fa0] border-[#1a4fa0] text-white"
              : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
        >
          사진 이야기
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <p className="text-sm text-gray-600">
          총 <strong className="text-[#1a4fa0]">{filtered.length}</strong> 개
        </p>
        <div className="flex items-center gap-2">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none cursor-pointer"
          >
            <option value="title">제목</option>
            <option value="content">내용</option>
          </select>
          <div className="flex items-center border border-gray-300 rounded overflow-hidden">
            <input
              type="text"
              placeholder="검색어를 입력하세요."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="px-4 py-2 text-sm outline-none w-48 md:w-64"
            />
            <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 cursor-pointer">
              <i className="ri-search-line"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {currentItems.map((item) => (
          <a key={item.id} href={`/community/archive/${item.id}`} onClick={(e) => { e.preventDefault(); navigate(`/community/archive/${item.id}`); }} className="group block cursor-pointer">
            <div className="w-full aspect-square overflow-hidden rounded-lg bg-gray-100 mb-3 relative">
              <img
                alt={item.title}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                src={item.image}
              />
              {item.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
                    <i className="ri-play-fill text-white text-xl"></i>
                  </div>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-800 line-clamp-2 group-hover:text-[#1a4fa0] transition-colors mb-1">
              {item.title}
            </p>
            <p className="text-xs text-gray-400">{item.date}</p>
          </a>
        ))}
      </div>
    </SubPageLayout>
  );
}