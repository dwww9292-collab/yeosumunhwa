import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthProvider";
import { supabase } from "@/lib/supabase";

interface Stats {
  pendingRentals: number;
  events: number;
  admins: number;
}

async function countTable(table: string, eq?: [string, string | boolean]): Promise<number> {
  let query = supabase.from(table).select("*", { count: "exact", head: true });
  if (eq) query = query.eq(eq[0], eq[1]);
  const { count, error } = await query;
  if (error) throw error;
  return count ?? 0;
}

const CARDS: {
  key: keyof Stats;
  label: string;
  to: string;
  icon: string;
  accent: string;
}[] = [
  { key: "pendingRentals", label: "대관 신청 대기", to: "/admin/rentals", icon: "ri-building-line", accent: "text-amber-600" },
  { key: "events", label: "공연·전시·축제", to: "/admin/events", icon: "ri-calendar-event-line", accent: "text-[#1a4fa0]" },
  { key: "admins", label: "관리자 계정", to: "/admin/members", icon: "ri-team-line", accent: "text-emerald-600" },
];

export default function AdminDashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      countTable("rental_applications", ["status", "pending"]),
      countTable("events"),
      countTable("profiles", ["is_active", true]),
    ])
      .then(([pendingRentals, events, admins]) => {
        if (active) setStats({ pendingRentals, events, admins });
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
    </div>
  );
}
