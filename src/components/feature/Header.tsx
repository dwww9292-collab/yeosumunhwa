import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthProvider";

const navItems = [
  {
    label: "알림마당",
    href: "/community/notice",
    children: [
      { label: "공지사항", href: "/community/notice" },
      { label: "보도자료", href: "/community/news" },
      { label: "재단소식", href: "/community/archive" },
      { label: "자료실", href: "/community/data" },
    ],
  },
  {
    label: "대관안내",
    href: "/rent/status",
    children: [
      { label: "대관현황", href: "/rent/status" },
      { label: "대관신청", href: "/rent/apply" },
      { label: "공간소개", href: "/rent/space" },
    ],
  },
  {
    label: "문화사업",
    href: "/business",
    children: [
      { label: "사업소개", href: "/business" },
    ],
  },
  {
    label: "공연·전시·축제",
    href: "/business/performance",
    children: [
      { label: "공연", href: "/business/performance" },
      { label: "전시", href: "/business/exhibition" },
      { label: "축제", href: "/business/festival" },
    ],
  },
  {
    label: "재단소개",
    href: "/introduce/greeting",
    children: [
      { label: "인사말", href: "/introduce/greeting" },
      { label: "설립 및 운영", href: "/introduce/establishment" },
      { label: "조직소개", href: "/introduce/organization" },
      { label: "CI소개", href: "/introduce/ci" },
      { label: "경영철학", href: "/introduce/philosophy" },
      { label: "경영공시", href: "/introduce/announce" },
      { label: "오시는길", href: "/introduce/location" },
    ],
  },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { isAdmin, isMember, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isTransparent = isHome && !scrolled;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isTransparent ? "bg-white/0 shadow-none" : "bg-white shadow-md"}`}
    >
      <div className="flex items-center justify-between px-4 md:px-8 lg:px-12 h-20 md:h-24">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
          className="flex-shrink-0"
        >
          <img
            alt="여수문화재단"
            className="h-10 md:h-12"
            src="/images/logo.png"
          />
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <div key={item.label} className="relative group">
              <a
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.href);
                }}
                className={`text-[15px] font-medium py-2 transition-colors whitespace-nowrap ${isTransparent ? "text-white drop-shadow-md hover:text-white/80" : "text-foreground-800 hover:text-primary-500"}`}
              >
                {item.label}
              </a>
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-200 opacity-0 invisible -translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
                <div className="bg-white rounded-lg shadow-lg border border-background-200 py-2 min-w-[160px]">
                  {item.children.map((child) => (
                    <a
                      key={child.label}
                      href={child.href}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(child.href);
                      }}
                      className="block px-4 py-2 text-sm text-foreground-700 hover:bg-background-100 hover:text-primary-500 whitespace-nowrap"
                    >
                      {child.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-3 md:gap-4">
          <div className="hidden md:flex items-center gap-3 text-sm">
            {isAdmin ? (
              <>
                <button
                  onClick={() => navigate("/admin")}
                  className={`transition-colors cursor-pointer ${isTransparent ? "text-white/80 hover:text-white" : "text-foreground-600 hover:text-primary-500"}`}
                >
                  관리자 페이지
                </button>
                <span className={isTransparent ? "text-white/30" : "text-background-300"}>|</span>
                <button
                  onClick={async () => { await signOut(); navigate("/"); }}
                  className={`transition-colors cursor-pointer ${isTransparent ? "text-white/80 hover:text-white" : "text-foreground-600 hover:text-primary-500"}`}
                >
                  로그아웃
                </button>
              </>
            ) : isMember ? (
              <>
                <button
                  onClick={() => navigate("/mypage")}
                  className={`transition-colors cursor-pointer ${isTransparent ? "text-white/80 hover:text-white" : "text-foreground-600 hover:text-primary-500"}`}
                >
                  마이페이지
                </button>
                <span className={isTransparent ? "text-white/30" : "text-background-300"}>|</span>
                <button
                  onClick={async () => { await signOut(); navigate("/"); }}
                  className={`transition-colors cursor-pointer ${isTransparent ? "text-white/80 hover:text-white" : "text-foreground-600 hover:text-primary-500"}`}
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/member/login")}
                  className={`transition-colors cursor-pointer ${isTransparent ? "text-white/80 hover:text-white" : "text-foreground-600 hover:text-primary-500"}`}
                >
                  로그인
                </button>
                <span className={isTransparent ? "text-white/30" : "text-background-300"}>|</span>
                <button
                  onClick={() => navigate("/member/signup")}
                  className={`transition-colors cursor-pointer ${isTransparent ? "text-white/80 hover:text-white" : "text-foreground-600 hover:text-primary-500"}`}
                >
                  회원가입
                </button>
              </>
            )}
          </div>
          <div className="hidden md:flex items-center gap-2">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 flex items-center justify-center"
            >
              <i className={`ri-instagram-line text-lg ${isTransparent ? "text-white/80" : "text-foreground-600"}`}></i>
            </a>
            <a
              href="https://blog.naver.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 flex items-center justify-center"
            >
              <i className={`ri-chat-1-line text-lg ${isTransparent ? "text-white/80" : "text-foreground-600"}`}></i>
            </a>
            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 flex items-center justify-center"
            >
              <i className={`ri-youtube-line text-lg ${isTransparent ? "text-white/80" : "text-foreground-600"}`}></i>
            </a>
          </div>
          <button className="w-8 h-8 flex items-center justify-center cursor-pointer">
            <i className={`ri-search-line text-lg ${isTransparent ? "text-white/80" : "text-foreground-700"}`}></i>
          </button>
          <button
            className="lg:hidden w-8 h-8 flex items-center justify-center cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <i className={`ri-menu-line text-xl ${isTransparent ? "text-white" : "text-foreground-700"}`}></i>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-background-200 px-4 py-4">
          {navItems.map((item) => (
            <div key={item.label} className="mb-3">
              <a
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.href);
                  setMobileOpen(false);
                }}
                className="block text-base font-medium text-foreground-800 py-2"
              >
                {item.label}
              </a>
              <div className="pl-4">
                {item.children.map((child) => (
                  <a
                    key={child.label}
                    href={child.href}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(child.href);
                      setMobileOpen(false);
                    }}
                    className="block text-sm text-foreground-600 py-1.5"
                  >
                    {child.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </header>
  );
}