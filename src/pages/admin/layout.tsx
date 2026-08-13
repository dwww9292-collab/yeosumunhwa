import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthProvider";
import { useNoIndex } from "@/features/seo/useNoIndex";
import { ADMIN_BASE, ADMIN_LOGIN, adminPath } from "@/features/auth/adminPath";

interface NavItem {
  label: string;
  to: string;
  icon: string;
  end?: boolean;
  superOnly?: boolean;
}

const navGroups: { title: string; items: NavItem[] }[] = [
  {
    title: "현황",
    items: [{ label: "대시보드", to: ADMIN_BASE, icon: "ri-dashboard-line", end: true }],
  },
  {
    title: "콘텐츠 관리",
    items: [
      { label: "알림마당(게시판)", to: adminPath("posts"), icon: "ri-article-line" },
      { label: "공연·전시·축제", to: adminPath("events"), icon: "ri-calendar-event-line" },
      { label: "사업소개", to: adminPath("programs"), icon: "ri-briefcase-line" },
      { label: "축제 배너", to: adminPath("hero"), icon: "ri-slideshow-line" },
    ],
  },
  {
    title: "대관 관리",
    items: [
      { label: "대관 신청", to: adminPath("rentals"), icon: "ri-building-line" },
      { label: "대관현황 일정", to: adminPath("schedules"), icon: "ri-calendar-schedule-line" },
    ],
  },
  {
    title: "회원 관리",
    items: [
      { label: "회원", to: adminPath("users"), icon: "ri-user-line" },
      { label: "관리자 계정", to: adminPath("members"), icon: "ri-shield-user-line", superOnly: true },
    ],
  },
];

export default function AdminLayout() {
  const { profile, username, signOut } = useAuth();
  const navigate = useNavigate();
  useNoIndex();

  const handleSignOut = async () => {
    await signOut();
    navigate(ADMIN_LOGIN, { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-5 border-b border-gray-100">
          <span className="font-bold text-gray-900">관리자 콘솔</span>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-4">
          {navGroups.map((group) => {
            const items = group.items.filter(
              (item) => !item.superOnly || profile?.role === "super_admin",
            );
            if (items.length === 0) return null;
            return (
              <div key={group.title}>
                <p className="px-3 pb-1 text-[11px] font-medium text-gray-400 tracking-wide">
                  {group.title}
                </p>
                <div className="space-y-1">
                  {items.map((item) => (
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
                </div>
              </div>
            );
          })}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <div className="px-3 py-2 text-xs text-gray-500">
            {profile?.name ?? "관리자"}
            <span className="ml-1 text-gray-400">
              ({profile?.role === "super_admin" ? "최고관리자" : "편집자"})
            </span>
            {username && <span className="block text-gray-400 mt-0.5">{username}</span>}
          </div>
          <NavLink
            to="/"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 cursor-pointer"
          >
            <i className="ri-external-link-line text-lg"></i>
            홈페이지 보기
          </NavLink>
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
