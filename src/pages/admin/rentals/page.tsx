import { useCallback, useEffect, useState } from "react";
import { fetchAllRentals, reviewRental } from "@/features/rentals/api";
import { STATUS_LABEL, type RentalApplication, type RentalStatus } from "@/features/rentals/types";

const FILTERS: { key: RentalStatus | "all"; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "pending", label: "검토중" },
  { key: "approved", label: "승인" },
  { key: "rejected", label: "거절" },
];

const statusStyle: Record<string, string> = {
  pending: "bg-amber-50 text-amber-600",
  approved: "bg-green-50 text-green-600",
  rejected: "bg-red-50 text-red-500",
};

export default function AdminRentals() {
  const [filter, setFilter] = useState<RentalStatus | "all">("all");
  const [rows, setRows] = useState<RentalApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<RentalApplication | null>(null);
  const [memo, setMemo] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async (f: RentalStatus | "all") => {
    setLoading(true);
    setError(null);
    try {
      setRows(await fetchAllRentals(f === "all" ? undefined : f));
    } catch (e) {
      setError(e instanceof Error ? e.message : "불러오기 실패");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(filter);
  }, [filter, load]);

  const open = (row: RentalApplication) => {
    setActive(row);
    setMemo(row.admin_memo ?? "");
  };

  const handleReview = async (status: RentalStatus) => {
    if (!active) return;
    setSaving(true);
    setError(null);
    try {
      await reviewRental(active.id, status, memo.trim() || null);
      setActive(null);
      await load(filter);
    } catch (e) {
      setError(e instanceof Error ? e.message : "처리 실패");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">대관 신청 관리</h1>

      <div className="flex gap-2 mb-5">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium cursor-pointer ${
              filter === f.key ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2 mb-4">{error}</p>}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-400"><i className="ri-loader-4-line animate-spin text-2xl"></i></div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">신청 내역이 없습니다.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs">
              <tr>
                <th className="text-left font-medium px-4 py-3">신청자</th>
                <th className="text-left font-medium px-4 py-3">공간</th>
                <th className="text-left font-medium px-4 py-3 w-44">사용일</th>
                <th className="text-left font-medium px-4 py-3">목적</th>
                <th className="text-left font-medium px-4 py-3 w-20">상태</th>
                <th className="px-4 py-3 w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-800">
                    {r.applicant_name}
                    {r.org && <span className="text-gray-400"> · {r.org}</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{r.space}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {r.use_date_from}
                    {r.use_date_to && r.use_date_to !== r.use_date_from ? ` ~ ${r.use_date_to}` : ""}
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{r.purpose ?? "-"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${statusStyle[r.status]}`}>
                      {STATUS_LABEL[r.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => open(r)} className="text-[#1a4fa0] hover:underline cursor-pointer">
                      처리
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 상세/처리 모달 */}
      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-3 max-h-[90vh] overflow-auto">
            <h2 className="text-lg font-bold text-gray-900">대관 신청 처리</h2>
            <dl className="text-sm text-gray-700 space-y-1.5">
              <Info label="신청자" value={active.applicant_name} />
              <Info label="단체/기관" value={active.org ?? "-"} />
              <Info label="연락처" value={active.phone ?? "-"} />
              <Info label="이메일" value={active.email ?? "-"} />
              <Info label="공간" value={active.space} />
              <Info
                label="사용일"
                value={`${active.use_date_from}${active.use_date_to && active.use_date_to !== active.use_date_from ? ` ~ ${active.use_date_to}` : ""}`}
              />
              <Info label="인원" value={active.headcount ? `${active.headcount}명` : "-"} />
              <Info label="목적" value={active.purpose ?? "-"} />
              <Info label="비고" value={active.memo ?? "-"} />
            </dl>

            <label className="block pt-2">
              <span className="block text-sm font-medium text-gray-700 mb-1">관리자 답변 (신청자에게 표시)</span>
              <textarea value={memo} onChange={(e) => setMemo(e.target.value)} className="input min-h-[80px]" />
            </label>

            <div className="flex justify-between gap-2 pt-2">
              <button onClick={() => setActive(null)} className="px-4 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer">
                닫기
              </button>
              <div className="flex gap-2">
                <button onClick={() => handleReview("rejected")} disabled={saving} className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 cursor-pointer">
                  거절
                </button>
                <button onClick={() => handleReview("approved")} disabled={saving} className="px-4 py-2 text-sm bg-[#1a4fa0] text-white rounded-lg hover:bg-[#163f82] disabled:opacity-50 cursor-pointer">
                  승인
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="text-gray-400 w-16 shrink-0">{label}</dt>
      <dd className="text-gray-800">{value}</dd>
    </div>
  );
}
