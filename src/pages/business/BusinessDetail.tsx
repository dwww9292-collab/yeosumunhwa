import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SubPageLayout from "@/components/feature/SubPageLayout";
import { fetchProgram } from "@/features/programs/api";
import type { ProgramRow } from "@/features/programs/types";

const businessTabs = [{ label: "사업소개", href: "/business" }];

const statusColor: Record<string, string> = {
  진행중: "bg-[#4db8a6]",
  예정: "bg-[#1a4fa0]",
  종료: "bg-[#999]",
};
const categoryColor: Record<string, string> = {
  교육: "bg-[#4db8a6]",
  지원사업: "bg-[#f5a623]",
  행사: "bg-[#4db8a6]",
  공연: "bg-[#1a4fa0]",
  기타: "bg-[#777]",
};

export default function BusinessDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<ProgramRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetchProgram(id)
      .then(setItem)
      .catch((e) => setError(e instanceof Error ? e.message : "불러오기 실패"))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <SubPageLayout categoryLabel="문화사업" categoryPath="/business" currentLabel="사업소개" tabs={businessTabs}>
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">사업소개</h2>

      {loading ? (
        <div className="py-24 text-center text-gray-400"><i className="ri-loader-4-line animate-spin text-2xl"></i></div>
      ) : error || !item ? (
        <div className="py-24 text-center text-gray-500">
          <p>{error ?? "존재하지 않는 사업입니다."}</p>
          <button onClick={() => navigate("/business")} className="mt-6 px-5 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">목록으로</button>
        </div>
      ) : (
        <article className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 pb-8 border-b border-gray-200">
            <div className="w-full md:w-72 flex-shrink-0">
              <div className="relative">
                <div className="absolute top-2 left-2 z-10 flex gap-1">
                  <span className={`px-2 py-0.5 text-xs font-bold rounded text-white ${statusColor[item.status] || "bg-gray-500"}`}>{item.status}</span>
                  <span className={`px-2 py-0.5 text-xs font-bold rounded text-white ${categoryColor[item.category] || "bg-gray-500"}`}>{item.category}</span>
                </div>
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title} className="w-full rounded-lg object-cover" />
                ) : (
                  <div className="w-full aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center text-gray-300"><i className="ri-image-line text-4xl"></i></div>
                )}
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug mb-5">{item.title}</h3>
              <dl className="space-y-3 text-sm">
                <InfoRow icon="ri-price-tag-3-line" label="분류">{item.category}</InfoRow>
                <InfoRow icon="ri-checkbox-circle-line" label="상태">
                  <span className={item.status === "종료" ? "text-gray-500" : "text-green-600"}>{item.status}</span>
                </InfoRow>
                <InfoRow icon="ri-calendar-line" label="사업기간">{item.date_range || "-"}</InfoRow>
                <InfoRow icon="ri-map-pin-line" label="장소">{item.location || "-"}</InfoRow>
                {item.contact && <InfoRow icon="ri-customer-service-2-line" label="문의처">{item.contact}</InfoRow>}
              </dl>
            </div>
          </div>

          {/* 첨부파일 */}
          {item.attachments && item.attachments.length > 0 && (
            <div className="py-5 border-b border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">첨부파일</p>
              <ul className="space-y-1.5">
                {item.attachments.map((att, i) => (
                  <li key={i}>
                    <a href={att.url} target="_blank" rel="noopener noreferrer" download className="inline-flex items-center gap-2 text-sm text-[#1a4fa0] hover:underline">
                      <i className="ri-download-2-line"></i>
                      {att.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 본문 */}
          <div className="py-8">
            {item.body ? (
              <p className="text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-line">{item.body}</p>
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">상세 설명이 없습니다.</p>
            )}
          </div>

          <div className="flex justify-center pt-4 border-t border-gray-200">
            <button onClick={() => navigate("/business")} className="px-8 py-2.5 text-sm bg-[#1a4fa0] text-white rounded-lg hover:bg-[#163f82] cursor-pointer">목록으로</button>
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
