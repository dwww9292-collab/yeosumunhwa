import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SubPageLayout from "@/components/feature/SubPageLayout";
import { noticeItems } from "@/mocks/community";
import { matchSearch } from "@/lib/search";

const communityTabs = [
  { label: "공지사항", href: "/community/notice" },
  { label: "보도자료", href: "/community/news" },
  { label: "재단소식", href: "/community/archive" },
  { label: "자료실", href: "/community/data" },
];

export default function NoticePage() {
  const [searchType, setSearchType] = useState("title");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;
  const navigate = useNavigate();

  const filtered = noticeItems.filter((item) =>
    matchSearch(searchQuery, searchType, item.title, [item.date]),
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const currentItems = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <SubPageLayout
      categoryLabel="알림마당"
      categoryPath="/community/notice"
      currentLabel="공지사항"
      tabs={communityTabs}
    >
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">공지사항</h2>
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
            <option value="all">제목+내용</option>
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

      {/* List */}
      <ul className="border-t border-gray-200">
        {currentItems.map((item) => (
          <li key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <a
              href={`/community/notice/${item.id}`}
              onClick={(e) => { e.preventDefault(); navigate(`/community/notice/${item.id}`); }}
              className="flex items-center gap-4 py-4 px-2 cursor-pointer"
            >
              <div className="flex-shrink-0 w-10 text-center">
                {item.isNotice ? (
                  <i className="ri-notification-3-line text-lg text-gray-400 mx-auto block"></i>
                ) : (
                  <span className="text-sm text-gray-500">{item.num}</span>
                )}
              </div>
              <div className="flex-1 flex items-center gap-2 min-w-0">
                <span className="text-sm text-gray-800 truncate">{item.title}</span>
                {item.isNew && (
                  <span className="flex-shrink-0 text-xs font-bold text-white bg-[#1a4fa0] rounded-full w-5 h-5 flex items-center justify-center">
                    N
                  </span>
                )}
              </div>
              <div className="flex-shrink-0 text-sm text-gray-400 font-mono">{item.date}</div>
            </a>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-1 mt-10">
        <button
          disabled={page <= 1}
          onClick={() => setPage(1)}
          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-gray-500 hover:bg-gray-50 disabled:opacity-30 cursor-pointer"
        >
          <i className="ri-skip-back-mini-line text-xs"></i>
        </button>
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-gray-500 hover:bg-gray-50 disabled:opacity-30 cursor-pointer"
        >
          <i className="ri-arrow-left-s-line"></i>
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`w-8 h-8 flex items-center justify-center border rounded text-sm cursor-pointer ${
              p === page
                ? "bg-[#1a4fa0] border-[#1a4fa0] text-white"
                : "border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-gray-500 hover:bg-gray-50 disabled:opacity-30 cursor-pointer"
        >
          <i className="ri-arrow-right-s-line"></i>
        </button>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(totalPages)}
          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-gray-500 hover:bg-gray-50 disabled:opacity-30 cursor-pointer"
        >
          <i className="ri-skip-forward-mini-line text-xs"></i>
        </button>
      </div>
    </SubPageLayout>
  );
}