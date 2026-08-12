import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SubPageLayout from "@/components/feature/SubPageLayout";
import { incrementView } from "@/features/posts/api";
import { usePublicPosts } from "@/features/posts/usePosts";
import { BOARD_LABEL, BOARD_PATH } from "@/features/posts/types";
import type { BoardKey, PostRow } from "@/features/posts/types";

const communityTabs = [
  { label: "공지사항", href: "/community/notice" },
  { label: "보도자료", href: "/community/news" },
  { label: "재단소식", href: "/community/archive" },
  { label: "자료실", href: "/community/data" },
];

export type CommunityBoard = BoardKey;

const fileTypeColor: Record<string, string> = {
  PDF: "bg-red-100 text-red-600",
  HWP: "bg-sky-100 text-sky-600",
  XLSX: "bg-green-100 text-green-600",
  ZIP: "bg-yellow-100 text-yellow-600",
};

export default function CommunityDetail({ board }: { board: CommunityBoard }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const label = BOARD_LABEL[board];
  const path = BOARD_PATH[board];

  // 목록을 그대로 재사용해 이전/다음 글까지 한 번에 처리한다
  const { items, loading } = usePublicPosts(board);

  const { item, prev, next } = useMemo(() => {
    const idx = items.findIndex((p) => p.id === id);
    return {
      item: idx >= 0 ? items[idx] : null,
      next: idx > 0 ? items[idx - 1] : null,
      prev: idx >= 0 && idx < items.length - 1 ? items[idx + 1] : null,
    };
  }, [items, id]);

  // 조회수는 글당 한 번만 (실패해도 본문 표시는 막지 않는다)
  const [counted, setCounted] = useState<string | null>(null);
  useEffect(() => {
    if (!item || counted === item.id) return;
    setCounted(item.id);
    incrementView(item.id).catch(() => {});
  }, [item, counted]);

  return (
    <SubPageLayout categoryLabel="알림마당" categoryPath="/community/notice" currentLabel={label} tabs={communityTabs}>
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">{label}</h2>

      <div className="max-w-3xl mx-auto">
        {loading ? (
          <div className="py-24 text-center text-gray-400">
            <i className="ri-loader-4-line animate-spin text-2xl"></i>
          </div>
        ) : !item ? (
          <div className="py-24 text-center text-gray-500">
            <p>존재하지 않는 게시물입니다.</p>
            <button onClick={() => navigate(path)} className="mt-6 px-5 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">목록으로</button>
          </div>
        ) : (
          <>
            {/* 제목 영역 */}
            <div className="border-t-2 border-gray-800 border-b border-gray-200 py-5">
              {item.is_pinned && (
                <span className="inline-block mb-2 text-xs font-bold px-2 py-0.5 rounded bg-[#1a4fa0]/10 text-[#1a4fa0]">
                  공지
                </span>
              )}
              <h3 className="text-lg md:text-xl font-bold text-gray-900">{item.title}</h3>
              <p className="text-xs text-gray-400 mt-2">
                작성일 {item.published_at} · 조회 {item.view_count}
              </p>
            </div>

            {/* 첨부파일 */}
            <div className="flex flex-wrap items-center gap-2 py-3 border-b border-gray-100 text-sm">
              <i className="ri-attachment-2 text-gray-400"></i>
              <span className="text-gray-400">첨부파일</span>
              {item.attachments?.length ? (
                item.attachments.map((att, i) => (
                  <span key={`${att.name}-${i}`} className="inline-flex items-center gap-1">
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${fileTypeColor[att.ext] || "bg-gray-100 text-gray-600"}`}>
                      {att.ext}
                    </span>
                    {att.url ? (
                      <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-[#1a4fa0] hover:underline">
                        {att.name}
                      </a>
                    ) : (
                      <span className="text-gray-400" title="관리자 페이지에서 파일을 등록해 주세요.">
                        {att.name}
                      </span>
                    )}
                  </span>
                ))
              ) : (
                <span className="text-gray-400">등록된 첨부파일이 없습니다.</span>
              )}
            </div>

            {/* 본문 */}
            <div className="py-10 min-h-[160px]">
              {item.media_url && (
                <p className="mb-6 text-sm">
                  <a href={item.media_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[#1a4fa0] hover:underline">
                    <i className="ri-play-circle-line"></i> 영상 보러가기
                  </a>
                </p>
              )}
              {item.image_url && (
                <img src={item.image_url} alt={item.title} className="w-full max-w-xl mx-auto rounded-lg mb-6" />
              )}
              <p className="text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                {item.body?.trim() ? item.body : "등록된 본문이 없습니다."}
              </p>
            </div>

            {/* 이전/다음 글 */}
            <div className="border-t border-gray-200 text-sm">
              <NavRow direction="다음글" target={next} onGo={(t) => navigate(`${path}/${t}`)} />
              <NavRow direction="이전글" target={prev} onGo={(t) => navigate(`${path}/${t}`)} />
            </div>

            {/* 목록 버튼 */}
            <div className="flex justify-center pt-8">
              <button onClick={() => navigate(path)} className="px-8 py-2.5 text-sm bg-[#1a4fa0] text-white rounded-lg hover:bg-[#163f82] cursor-pointer">목록으로</button>
            </div>
          </>
        )}
      </div>
    </SubPageLayout>
  );
}

function NavRow({
  direction,
  target,
  onGo,
}: {
  direction: string;
  target: PostRow | null;
  onGo: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-4 px-2 py-3 border-b border-gray-100">
      <span className="text-gray-400 w-14 flex-shrink-0 flex items-center gap-1">
        <i className={direction === "다음글" ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"}></i>
        {direction}
      </span>
      {target ? (
        <button onClick={() => onGo(target.id)} className="text-gray-700 hover:text-[#1a4fa0] hover:underline text-left cursor-pointer truncate">
          {target.title}
        </button>
      ) : (
        <span className="text-gray-400">등록된 글이 없습니다.</span>
      )}
    </div>
  );
}
