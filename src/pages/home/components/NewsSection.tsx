import { useState } from "react";
import { Link } from "react-router-dom";
import { newsTabs, newsItems } from "@/mocks/home";
import { realNewsItems } from "@/mocks/real-assets";

// 실제 양주 문화행사 소식을 앞에 배치
const allNews = [...realNewsItems, ...newsItems];

const TAB_PATH: Record<string, string> = {
  공지사항: "/community/notice",
  보도자료: "/community/news",
  경영공시: "/introduce/announce",
};

export default function NewsSection() {
  const [activeTab, setActiveTab] = useState("공지사항");
  const filtered = allNews.filter((item) => item.category === activeTab);
  const listPath = TAB_PATH[activeTab] ?? "/community/notice";

  return (
    <section className="py-12 md:py-16 bg-background-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <p className="text-sm text-foreground-500 mb-1">
              (재)양주문화재단에서 알려드립니다.
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground-950">
              양주문화재단 소식
            </h2>
          </div>
          <div className="flex gap-1 mt-4 md:mt-0">
            {newsTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm border rounded transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-primary-500 text-white border-primary-500"
                    : "bg-white text-foreground-600 border-background-300 hover:border-primary-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(filtered.length ? filtered : newsItems).map((item) => (
            <Link
              key={item.id}
              to={listPath}
              className="group border border-background-200 rounded-lg p-5 hover:border-primary-500 hover:shadow-md transition-all"
            >
              <h3 className="text-base font-bold text-foreground-800 mb-3 line-clamp-2 group-hover:text-primary-500">
                {item.title}
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-400">{item.date}</span>
                {item.isNew && (
                  <span className="bg-accent-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                    N
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Link
            to={listPath}
            className="inline-flex items-center gap-1 text-sm text-foreground-600 border border-background-300 rounded px-5 py-2 hover:border-primary-500 hover:text-primary-500 transition-colors"
          >
            전체보기 <i className="ri-arrow-right-s-line"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}