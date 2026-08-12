import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import { deleteSiteUser, listSiteUsers, setUserBlocked } from "@/features/users/api";
import type { SiteUser } from "@/features/users/api";

type Filter = "all" | "member" | "admin" | "blocked";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "member", label: "일반 회원" },
  { key: "admin", label: "관리자" },
  { key: "blocked", label: "차단됨" },
];

function formatDate(value: string | null): string {
  if (!value) return "-";
  return value.slice(0, 10);
}

export default function AdminUsers() {
  const { profile } = useAuth();
  const [rows, setRows] = useState<SiteUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [keyword, setKeyword] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRows(await listSiteUsers());
    } catch (e) {
      setError(e instanceof Error ? e.message : "불러오기 실패");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return rows.filter((r) => {
      const byFilter =
        filter === "all" ||
        (filter === "member" && !r.is_admin) ||
        (filter === "admin" && r.is_admin) ||
        (filter === "blocked" && r.blocked);
      const byKeyword =
        !kw ||
        (r.username ?? "").toLowerCase().includes(kw) ||
        (r.email ?? "").toLowerCase().includes(kw) ||
        (r.name ?? "").toLowerCase().includes(kw);
      return byFilter && byKeyword;
    });
  }, [rows, filter, keyword]);

  const handleToggleBlock = async (row: SiteUser) => {
    const label = row.username ?? row.email ?? "";
    if (!row.blocked && !window.confirm(`${label} 회원의 로그인을 차단할까요?`)) return;
    setError(null);
    try {
      await setUserBlocked(row.id, !row.blocked);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "변경 실패");
    }
  };

  const handleDelete = async (row: SiteUser) => {
    if (
      !window.confirm(
        `${row.username ?? row.email} 회원을 삭제할까요?\n이 회원의 대관 신청 이력(${row.rental_count}건)도 함께 삭제되며 되돌릴 수 없습니다.`,
      )
    )
      return;
    setError(null);
    try {
      await deleteSiteUser(row.id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "삭제 실패");
    }
  };

  const isSuper = profile?.role === "super_admin";

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">회원 관리</h1>
      <p className="text-sm text-gray-500 mb-6">
        홈페이지에 가입한 전체 사용자입니다. 관리자 권한 부여는{" "}
        <strong>관리자 계정</strong> 메뉴에서 처리합니다.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium cursor-pointer ${
                filter === f.key
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="아이디 · 이름 · 이메일 검색"
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-[#1a4fa0]/40"
        />
      </div>

      <p className="text-sm text-gray-500 mb-3">
        총 <strong className="text-[#1a4fa0]">{filtered.length}</strong> 명
      </p>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2 mb-4">
          {error}
        </p>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        {loading ? (
          <div className="p-10 text-center text-gray-400">
            <i className="ri-loader-4-line animate-spin text-2xl"></i>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">해당하는 회원이 없습니다.</div>
        ) : (
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-gray-50 text-gray-500 text-xs">
              <tr>
                <th className="text-left font-medium px-4 py-3 w-28">아이디</th>
                <th className="text-left font-medium px-4 py-3 w-28">이름</th>
                <th className="text-left font-medium px-4 py-3">이메일(인증용)</th>
                <th className="text-left font-medium px-4 py-3 w-24">구분</th>
                <th className="text-left font-medium px-4 py-3 w-20">대관신청</th>
                <th className="text-left font-medium px-4 py-3 w-28">가입일</th>
                <th className="text-left font-medium px-4 py-3 w-28">최근 로그인</th>
                <th className="text-left font-medium px-4 py-3 w-20">상태</th>
                <th className="px-4 py-3 w-28"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-800 font-medium">{row.username ?? "-"}</td>
                  <td className="px-4 py-3 text-gray-700">{row.name ?? "-"}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{row.email ?? "-"}</td>
                  <td className="px-4 py-3">
                    {row.is_admin ? (
                      <span className="text-xs px-2 py-0.5 rounded bg-[#1a4fa0]/10 text-[#1a4fa0]">
                        관리자
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500">일반</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{row.rental_count}건</td>
                  <td className="px-4 py-3 text-gray-500 text-xs font-mono">
                    {formatDate(row.created_at)}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs font-mono">
                    {formatDate(row.last_sign_in_at)}
                  </td>
                  <td className="px-4 py-3">
                    {row.blocked ? (
                      <span className="text-xs text-red-600">차단</span>
                    ) : row.confirmed ? (
                      <span className="text-xs text-green-600">정상</span>
                    ) : (
                      <span className="text-xs text-amber-600">미인증</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {row.is_admin ? (
                      <span className="text-xs text-gray-300">-</span>
                    ) : (
                      <>
                        <button
                          onClick={() => handleToggleBlock(row)}
                          className="text-gray-500 hover:text-amber-600 px-2 cursor-pointer"
                        >
                          {row.blocked ? "해제" : "차단"}
                        </button>
                        {isSuper && (
                          <button
                            onClick={() => handleDelete(row)}
                            className="text-gray-500 hover:text-red-600 px-2 cursor-pointer"
                          >
                            삭제
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
