import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SubPageLayout from "@/components/feature/SubPageLayout";
import { useAuth } from "@/features/auth/AuthProvider";
import { fetchMyRentals } from "@/features/rentals/api";
import { STATUS_LABEL, type RentalApplication } from "@/features/rentals/types";
import { useNoIndex } from "@/features/seo/useNoIndex";

const rentTabs = [
  { label: "대관현황", href: "/rent/status" },
  { label: "대관신청", href: "/rent/apply" },
  { label: "공간소개", href: "/rent/space" },
];

const statusStyle: Record<string, string> = {
  pending: "bg-amber-50 text-amber-600",
  approved: "bg-green-50 text-green-600",
  rejected: "bg-red-50 text-red-500",
};

export default function MyPage() {
  useNoIndex();
  const navigate = useNavigate();
  const { session, signOut } = useAuth();
  const [rows, setRows] = useState<RentalApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMyRentals()
      .then(setRows)
      .catch((e) => setError(e instanceof Error ? e.message : "불러오기 실패"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SubPageLayout categoryLabel="마이페이지" categoryPath="/mypage" currentLabel="대관 신청 현황" tabs={rentTabs}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">나의 대관 신청 현황</h2>
          <p className="text-sm text-gray-500 mt-1">{session?.user.email}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate("/rent/apply")} className="bg-[#1a4fa0] text-white text-sm rounded-lg px-4 py-2 hover:bg-[#163f82] cursor-pointer">
            + 새 대관 신청
          </button>
          <button onClick={async () => { await signOut(); navigate("/"); }} className="text-sm text-gray-600 rounded-lg px-4 py-2 border border-gray-300 hover:bg-gray-50 cursor-pointer">
            로그아웃
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2 mb-4">{error}</p>}

      {loading ? (
        <div className="py-20 text-center text-gray-400"><i className="ri-loader-4-line animate-spin text-2xl"></i></div>
      ) : rows.length === 0 ? (
        <div className="py-20 text-center text-gray-400 text-sm">신청 내역이 없습니다.</div>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{r.space}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${statusStyle[r.status]}`}>
                      {STATUS_LABEL[r.status]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {r.use_date_from}
                    {r.use_date_to && r.use_date_to !== r.use_date_from ? ` ~ ${r.use_date_to}` : ""}
                    {r.purpose ? ` · ${r.purpose}` : ""}
                  </p>
                  {r.org && <p className="text-xs text-gray-400 mt-0.5">{r.org}</p>}
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">{r.created_at.slice(0, 10)}</span>
              </div>
              {r.admin_memo && (
                <p className="mt-3 text-sm text-gray-600 bg-gray-50 rounded px-3 py-2">
                  <span className="font-medium text-gray-700">관리자 답변:</span> {r.admin_memo}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </SubPageLayout>
  );
}
