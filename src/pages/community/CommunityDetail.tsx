import { useNavigate, useParams } from "react-router-dom";
import SubPageLayout from "@/components/feature/SubPageLayout";
import { noticeItems, newsItems, archiveItems, dataItems } from "@/mocks/community";

const communityTabs = [
  { label: "공지사항", href: "/community/notice" },
  { label: "보도자료", href: "/community/news" },
  { label: "재단소식", href: "/community/archive" },
  { label: "자료실", href: "/community/data" },
];

export type CommunityBoard = "notice" | "news" | "archive" | "data";

interface CommunityItem {
  id: number;
  num?: number;
  title: string;
  date: string;
  isNew?: boolean;
  isNotice?: boolean;
  image?: string;
  type?: string;
  fileType?: string;
  body?: string;
}

// 본문이 별도로 등록되지 않은 게시물의 안내 문구(프로토타입용 샘플 본문)
function buildBody(item: CommunityItem, label: string): string {
  if (item.body) return item.body;
  return [
    `「${item.title}」 관련 안내드립니다.`,
    `자세한 내용은 첨부파일 및 양주문화재단 홈페이지(${label})를 통해 확인하실 수 있습니다. 본 게시물은 ${item.date}에 등록되었으며, 문의 사항은 재단 대표전화(031-828-9772)로 연락 주시기 바랍니다.`,
    `※ 본 페이지는 시연용 프로토타입으로, 실제 본문은 관리자 페이지에서 등록·수정할 수 있도록 구성됩니다.`,
  ].join("\n\n");
}

const BOARDS: Record<CommunityBoard, { label: string; path: string; items: CommunityItem[] }> = {
  notice: { label: "공지사항", path: "/community/notice", items: noticeItems },
  news: { label: "보도자료", path: "/community/news", items: newsItems },
  archive: { label: "재단소식", path: "/community/archive", items: archiveItems },
  data: { label: "자료실", path: "/community/data", items: dataItems },
};

const fileTypeColor: Record<string, string> = {
  PDF: "bg-red-100 text-red-600",
  HWP: "bg-sky-100 text-sky-600",
  XLSX: "bg-green-100 text-green-600",
  ZIP: "bg-yellow-100 text-yellow-600",
};

export default function CommunityDetail({ board }: { board: CommunityBoard }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { label, path, items } = BOARDS[board];

  const idx = items.findIndex((a) => String(a.id) === id);
  const item = idx >= 0 ? items[idx] : null;
  const next = idx > 0 ? items[idx - 1] : null;
  const prev = idx >= 0 && idx < items.length - 1 ? items[idx + 1] : null;

  return (
    <SubPageLayout categoryLabel="알림마당" categoryPath="/community/notice" currentLabel={label} tabs={communityTabs}>
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">{label}</h2>

      <div className="max-w-3xl mx-auto">
        {!item ? (
          <div className="py-24 text-center text-gray-500">
            <p>존재하지 않는 게시물입니다.</p>
            <button onClick={() => navigate(path)} className="mt-6 px-5 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">목록으로</button>
          </div>
        ) : (
          <>
            {/* 제목 영역 */}
            <div className="border-t-2 border-gray-800 border-b border-gray-200 py-5">
              <div className="flex items-center gap-2 mb-2">
                {item.fileType && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${fileTypeColor[item.fileType] || "bg-gray-100 text-gray-600"}`}>{item.fileType}</span>
                )}
                {item.isNew && <span className="text-xs font-bold text-white bg-[#1a4fa0] rounded-full w-5 h-5 inline-flex items-center justify-center">N</span>}
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900">{item.title}</h3>
              <p className="text-xs text-gray-400 mt-2">작성일 {item.date}</p>
            </div>

            {/* 첨부파일 */}
            <div className="flex items-center gap-2 py-3 border-b border-gray-100 text-sm">
              <i className="ri-attachment-2 text-gray-400"></i>
              <span className="text-gray-400">첨부파일</span>
              {item.fileType ? (
                <button
                  onClick={() => alert("첨부파일 다운로드 기능은 자료 등록(관리자) 연동 후 제공됩니다.")}
                  className="text-[#1a4fa0] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <i className="ri-download-2-line"></i>
                  {item.title}.{item.fileType.toLowerCase()}
                </button>
              ) : (
                <span className="text-gray-400">등록된 첨부파일이 없습니다.</span>
              )}
            </div>

            {/* 본문 */}
            <div className="py-10 min-h-[160px]">
              {item.image && (
                <img src={item.image} alt={item.title} className="w-full max-w-xl mx-auto rounded-lg mb-6" />
              )}
              <p className="text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                {buildBody(item, label)}
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
  target: CommunityItem | null;
  onGo: (id: number) => void;
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
