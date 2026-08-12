import { useState } from "react";
import { Link } from "react-router-dom";
import { usePublicEvents } from "@/features/events/useEvents";
import type { EventType } from "@/features/events/types";

const TABS: { label: string; type: EventType }[] = [
  { label: "공연", type: "performance" },
  { label: "전시", type: "exhibition" },
  { label: "축제", type: "festival" },
];

function tagColor(tag: string) {
  if (tag === "대관") return "bg-secondary-500";
  return "bg-primary-500";
}

export default function PerformanceSection() {
  const [activeType, setActiveType] = useState<EventType>("performance");
  const { items, loading } = usePublicEvents(activeType);
  const visible = items.slice(0, 4);

  return (
    <section className="py-12 md:py-16 bg-background-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <p className="text-sm text-foreground-500 mb-1">지금 여수에서 만나는</p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground-950">공연·전시·축제</h2>
          </div>
          <div className="flex gap-1 mt-4 md:mt-0">
            {TABS.map((tab) => (
              <button
                key={tab.type}
                onClick={() => setActiveType(tab.type)}
                className={`px-4 py-2 text-sm border rounded transition-colors cursor-pointer whitespace-nowrap ${
                  activeType === tab.type
                    ? "bg-primary-500 text-white border-primary-500"
                    : "bg-white text-foreground-600 border-background-300 hover:border-primary-500"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-foreground-300">
            <i className="ri-loader-4-line animate-spin text-2xl"></i>
          </div>
        ) : visible.length === 0 ? (
          <div className="py-16 text-center text-foreground-400 text-sm">
            등록된 {TABS.find((t) => t.type === activeType)?.label}이(가) 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {visible.map((item) => (
              <Link
                key={item.id}
                to={`/business/${activeType}/${item.id}`}
                className="group bg-white rounded-lg overflow-hidden border border-background-200 hover:shadow-lg transition-all"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-background-100">
                  <img
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={item.image}
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded text-white ${tagColor(item.tag)}`}>
                      {item.status === "종료" ? "종료" : item.tag}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-foreground-800 line-clamp-2 group-hover:text-primary-500">
                    {item.title}
                  </h3>
                  {item.dateRange && (
                    <p className="text-xs text-foreground-400 mt-1 line-clamp-1">{item.dateRange}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-8">
          <Link
            to={`/business/${activeType}`}
            className="inline-flex items-center gap-1 text-sm text-foreground-600 border border-background-300 rounded px-5 py-2 hover:border-primary-500 hover:text-primary-500 transition-colors"
          >
            전체보기 <i className="ri-arrow-right-s-line"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}
