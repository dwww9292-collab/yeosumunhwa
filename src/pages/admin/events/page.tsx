import { useCallback, useEffect, useState } from "react";
import {
  createEvent,
  deleteEvent,
  fetchAllEvents,
  updateEvent,
  uploadPoster,
} from "@/features/events/api";
import { deriveStatus, formatDateRange } from "@/features/events/format";
import type { EventInput, EventRow, EventTag, EventType } from "@/features/events/types";

const TYPE_TABS: { key: EventType; label: string }[] = [
  { key: "performance", label: "공연" },
  { key: "exhibition", label: "전시" },
  { key: "festival", label: "축제" },
];

const EMPTY_FORM: EventInput = {
  type: "performance",
  title: "",
  image_url: null,
  tag: "기획",
  location: null,
  start_date: null,
  end_date: null,
  body: null,
  is_published: true,
};

export default function AdminEvents() {
  const [activeType, setActiveType] = useState<EventType>("performance");
  const [rows, setRows] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 폼 상태: null=닫힘, "new"=신규, EventRow=수정
  const [editing, setEditing] = useState<EventRow | "new" | null>(null);
  const [form, setForm] = useState<EventInput>(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async (type: EventType) => {
    setLoading(true);
    setError(null);
    try {
      setRows(await fetchAllEvents(type));
    } catch (e) {
      setError(e instanceof Error ? e.message : "불러오기 실패");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(activeType);
  }, [activeType, load]);

  const openNew = () => {
    setForm({ ...EMPTY_FORM, type: activeType });
    setEditing("new");
  };

  const openEdit = (row: EventRow) => {
    setForm({
      type: row.type,
      title: row.title,
      image_url: row.image_url,
      tag: row.tag,
      location: row.location,
      start_date: row.start_date,
      end_date: row.end_date,
      body: row.body,
      is_published: row.is_published,
    });
    setEditing(row);
  };

  const closeForm = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const url = await uploadPoster(file);
      setForm((f) => ({ ...f, image_url: url }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "이미지 업로드 실패");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("제목을 입력하세요.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (editing === "new") {
        await createEvent(form);
      } else if (editing) {
        await updateEvent(editing.id, form);
      }
      closeForm();
      await load(activeType);
    } catch (e) {
      setError(e instanceof Error ? e.message : "저장 실패");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row: EventRow) => {
    if (!window.confirm(`"${row.title}" 을(를) 삭제할까요?`)) return;
    setError(null);
    try {
      await deleteEvent(row.id);
      await load(activeType);
    } catch (e) {
      setError(e instanceof Error ? e.message : "삭제 실패");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">공연·전시·축제 관리</h1>
        <button
          onClick={openNew}
          className="bg-[#1a4fa0] text-white text-sm rounded-lg px-4 py-2 hover:bg-[#163f82] cursor-pointer"
        >
          + 새 항목 등록
        </button>
      </div>

      {/* 타입 탭 */}
      <div className="flex gap-2 mb-5">
        {TYPE_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveType(t.key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium cursor-pointer ${
              activeType === t.key
                ? "bg-gray-800 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2 mb-4">
          {error}
        </p>
      )}

      {/* 목록 */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-400">
            <i className="ri-loader-4-line animate-spin text-2xl"></i>
          </div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">등록된 항목이 없습니다.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs">
              <tr>
                <th className="text-left font-medium px-4 py-3 w-16">포스터</th>
                <th className="text-left font-medium px-4 py-3">제목</th>
                <th className="text-left font-medium px-4 py-3 w-20">구분</th>
                <th className="text-left font-medium px-4 py-3 w-48">기간</th>
                <th className="text-left font-medium px-4 py-3 w-20">상태</th>
                <th className="text-left font-medium px-4 py-3 w-20">게시</th>
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
                      <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-300">
                        <i className="ri-image-line"></i>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2 text-gray-800 max-w-xs truncate">{row.title}</td>
                  <td className="px-4 py-2 text-gray-600">{row.tag}</td>
                  <td className="px-4 py-2 text-gray-500 text-xs">
                    {formatDateRange(row.start_date, row.end_date) || "-"}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        deriveStatus(row.end_date) === "종료"
                          ? "bg-gray-100 text-gray-500"
                          : "bg-green-50 text-green-600"
                      }`}
                    >
                      {deriveStatus(row.end_date)}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {row.is_published ? (
                      <span className="text-xs text-[#1a4fa0]">게시중</span>
                    ) : (
                      <span className="text-xs text-gray-400">숨김</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-right whitespace-nowrap">
                    <button
                      onClick={() => openEdit(row)}
                      className="text-gray-500 hover:text-[#1a4fa0] px-2 cursor-pointer"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(row)}
                      className="text-gray-500 hover:text-red-600 px-2 cursor-pointer"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 작성/수정 폼 (모달) */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={handleSave}
            className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-auto p-6 space-y-4"
          >
            <h2 className="text-lg font-bold text-gray-900">
              {editing === "new" ? "새 항목 등록" : "항목 수정"}
            </h2>

            <Field label="구분 (탭)">
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as EventType })}
                className="input"
              >
                {TYPE_TABS.map((t) => (
                  <option key={t.key} value={t.key}>{t.label}</option>
                ))}
              </select>
            </Field>

            <Field label="제목 *">
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="input"
                required
              />
            </Field>

            <Field label="태그">
              <select
                value={form.tag}
                onChange={(e) => setForm({ ...form, tag: e.target.value as EventTag })}
                className="input"
              >
                <option value="기획">기획</option>
                <option value="대관">대관</option>
              </select>
            </Field>

            <Field label="장소">
              <input
                value={form.location ?? ""}
                onChange={(e) => setForm({ ...form, location: e.target.value || null })}
                className="input"
                placeholder="예: 양주아트홀 공연장"
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="시작일">
                <input
                  type="date"
                  value={form.start_date ?? ""}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value || null })}
                  className="input"
                />
              </Field>
              <Field label="종료일">
                <input
                  type="date"
                  value={form.end_date ?? ""}
                  onChange={(e) => setForm({ ...form, end_date: e.target.value || null })}
                  className="input"
                />
              </Field>
            </div>

            <Field label="포스터 이미지">
              <div className="space-y-2">
                {form.image_url && (
                  <img src={form.image_url} alt="" className="w-24 h-24 object-cover rounded border" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file);
                  }}
                  className="block text-sm text-gray-600"
                />
                {uploading && <p className="text-xs text-gray-400">업로드 중...</p>}
                <input
                  value={form.image_url ?? ""}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value || null })}
                  className="input"
                  placeholder="또는 이미지 URL 직접 입력"
                />
              </div>
            </Field>

            <Field label="상세 내용 (선택)">
              <textarea
                value={form.body ?? ""}
                onChange={(e) => setForm({ ...form, body: e.target.value || null })}
                className="input min-h-[80px]"
              />
            </Field>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
              />
              홈페이지에 게시
            </label>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={closeForm}
                className="px-4 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={saving || uploading}
                className="px-4 py-2 text-sm bg-[#1a4fa0] text-white rounded-lg hover:bg-[#163f82] disabled:opacity-50 cursor-pointer"
              >
                {saving ? "저장 중..." : "저장"}
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
