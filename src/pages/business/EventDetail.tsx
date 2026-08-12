import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SubPageLayout from "@/components/feature/SubPageLayout";
import { fetchEvent } from "@/features/events/api";
import { deriveStatus, formatDateRange } from "@/features/events/format";
import type { EventRow, EventType } from "@/features/events/types";

const performanceTabs = [
  { label: "공연", href: "/business/performance" },
  { label: "전시", href: "/business/exhibition" },
  { label: "축제", href: "/business/festival" },
];

const TYPE_META: Record<EventType, { label: string; listPath: string }> = {
  performance: { label: "공연", listPath: "/business/performance" },
  exhibition: { label: "전시", listPath: "/business/exhibition" },
  festival: { label: "축제", listPath: "/business/festival" },
};

export default function EventDetail({ type }: { type: EventType }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const meta = TYPE_META[type];

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetchEvent(id)
      .then(setEvent)
      .catch((e) => setError(e instanceof Error ? e.message : "불러오기 실패"))
      .finally(() => setLoading(false));
  }, [id]);

  const status = event ? deriveStatus(event.end_date) : "진행중";

  return (
    <SubPageLayout
      categoryLabel="공연·전시·축제"
      categoryPath="/business/performance"
      currentLabel={meta.label}
      tabs={performanceTabs}
    >
      {loading ? (
        <div className="py-24 text-center text-gray-400">
          <i className="ri-loader-4-line animate-spin text-2xl"></i>
        </div>
      ) : error || !event ? (
        <div className="py-24 text-center text-gray-500">
          <p>{error ?? "존재하지 않는 항목입니다."}</p>
          <button
            onClick={() => navigate(meta.listPath)}
            className="mt-6 px-5 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            목록으로
          </button>
        </div>
      ) : (
        <article className="max-w-3xl mx-auto">
          {/* 상단: 포스터 + 기본정보 */}
          <div className="flex flex-col md:flex-row gap-8 pb-8 border-b border-gray-200">
            <div className="w-full md:w-72 flex-shrink-0">
              <div className="relative">
                <span
                  className={`absolute top-2 left-2 px-2 py-0.5 text-xs font-bold rounded text-white ${
                    status === "종료" ? "bg-[#999]" : event.tag === "대관" ? "bg-[#f5a623]" : "bg-[#4db8a6]"
                  }`}
                >
                  {status === "종료" ? "종료" : event.tag}
                </span>
                {event.image_url ? (
                  <img src={event.image_url} alt={event.title} className="w-full rounded-lg object-cover" />
                ) : (
                  <div className="w-full aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center text-gray-300">
                    <i className="ri-image-line text-4xl"></i>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug mb-5">
                {event.title}
              </h2>
              <dl className="space-y-3 text-sm">
                <InfoRow icon="ri-calendar-line" label="기간">
                  {formatDateRange(event.start_date, event.end_date) || "-"}
                </InfoRow>
                <InfoRow icon="ri-map-pin-line" label="장소">
                  {event.location || "-"}
                </InfoRow>
                <InfoRow icon="ri-price-tag-3-line" label="구분">
                  {event.tag}
                </InfoRow>
                <InfoRow icon="ri-checkbox-circle-line" label="상태">
                  <span className={status === "종료" ? "text-gray-500" : "text-green-600"}>{status}</span>
                </InfoRow>
              </dl>
            </div>
          </div>

          {/* 본문 */}
          <div className="py-8">
            {event.body ? (
              <p className="text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                {event.body}
              </p>
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">상세 설명이 없습니다.</p>
            )}
          </div>

          {/* 하단 버튼 */}
          <div className="flex justify-center pt-4 border-t border-gray-200">
            <button
              onClick={() => navigate(meta.listPath)}
              className="px-8 py-2.5 text-sm bg-[#1a4fa0] text-white rounded-lg hover:bg-[#163f82] cursor-pointer"
            >
              목록으로
            </button>
          </div>
        </article>
      )}
    </SubPageLayout>
  );
}

function InfoRow({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex items-center gap-1.5 text-gray-400 w-20 flex-shrink-0">
        <i className={icon}></i>
        {label}
      </span>
      <dd className="text-gray-800">{children}</dd>
    </div>
  );
}
