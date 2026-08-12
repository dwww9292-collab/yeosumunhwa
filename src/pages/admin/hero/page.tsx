import { useCallback, useEffect, useState } from "react";
import {
  createSlide,
  deleteSlide,
  fetchAllSlides,
  updateSlide,
  uploadHeroImage,
  type HeroSlide,
  type HeroSlideInput,
} from "@/features/hero/api";

const SECTIONS = [
  { key: "home", label: "메인(홈)" },
  { key: "performance", label: "공연" },
  { key: "exhibition", label: "전시" },
  { key: "festival", label: "축제" },
] as const;

type SectionKey = (typeof SECTIONS)[number]["key"];

function emptyForm(section: SectionKey): HeroSlideInput {
  return {
    section,
    image_url: null,
    title: "",
    subtitle: "",
    description: "",
    sort_order: 0,
    is_active: true,
  };
}

export default function AdminHero() {
  const [section, setSection] = useState<SectionKey>("home");
  const [rows, setRows] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<HeroSlide | "new" | null>(null);
  const [form, setForm] = useState<HeroSlideInput>(emptyForm("home"));
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async (sec: SectionKey) => {
    setLoading(true);
    setError(null);
    try {
      setRows(await fetchAllSlides(sec));
    } catch (e) {
      setError(e instanceof Error ? e.message : "불러오기 실패");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(section);
  }, [section, load]);

  const openNew = () => {
    setForm({ ...emptyForm(section), sort_order: rows.length + 1 });
    setEditing("new");
  };
  const openEdit = (row: HeroSlide) => {
    setForm({
      section: row.section,
      image_url: row.image_url,
      title: row.title,
      subtitle: row.subtitle,
      description: row.description,
      sort_order: row.sort_order,
      is_active: row.is_active,
    });
    setEditing(row);
  };
  const closeForm = () => {
    setEditing(null);
    setForm(emptyForm(section));
  };

  const handleImage = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const url = await uploadHeroImage(file);
      setForm((f) => ({ ...f, image_url: url }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "이미지 업로드 실패");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (editing === "new") await createSlide(form);
      else if (editing) await updateSlide(editing.id, form);
      closeForm();
      await load(section);
    } catch (e) {
      setError(e instanceof Error ? e.message : "저장 실패");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row: HeroSlide) => {
    if (!window.confirm("이 슬라이드를 삭제할까요?")) return;
    try {
      await deleteSlide(row.id);
      await load(section);
    } catch (e) {
      setError(e instanceof Error ? e.message : "삭제 실패");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-900">배너(슬라이더) 관리</h1>
        <button onClick={openNew} className="bg-[#1a4fa0] text-white text-sm rounded-lg px-4 py-2 hover:bg-[#163f82] cursor-pointer">
          + 슬라이드 추가
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        {section === "home"
          ? "메인(홈) 화면 최상단의 큰 히어로 슬라이더입니다. 이미지와 '큰 제목'을 등록하세요. 등록된 슬라이드가 있으면 홈 히어로가 이 내용으로 표시되고, 없으면 기본 이미지가 노출됩니다. 5초마다 자동 전환됩니다."
          : "공연·전시·축제 페이지 상단 배너입니다. 탭을 선택해 해당 페이지의 슬라이드(이미지·문구·순서)를 관리하세요. 3초마다 자동 전환됩니다."}
      </p>

      {/* 섹션 탭 */}
      <div className="flex gap-2 mb-5">
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            onClick={() => setSection(s.key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium cursor-pointer ${
              section === s.key ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2 mb-4">{error}</p>}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-400"><i className="ri-loader-4-line animate-spin text-2xl"></i></div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">등록된 슬라이드가 없습니다.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs">
              <tr>
                <th className="text-left font-medium px-4 py-3 w-12">순서</th>
                <th className="text-left font-medium px-4 py-3 w-24">이미지</th>
                <th className="text-left font-medium px-4 py-3">문구</th>
                <th className="text-left font-medium px-4 py-3 w-16">노출</th>
                <th className="px-4 py-3 w-24"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-500">{row.sort_order}</td>
                  <td className="px-4 py-2">
                    {row.image_url ? (
                      <img src={row.image_url} alt="" className="w-16 h-10 object-cover rounded" />
                    ) : (
                      <div className="w-16 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-300"><i className="ri-image-line"></i></div>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <p className="text-gray-800 font-medium">{row.subtitle || "-"}</p>
                    <p className="text-xs text-gray-400">{row.title}</p>
                  </td>
                  <td className="px-4 py-2">{row.is_active ? <span className="text-xs text-[#1a4fa0]">노출</span> : <span className="text-xs text-gray-400">숨김</span>}</td>
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
            <h2 className="text-lg font-bold text-gray-900">{editing === "new" ? "슬라이드 추가" : "슬라이드 수정"}</h2>

            <Field label="이미지">
              <div className="space-y-2">
                {form.image_url && <img src={form.image_url} alt="" className="w-full h-32 object-cover rounded border" />}
                <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImage(f); }} className="block text-sm text-gray-600" />
                {uploading && <p className="text-xs text-gray-400">업로드 중...</p>}
              </div>
            </Field>

            <Field label="큰 제목">
              <input value={form.title ?? ""} onChange={(e) => setForm({ ...form, title: e.target.value || null })} className="input" />
            </Field>
            <Field label="소제목 / 문구 (슬라이드별)">
              <input value={form.subtitle ?? ""} onChange={(e) => setForm({ ...form, subtitle: e.target.value || null })} className="input" placeholder="예: 어가행렬" />
            </Field>
            <Field label="보조 설명 (날짜·장소 등)">
              <input value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value || null })} className="input" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="순서">
                <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} className="input" />
              </Field>
              <label className="flex items-end gap-2 text-sm text-gray-700 pb-2">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                홈페이지에 노출
              </label>
            </div>

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
