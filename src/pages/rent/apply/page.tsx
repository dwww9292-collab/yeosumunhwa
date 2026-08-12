import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SubPageLayout from "@/components/feature/SubPageLayout";
import { useAuth } from "@/features/auth/AuthProvider";
import { createRental } from "@/features/rentals/api";
import { RENTAL_SPACES, type RentalInput } from "@/features/rentals/types";

const rentTabs = [
  { label: "대관현황", href: "/rent/status" },
  { label: "대관신청", href: "/rent/apply" },
  { label: "공간소개", href: "/rent/space" },
];

const EMPTY: RentalInput = {
  space: RENTAL_SPACES[0],
  applicant_name: "",
  phone: null,
  email: null,
  org: null,
  use_date_from: "",
  use_date_to: null,
  purpose: null,
  headcount: null,
  memo: null,
};

export default function RentApply() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [form, setForm] = useState<RentalInput>({
    ...EMPTY,
    email: session?.user.email ?? null,
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof RentalInput>(key: K, value: RentalInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.applicant_name.trim() || !form.use_date_from) {
      setError("신청자명과 사용 시작일은 필수입니다.");
      return;
    }
    setSubmitting(true);
    try {
      await createRental(form);
      navigate("/mypage", { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "신청에 실패했습니다.");
      setSubmitting(false);
    }
  };

  return (
    <SubPageLayout
      categoryLabel="대관안내"
      categoryPath="/rent/status"
      currentLabel="대관신청"
      tabs={rentTabs}
    >
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">대관 신청</h2>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-5">
        <Row label="대관 공간 *">
          <select value={form.space} onChange={(e) => set("space", e.target.value)} className="input">
            {RENTAL_SPACES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </Row>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Row label="신청자명 *">
            <input value={form.applicant_name} onChange={(e) => set("applicant_name", e.target.value)} className="input" required />
          </Row>
          <Row label="단체/기관명">
            <input value={form.org ?? ""} onChange={(e) => set("org", e.target.value || null)} className="input" />
          </Row>
          <Row label="연락처">
            <input value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value || null)} className="input" placeholder="010-0000-0000" />
          </Row>
          <Row label="이메일">
            <input type="email" value={form.email ?? ""} onChange={(e) => set("email", e.target.value || null)} className="input" />
          </Row>
          <Row label="사용 시작일 *">
            <input type="date" value={form.use_date_from} onChange={(e) => set("use_date_from", e.target.value)} className="input" required />
          </Row>
          <Row label="사용 종료일">
            <input type="date" value={form.use_date_to ?? ""} onChange={(e) => set("use_date_to", e.target.value || null)} className="input" />
          </Row>
          <Row label="예상 인원">
            <input type="number" min={0} value={form.headcount ?? ""} onChange={(e) => set("headcount", e.target.value ? Number(e.target.value) : null)} className="input" />
          </Row>
          <Row label="사용 목적">
            <input value={form.purpose ?? ""} onChange={(e) => set("purpose", e.target.value || null)} className="input" placeholder="예: 정기연주회" />
          </Row>
        </div>

        <Row label="요청사항 / 비고">
          <textarea value={form.memo ?? ""} onChange={(e) => set("memo", e.target.value || null)} className="input min-h-[100px]" />
        </Row>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">{error}</p>
        )}

        <div className="flex justify-center gap-3 pt-4">
          <button type="button" onClick={() => navigate(-1)} className="px-6 py-2.5 text-sm text-gray-600 rounded-lg border border-gray-300 hover:bg-gray-50 cursor-pointer">
            취소
          </button>
          <button type="submit" disabled={submitting} className="px-8 py-2.5 text-sm bg-[#1a4fa0] text-white rounded-lg hover:bg-[#163f82] disabled:opacity-50 cursor-pointer">
            {submitting ? "신청 중..." : "신청하기"}
          </button>
        </div>
      </form>
    </SubPageLayout>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      {children}
    </label>
  );
}
