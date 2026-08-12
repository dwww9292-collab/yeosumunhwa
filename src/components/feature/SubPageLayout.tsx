import { useNavigate, useLocation, Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

interface TabItem {
  label: string;
  href: string;
}

interface SubPageLayoutProps {
  categoryLabel: string;
  categoryPath: string;
  currentLabel: string;
  tabs: TabItem[];
  children: React.ReactNode;
}

export default function SubPageLayout({
  categoryLabel,
  categoryPath,
  currentLabel,
  tabs,
  children,
}: SubPageLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* SubPage Hero Banner */}
      <div className="relative pt-20 md:pt-24 bg-gradient-to-r from-slate-100 to-sky-50 overflow-hidden">
        <div className="absolute right-40 top-4 w-32 h-32 rounded-full bg-teal-200/50"></div>
        <div className="absolute right-16 top-12 w-24 h-24 rounded-full bg-violet-200/40"></div>
        <div className="absolute right-64 top-8 w-16 h-16 rounded-full bg-green-200/40"></div>
        <div className="relative max-w-[1240px] mx-auto px-6 py-8 md:py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <button
              onClick={() => navigate("/")}
              className="hover:text-gray-700 transition-colors cursor-pointer"
            >
              <i className="ri-home-4-line"></i>
            </button>
            <i className="ri-arrow-right-s-line text-gray-400"></i>
            <span className="text-gray-600">{categoryLabel}</span>
            <i className="ri-arrow-right-s-line text-gray-400"></i>
            <span className="text-gray-700 font-medium">{currentLabel}</span>
          </div>
          {/* Category Title */}
          <h2 className="text-4xl font-bold text-gray-900 mb-6">{categoryLabel}</h2>
          {/* Tabs */}
          <div className="flex gap-6 border-b-0">
            {tabs.map((tab) => {
              const isActive = location.pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  to={tab.href}
                  className={`pb-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                    isActive
                      ? "border-[#1a4fa0] text-[#1a4fa0]"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 bg-white">
        <div className="max-w-[1240px] mx-auto px-6 py-10">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}