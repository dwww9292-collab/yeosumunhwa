import { useNavigate, useParams } from "react-router-dom";
import SubPageLayout from "@/components/feature/SubPageLayout";
import { announceItems } from "@/mocks/introduce";

const introduceTabs = [
  { label: "인사말", href: "/introduce/greeting" },
  { label: "설립 및 운영", href: "/introduce/establishment" },
  { label: "조직소개", href: "/introduce/organization" },
  { label: "CI소개", href: "/introduce/ci" },
  { label: "재단소개", href: "/introduce/philosophy" },
  { label: "경영공시", href: "/introduce/announce" },
  { label: "오시는길", href: "/introduce/location" },
];

export default function AnnounceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = announceItems.find((a) => String(a.id) === id);

  // 같은 분류 내 이전/다음 글
  const sameCat = item ? announceItems.filter((a) => a.category === item.category) : [];
  const idx = item ? sameCat.findIndex((a) => a.id === item.id) : -1;
  const prev = idx > 0 ? sameCat[idx - 1] : null;
  const next = idx >= 0 && idx < sameCat.length - 1 ? sameCat[idx + 1] : null;

  return (
    <SubPageLayout categoryLabel="재단소개" categoryPath="/introduce/greeting" currentLabel="경영공시" tabs={introduceTabs}>
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">경영공시</h2>

      <div className="px-4 md:px-8 py-6 max-w-3xl mx-auto">
        {!item ? (
          <div className="py-24 text-center text-gray-500">
            <p>존재하지 않는 게시물입니다.</p>
            <button onClick={() => navigate("/introduce/announce")} className="mt-6 px-5 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
              목록으로
            </button>
          </div>
        ) : (
          <>
            {/* 제목 영역 */}
            <div className="border-t-2 border-gray-800 border-b border-gray-200 py-5">
              <span className="inline-block text-xs font-medium text-[#1a4fa0] bg-[#1a4fa0]/10 rounded px-2 py-0.5 mb-2">
                {item.category}
              </span>
              <h3 className="text-lg md:text-xl font-bold text-gray-900">{item.title}</h3>
              <p className="text-xs text-gray-400 mt-2">작성일 {item.date}</p>
            </div>

            {/* 첨부파일 */}
            <div className="flex items-center gap-2 py-3 border-b border-gray-100 text-sm">
              <i className="ri-attachment-2 text-gray-400"></i>
              <span className="text-gray-400">첨부파일</span>
              <span className="text-gray-400">등록된 첨부파일이 없습니다.</span>
            </div>

            {/* 본문 */}
            <div className="py-10 min-h-[160px]">
              <p className="text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                {[
                  `여수문화재단 경영공시 - ${item.category}`,
                  `「${item.title}」 자료를 공개합니다. 세부 내역은 첨부 문서를 통해 확인하실 수 있으며, 본 자료는 ${item.date} 기준으로 작성되었습니다.`,
                  `※ 본 페이지는 시연용 프로토타입으로, 실제 공시 문서는 관리자 페이지에서 등록·관리됩니다.`,
                ].join("\n\n")}
              </p>
            </div>

            {/* 이전/다음 글 */}
            <div className="border-t border-gray-200 text-sm">
              <NavRow direction="다음글" target={next} navigate={navigate} />
              <NavRow direction="이전글" target={prev} navigate={navigate} />
            </div>

            {/* 목록 버튼 */}
            <div className="flex justify-center pt-8">
              <button onClick={() => navigate("/introduce/announce")} className="px-8 py-2.5 text-sm bg-[#1a4fa0] text-white rounded-lg hover:bg-[#163f82] cursor-pointer">
                목록으로
              </button>
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
  navigate,
}: {
  direction: string;
  target: { id: number; title: string } | null;
  navigate: (to: string) => void;
}) {
  return (
    <div className="flex items-center gap-4 px-2 py-3 border-b border-gray-100">
      <span className="text-gray-400 w-14 flex-shrink-0 flex items-center gap-1">
        <i className={direction === "다음글" ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"}></i>
        {direction}
      </span>
      {target ? (
        <button onClick={() => navigate(`/introduce/announce/${target.id}`)} className="text-gray-700 hover:text-[#1a4fa0] hover:underline text-left cursor-pointer truncate">
          {target.title}
        </button>
      ) : (
        <span className="text-gray-400">등록된 글이 없습니다.</span>
      )}
    </div>
  );
}
