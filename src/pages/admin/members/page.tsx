import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import {
  listAdmins,
  promoteAdmin,
  removeAdmin,
  setAdminActive,
  updateAdminRole,
} from "@/features/admins/api";
import type { AdminProfile, AdminRole } from "@/features/auth/types";

const ROLE_LABEL: Record<AdminRole, string> = {
  super_admin: "최고관리자",
  editor: "편집자",
};

export default function AdminMembers() {
  const { profile } = useAuth();
  const [rows, setRows] = useState<AdminProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 승격 폼
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AdminRole>("editor");
  const [name, setName] = useState("");
  const [adding, setAdding] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRows(await listAdmins());
    } catch (e) {
      setError(e instanceof Error ? e.message : "불러오기 실패");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    if (!email.trim()) return;
    setAdding(true);
    try {
      await promoteAdmin(email.trim(), role, name.trim() || null);
      setNotice(`${email} 계정을 관리자로 등록했습니다.`);
      setEmail("");
      setName("");
      setRole("editor");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "승격 실패");
    } finally {
      setAdding(false);
    }
  };

  const isSelf = (id: string) => id === profile?.id;

  // 활성 최고관리자가 1명뿐이면 그 1명을 강등/비활성/회수하지 못하도록 막는다(잠금 사고 방지)
  const activeSuperAdmins = rows.filter((r) => r.role === "super_admin" && r.is_active);
  const isLastSuperAdmin = (row: AdminProfile) =>
    row.role === "super_admin" && row.is_active && activeSuperAdmins.length <= 1;

  const handleRoleChange = async (row: AdminProfile, next: AdminRole) => {
    setError(null);
    if (next !== "super_admin" && isLastSuperAdmin(row)) {
      setError("최소 1명의 활성 최고관리자가 필요합니다. 다른 최고관리자를 먼저 지정하세요.");
      return;
    }
    try {
      await updateAdminRole(row.id, next);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "변경 실패");
    }
  };

  const handleToggleActive = async (row: AdminProfile) => {
    setError(null);
    if (row.is_active && isLastSuperAdmin(row)) {
      setError("마지막 활성 최고관리자는 비활성화할 수 없습니다.");
      return;
    }
    if (row.is_active && !window.confirm(`${row.email ?? row.name} 계정을 비활성화할까요?`)) return;
    try {
      await setAdminActive(row.id, !row.is_active);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "변경 실패");
    }
  };

  const handleRemove = async (row: AdminProfile) => {
    if (isLastSuperAdmin(row)) {
      setError("마지막 활성 최고관리자는 권한을 회수할 수 없습니다.");
      return;
    }
    if (!window.confirm(`${row.email ?? row.name} 의 관리자 권한을 회수할까요? (일반 회원으로 전환)`)) return;
    setError(null);
    try {
      await removeAdmin(row.id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "회수 실패");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">회원(관리자) 관리</h1>
      <p className="text-sm text-gray-500 mb-6">
        관리자로 만들 사람은 <strong>먼저 회원가입</strong> 후, 아래에 그 이메일을 입력해 승격하세요.
      </p>

      {/* 승격 폼 */}
      <form onSubmit={handleAdd} className="bg-white border border-gray-200 rounded-xl p-5 mb-6 flex flex-wrap items-end gap-3">
        <label className="flex-1 min-w-[200px]">
          <span className="block text-sm font-medium text-gray-700 mb-1">가입자 이메일 *</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="input" required />
        </label>
        <label className="w-40">
          <span className="block text-sm font-medium text-gray-700 mb-1">이름(선택)</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className="input" />
        </label>
        <label className="w-36">
          <span className="block text-sm font-medium text-gray-700 mb-1">권한</span>
          <select value={role} onChange={(e) => setRole(e.target.value as AdminRole)} className="input">
            <option value="editor">편집자</option>
            <option value="super_admin">최고관리자</option>
          </select>
        </label>
        <button type="submit" disabled={adding} className="bg-[#1a4fa0] text-white text-sm rounded-lg px-5 py-2 hover:bg-[#163f82] disabled:opacity-50 cursor-pointer">
          {adding ? "처리 중..." : "관리자 등록"}
        </button>
      </form>

      {notice && <p className="text-sm text-green-600 bg-green-50 border border-green-100 rounded px-3 py-2 mb-4">{notice}</p>}
      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2 mb-4">{error}</p>}

      {/* 목록 */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-400"><i className="ri-loader-4-line animate-spin text-2xl"></i></div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs">
              <tr>
                <th className="text-left font-medium px-4 py-3">이름</th>
                <th className="text-left font-medium px-4 py-3">이메일</th>
                <th className="text-left font-medium px-4 py-3 w-40">권한</th>
                <th className="text-left font-medium px-4 py-3 w-24">상태</th>
                <th className="px-4 py-3 w-28"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-800">
                    {row.name ?? "-"}
                    {isSelf(row.id) && <span className="ml-1 text-xs text-gray-400">(나)</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{row.email ?? "-"}</td>
                  <td className="px-4 py-3">
                    <select
                      value={row.role}
                      disabled={isSelf(row.id)}
                      onChange={(e) => handleRoleChange(row, e.target.value as AdminRole)}
                      className="border border-gray-200 rounded px-2 py-1 text-sm disabled:bg-gray-50 disabled:text-gray-400 cursor-pointer"
                    >
                      <option value="editor">{ROLE_LABEL.editor}</option>
                      <option value="super_admin">{ROLE_LABEL.super_admin}</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    {row.is_active ? (
                      <span className="text-xs text-green-600">활성</span>
                    ) : (
                      <span className="text-xs text-gray-400">비활성</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {!isSelf(row.id) && (
                      <>
                        <button onClick={() => handleToggleActive(row)} className="text-gray-500 hover:text-amber-600 px-2 cursor-pointer">
                          {row.is_active ? "비활성" : "활성"}
                        </button>
                        <button onClick={() => handleRemove(row)} className="text-gray-500 hover:text-red-600 px-2 cursor-pointer">
                          회수
                        </button>
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
