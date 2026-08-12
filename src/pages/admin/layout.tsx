import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthProvider";
import { useNoIndex } from "@/features/seo/useNoIndex";

const navItems = [
  { label: "대시보드", to: "/admin", icon: "ri-dashboard-line", end: true },
  { label: "공연·전시·축제", to: "/admin/events", icon: "ri-calendar-event-line" },
  { label: "축제 배너", to: "/admin/hero", icon: "ri-slideshow-line" },
  { label: "사업소개", to: "/admin/programs", icon: "ri-briefcase-line" },
  { label: "대관 신청", to: "/admin/rentals", icon: "ri-building-line" },
  { label: "회원(관리자) 관리", to: "/admin/members", icon: "ri-team-line", superOnly: true },
];

export default function AdminLayout() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  useNoIndex();

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-5 border-b border-gray-100">
          <span className="font-bold text-gray-900">관리자 콘솔</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems
            .filter((item) => !item.superOnly || profile?.role === "super_admin")
            .map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-[#1a4fa0] text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                <i className={`${item.icon} text-lg`}></i>
                {item.label}
              </NavLink>
            ))}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <div className="px-3 py-2 text-xs text-gray-500">
            {profile?.name ?? "관리자"}
            <span className="ml-1 text-gray-400">
              ({profile?.role === "super_admin" ? "최고관리자" : "편집자"})
            </span>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 cursor-pointer"
          >
            <i className="ri-logout-box-r-line text-lg"></i>
            로그아웃
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-8 py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
