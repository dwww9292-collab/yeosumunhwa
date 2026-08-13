import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import { adminPath } from "@/features/auth/adminPath";

interface Stats {
  pendingRentals: number;
  posts: number;
  events: number;
  programs: number;
  schedules: number;
  members: number;
  admins: number;
}

async function countTable(table: string, eq?: [string, string | boolean]): Promise<number> {
  let query = supabase.from(table).select("*", { count: "exact", head: true });
  if (eq) query = query.eq(eq[0], eq[1]);
  const { count, error } = await query;
  if (error) throw error;
  return count ?? 0;
}

/** 일반 회원 수 (관리자 제외) */
async function countMembers(): Promise<number> {
  const { data, error } = await supabase.rpc("list_site_users");
  if (error) throw error;
  return ((data ?? []) as { is_admin: boolean }[]).filter((u) => !u.is_admin).length;
}

const CARDS: {
  key: keyof Stats;
  label: string;
  to: string;
  icon: string;
  accent: string;
}[] = [
  { key: "pendingRentals", label: "대관 신청 대기", to: adminPath("rentals"), icon: "ri-building-line", accent: "text-amber-600" },
  { key: "posts", label: "알림마당 게시물", to: adminPath("posts"), icon: "ri-article-line", accent: "text-[#1a4fa0]" },
  { key: "events", label: "공연·전시·축제", to: adminPath("events"), icon: "ri-calendar-event-line", accent: "text-[#1a4fa0]" },
  { key: "programs", label: "사업소개", to: adminPath("programs"), icon: "ri-briefcase-line", accent: "text-[#1a4fa0]" },
  { key: "schedules", label: "대관현황 일정", to: adminPath("schedules"), icon: "ri-calendar-schedule-line", accent: "text-emerald-600" },
  { key: "members", label: "가입 회원", to: adminPath("users"), icon: "ri-user-line", accent: "text-emerald-600" },
  { key: "admins", label: "관리자 계정", to: adminPath("members"), icon: "ri-shield-user-line", accent: "text-gray-700" },
];

const SHORTCUTS = [
  { label: "게시글 작성", to: adminPath("posts"), icon: "ri-add-line" },
  { label: "대관 신청 검토", to: adminPath("rentals"), icon: "ri-check-double-line" },
  { label: "일정 등록", to: adminPath("schedules"), icon: "ri-calendar-line" },
  { label: "홈페이지 보기", to: "/", icon: "ri-external-link-line" },
];

export default function AdminDashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      countTable("rental_applications", ["status", "pending"]),
      countTable("posts"),
      countTable("events"),
      countTable("programs"),
      countTable("venue_schedules"),
      countMembers(),
      countTable("profiles", ["is_active", true]),
    ])
      .then(([pendingRentals, posts, events, programs, schedules, members, admins]) => {
        if (active) setStats({ pendingRentals, posts, events, programs, schedules, members, admins });
      })
      .catch((e) => {
        if (active) setError(e instanceof Error ? e.message : "통계를 불러오지 못했습니다.");
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">대시보드</h1>
      <p className="text-sm text-gray-500 mb-8">{profile?.name ?? "관리자"}님, 환영합니다.</p>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CARDS.map((card) => (
          <Link
            key={card.key}
            to={card.to}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:border-[#1a4fa0]/40 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">{card.label}</p>
              <i className={`${card.icon} text-lg text-gray-300 group-hover:text-[#1a4fa0]`}></i>
            </div>
            <p className={`text-3xl font-bold mt-2 ${card.accent}`}>
              {stats ? stats[card.key] : <span className="text-gray-300">—</span>}
            </p>
            <p className="text-xs text-gray-400 mt-1 inline-flex items-center gap-0.5">
              바로가기 <i className="ri-arrow-right-s-line"></i>
            </p>
          </Link>
        ))}
      </div>

      <h2 className="text-sm font-medium text-gray-500 mt-10 mb-3">바로가기</h2>
      <div className="flex flex-wrap gap-2">
        {SHORTCUTS.map((s) => (
          <Link
            key={s.label}
            to={s.to}
            className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 hover:border-[#1a4fa0]/40 hover:text-[#1a4fa0] transition-colors"
          >
            <i className={s.icon}></i>
            {s.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
