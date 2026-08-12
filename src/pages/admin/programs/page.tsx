import { useCallback, useEffect, useState } from "react";
import {
  createProgram,
  deleteProgram,
  fetchAllPrograms,
  updateProgram,
  uploadProgramAttachment,
  uploadProgramImage,
} from "@/features/programs/api";
import {
  PROGRAM_CATEGORIES,
  PROGRAM_STATUSES,
  type ProgramCategory,
  type ProgramInput,
  type ProgramRow,
  type ProgramStatus,
} from "@/features/programs/types";

const EMPTY: ProgramInput = {
  title: "",
  category: "교육",
  status: "진행중",
  image_url: null,
  location: null,
  date_range: null,
  body: null,
  contact: null,
  attachments: [],
  is_published: true,
};

export default function AdminPrograms() {
  const [rows, setRows] = useState<ProgramRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<ProgramRow | "new" | null>(null);
  const [form, setForm] = useState<ProgramInput>(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRows(await fetchAllPrograms());
    } catch (e) {
      setError(e instanceof Error ? e.message : "불러오기 실패");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openNew = () => {
    setForm(EMPTY);
    setEditing("new");
  };
  const openEdit = (row: ProgramRow) => {
    setForm({
      title: row.title,
      category: (row.category as ProgramCategory) ?? "교육",
      status: (row.status as ProgramStatus) ?? "진행중",
      image_url: row.image_url,
      location: row.location,
      date_range: row.date_range,
      body: row.body,
      contact: row.contact,
      attachments: row.attachments ?? [],
      is_published: row.is_published,
    });
    setEditing(row);
  };
  const closeForm = () => {
    setEditing(null);
    setForm(EMPTY);
  };

  const handleImage = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const url = await uploadProgramImage(file);
      setForm((f) => ({ ...f, image_url: url }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "이미지 업로드 실패");
    } finally {
      setUploading(false);
    }
  };

  const handleAttachment = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const att = await uploadProgramAttachment(file);
      setForm((f) => ({ ...f, attachments: [...f.attachments, att] }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "첨부파일 업로드 실패");
    } finally {
      setUploading(false);
    }
  };

  const removeAttachment = (idx: number) =>
    setForm((f) => ({ ...f, attachments: f.attachments.filter((_, i) => i !== idx) }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("제목을 입력하세요.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (editing === "new") await createProgram(form);
      else if (editing) await updateProgram(editing.id, form);
      closeForm();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "저장 실패");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row: ProgramRow) => {
    if (!window.confirm(`"${row.title}" 을(를) 삭제할까요?`)) return;
    try {
      await deleteProgram(row.id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "삭제 실패");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">사업소개 관리</h1>
        <button onClick={openNew} className="bg-[#1a4fa0] text-white text-sm rounded-lg px-4 py-2 hover:bg-[#163f82] cursor-pointer">
          + 새 사업 등록
        </button>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2 mb-4">{error}</p>}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-400"><i className="ri-loader-4-line animate-spin text-2xl"></i></div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">등록된 사업이 없습니다.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs">
              <tr>
                <th className="text-left font-medium px-4 py-3 w-16">이미지</th>
                <th className="text-left font-medium px-4 py-3">제목</th>
                <th className="text-left font-medium px-4 py-3 w-20">분류</th>
                <th className="text-left font-medium px-4 py-3 w-20">상태</th>
                <th className="text-left font-medium px-4 py-3 w-16">첨부</th>
                <th className="text-left font-medium px-4 py-3 w-16">게시</th>
                <th className="px-4 py-3 w-24"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">
                    {row.image_url ? (
                      <img src={row.image_url} alt="" className="w-10 h-10 object-cover rounded" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-300"><i className="ri-image-line"></i></div>
                    )}
                  </td>
                  <td className="px-4 py-2 text-gray-800 max-w-xs truncate">{row.title}</td>
                  <td className="px-4 py-2 text-gray-600">{row.category}</td>
                  <td className="px-4 py-2 text-gray-600">{row.status}</td>
                  <td className="px-4 py-2 text-gray-500">{row.attachments?.length || 0}개</td>
                  <td className="px-4 py-2">{row.is_published ? <span className="text-xs text-[#1a4fa0]">게시중</span> : <span className="text-xs text-gray-400">숨김</span>}</td>
                  <td className="px-4 py-2 text-right whitespace-nowrap">
                    <button onClick={() => openEdit(row)} className="text-gray-500 hover:text-[#1a4fa0] px-2 cursor-pointer">수정</button>
                    <button onClick={() => handleDelete(row)} className="text-gray-500 hover:text-red-600 px-2 cursor-pointer">삭제</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={handleSave} className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-auto p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">{editing === "new" ? "새 사업 등록" : "사업 수정"}</h2>

            <Field label="제목 *">
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" required />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="분류">
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as ProgramCategory })} className="input">
                  {PROGRAM_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="상태">
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ProgramStatus })} className="input">
                  {PROGRAM_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
            </div>

            <Field label="사업기간">
              <input value={form.date_range ?? ""} onChange={(e) => setForm({ ...form, date_range: e.target.value || null })} className="input" placeholder="예: 2026-06-01(월) ~ 2026-06-15(월)" />
            </Field>
            <Field label="장소">
              <input value={form.location ?? ""} onChange={(e) => setForm({ ...form, location: e.target.value || null })} className="input" />
            </Field>
            <Field label="문의처">
              <input value={form.contact ?? ""} onChange={(e) => setForm({ ...form, contact: e.target.value || null })} className="input" placeholder="예: 문화사업팀 031-000-0000" />
            </Field>

            <Field label="대표 이미지">
              <div className="space-y-2">
                {form.image_url && <img src={form.image_url} alt="" className="w-24 h-24 object-cover rounded border" />}
                <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImage(f); }} className="block text-sm text-gray-600" />
                <input value={form.image_url ?? ""} onChange={(e) => setForm({ ...form, image_url: e.target.value || null })} className="input" placeholder="또는 이미지 URL 직접 입력" />
              </div>
            </Field>

            <Field label="첨부파일 (PDF 등)">
              <div className="space-y-2">
                {form.attachments.map((att, i) => (
                  <div key={i} className="flex items-center justify-between gap-2 bg-gray-50 border border-gray-200 rounded px-3 py-1.5 text-sm">
                    <span className="flex items-center gap-2 truncate text-gray-700">
                      <i className="ri-file-line text-gray-400"></i>
                      <span className="truncate">{att.name}</span>
                    </span>
                    <button type="button" onClick={() => removeAttachment(i)} className="text-gray-400 hover:text-red-500 cursor-pointer flex-shrink-0">
                      <i className="ri-close-line"></i>
                    </button>
                  </div>
                ))}
                <input type="file" accept=".pdf,.hwp,.doc,.docx,.xls,.xlsx,.zip,image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) { handleAttachment(f); e.target.value = ""; } }} className="block text-sm text-gray-600" />
              </div>
            </Field>

            <Field label="상세 내용">
              <textarea value={form.body ?? ""} onChange={(e) => setForm({ ...form, body: e.target.value || null })} className="input min-h-[100px]" />
            </Field>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
              홈페이지에 게시
            </label>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={closeForm} className="px-4 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer">취소</button>
              <button type="submit" disabled={saving || uploading} className="px-4 py-2 text-sm bg-[#1a4fa0] text-white rounded-lg hover:bg-[#163f82] disabled:opacity-50 cursor-pointer">
                {uploading ? "업로드 중..." : saving ? "저장 중..." : "저장"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      {children}
    </label>
  );
}
