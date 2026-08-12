import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPublicPrograms } from "@/features/programs/api";
import type { ProgramRow } from "@/features/programs/types";

const FALLBACK_IMAGE = "https://placehold.co/600x800/e5e7eb/9ca3af?text=No+Image";

function getStatusColor(status: string) {
  if (status === "진행중") return "bg-accent-500";
  if (status === "종료") return "bg-foreground-600";
  return "bg-secondary-500";
}

function getCategoryColor(category: string) {
  if (category === "교육") return "bg-primary-500";
  if (category === "행사") return "bg-secondary-500";
  if (category === "지원사업") return "bg-accent-500";
  return "bg-primary-500";
}

export default function BusinessSection() {
  const [items, setItems] = useState<ProgramRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchPublicPrograms()
      .then((rows) => active && setItems(rows))
      .catch(() => active && setItems([]))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const visible = items.slice(0, 4);

  return (
    <section className="py-12 md:py-16 bg-background-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="mb-8">
          <p className="text-sm text-foreground-500 mb-1">지금 여수에서 만나는</p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground-950">문화사업</h2>
        </div>

        {loading ? (
          <div className="py-16 text-center text-foreground-300">
            <i className="ri-loader-4-line animate-spin text-2xl"></i>
          </div>
        ) : visible.length === 0 ? (
          <div className="py-16 text-center text-foreground-400 text-sm">등록된 문화사업이 없습니다.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {visible.map((item) => (
              <Link
                key={item.id}
                to={`/business/${item.id}`}
                className="group bg-white rounded-lg overflow-hidden border border-background-200 hover:shadow-lg transition-all"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-background-100">
                  <img
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={item.image_url || FALLBACK_IMAGE}
                  />
                  <div className="absolute top-3 left-3 flex gap-1">
                    <span className={`text-xs font-medium px-2 py-1 rounded text-white ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                    <span className={`text-xs font-medium px-2 py-1 rounded text-white ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-foreground-800 line-clamp-2 group-hover:text-primary-500">
                    {item.title}
                  </h3>
                  {item.date_range && (
                    <p className="text-xs text-foreground-400 mt-1 line-clamp-1">{item.date_range}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-8">
          <Link
            to="/business"
            className="inline-flex items-center gap-1 text-sm text-foreground-600 border border-background-300 rounded px-5 py-2 hover:border-primary-500 hover:text-primary-500 transition-colors"
          >
            전체보기 <i className="ri-arrow-right-s-line"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}
