import { useCallback, useEffect, useState } from "react";
import {
  HALLS,
  createSchedule,
  deleteSchedule,
  fetchSchedules,
  updateSchedule,
} from "@/features/schedules/api";
import type { VenueSchedule, VenueScheduleInput } from "@/features/schedules/api";
import { RENTAL_SPACES } from "@/features/rentals/types";

const today = () => new Date().toISOString().slice(0, 10);

const emptyForm = (space: string): VenueScheduleInput => ({
  space,
  hall: null,
  title: "",
  use_date_from: today(),
  use_date_to: null,
  is_closed: false,
  memo: null,
});

export default function AdminSchedules() {
  const [space, setSpace] = useState<string>(RENTAL_SPACES[0]);
  const [rows, setRows] = useState<VenueSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState<VenueSchedule | "new" | null>(null);
  const [form, setForm] = useState<VenueScheduleInput>(emptyForm(RENTAL_SPACES[0]));
  const [saving, setSaving] = useState(false);

  const load = useCallback(async (s: string) => {
    setLoading(true);
    setError(null);
    try {
      setRows(await fetchSchedules(s));
    } catch (e) {
      setError(e instanceof Error ? e.message : "불러오기 실패");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(space);
  }, [space, load]);

  const openNew = () => {
    setForm(emptyForm(space));
    setEditing("new");
  };

  const openEdit = (row: VenueSchedule) => {
    setForm({
      space: row.space,
      hall: row.hall,
      title: row.title,
      use_date_from: row.use_date_from,
      use_date_to: row.use_date_to,
      is_closed: row.is_closed,
      memo: row.memo,
    });
    setEditing(row);
  };

  const closeForm = () => {
    setEditing(null);
    setForm(emptyForm(space));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("표시할 일정명을 입력하세요.");
      return;
    }
    if (form.use_date_to && form.use_date_to < form.use_date_from) {
      setError("종료일이 시작일보다 빠를 수 없습니다.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (editing === "new") await createSchedule(form);
      else if (editing) await updateSchedule(editing.id, form);
      closeForm();
      await load(space);
    } catch (e) {
      setError(e instanceof Error ? e.message : "저장 실패");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row: VenueSchedule) => {
    if (!window.confirm(`"${row.title}" 일정을 삭제할까요?`)) return;
    setError(null);
    try {
      await deleteSchedule(row.id);
      await load(space);
    } catch (e) {
      setError(e instanceof Error ? e.message : "삭제 실패");
    }
  };

  const halls = HALLS[form.space] ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-gray-900">대관현황 일정 관리</h1>
        <button
          onClick={openNew}
          className="bg-[#1a4fa0] text-white text-sm rounded-lg px-4 py-2 hover:bg-[#163f82] cursor-pointer"
        >
          + 일정 등록
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        승인된 대관 신청은 자동으로 캘린더에 표시됩니다. 여기서는 재단 자체 행사 · 휴관 ·
        시설공사처럼 <strong>직접 올려야 하는 일정</strong>만 관리합니다.
      </p>

      {/* 시설 탭 */}
      <div className="flex flex-wrap gap-2 mb-5">
        {RENTAL_SPACES.map((s) => (
          <button
            key={s}
            onClick={() => setSpace(s)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium cursor-pointer ${
              space === s ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2 mb-4">
          {error}
        </p>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-400">
            <i className="ri-loader-4-line animate-spin text-2xl"></i>
          </div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">
            등록된 일정이 없습니다.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs">
              <tr>
                <th className="text-left font-medium px-4 py-3 w-44">기간</th>
                <th className="text-left font-medium px-4 py-3 w-28">장소</th>
                <th className="text-left font-medium px-4 py-3">일정명</th>
                <th className="text-left font-medium px-4 py-3 w-20">휴관</th>
                <th className="px-4 py-3 w-24"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500 text-xs font-mono">
                    {row.use_date_from}
                    {row.use_date_to && row.use_date_to !== row.use_date_from
                      ? ` ~ ${row.use_date_to}`
                      : ""}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{row.hall ?? "-"}</td>
                  <td className="px-4 py-3 text-gray-800">
                    {row.title}
                    {row.memo && (
                      <span className="block text-xs text-gray-400 mt-0.5">{row.memo}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {row.is_closed ? (
                      <span className="text-xs px-2 py-0.5 rounded bg-red-50 text-red-600">
                        휴관
                      </span>
                    ) : (
                      <span className="text-xs text-gray-300">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
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

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={handleSave}
            className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-auto p-6 space-y-4"
          >
            <h2 className="text-lg font-bold text-gray-900">
              {editing === "new" ? "일정 등록" : "일정 수정"}
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <Field label="시설">
                <select
                  value={form.space}
                  onChange={(e) => setForm({ ...form, space: e.target.value, hall: null })}
                  className="input"
                >
                  {RENTAL_SPACES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="장소(홀)">
                <select
                  value={form.hall ?? ""}
                  onChange={(e) => setForm({ ...form, hall: e.target.value || null })}
                  className="input"
                >
                  <option value="">선택 안 함</option>
                  {halls.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="일정명 *">
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="input"
                placeholder="예: 상반기 법정점검 및 보수"
                required
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="시작일 *">
                <input
                  type="date"
                  value={form.use_date_from}
                  onChange={(e) => setForm({ ...form, use_date_from: e.target.value || today() })}
                  className="input"
                  required
                />
              </Field>
              <Field label="종료일 (하루면 비워두세요)">
                <input
                  type="date"
                  value={form.use_date_to ?? ""}
                  onChange={(e) => setForm({ ...form, use_date_to: e.target.value || null })}
                  className="input"
                />
              </Field>
            </div>

            <Field label="관리자 메모 (홈페이지에 표시되지 않음)">
              <input
                value={form.memo ?? ""}
                onChange={(e) => setForm({ ...form, memo: e.target.value || null })}
                className="input"
              />
            </Field>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.is_closed}
                onChange={(e) => setForm({ ...form, is_closed: e.target.checked })}
              />
              휴관일로 표시
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
                disabled={saving}
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
