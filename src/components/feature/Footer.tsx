import { Link } from "react-router-dom";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-foreground-900 text-background-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Quick Links */}
        <div className="flex flex-wrap items-center gap-4 py-5 border-b border-foreground-700">
          <Link to="/policy/privacy" className="text-sm font-bold text-accent-400 hover:underline whitespace-nowrap">
            개인정보처리방침
          </Link>
          <span className="text-foreground-600 hidden sm:inline">|</span>
          <Link to="/policy/video" className="text-sm text-foreground-300 hover:text-background-50 whitespace-nowrap">
            영상정보처리기기 운영·관리 방침
          </Link>
          <span className="text-foreground-600 hidden sm:inline">|</span>
          <Link to="/policy/terms" className="text-sm text-foreground-300 hover:text-background-50 whitespace-nowrap">
            서비스 이용약관
          </Link>
          <span className="text-foreground-600 hidden sm:inline">|</span>
          <Link to="/policy/email" className="text-sm text-foreground-300 hover:text-background-50 whitespace-nowrap">
            이메일무단수집거부
          </Link>
          <span className="text-foreground-600 hidden sm:inline">|</span>
          <Link to="/introduce/location" className="text-sm text-foreground-300 hover:text-background-50 whitespace-nowrap">
            오시는길
          </Link>
        </div>

        {/* Main Footer Grid */}
        <div className="py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Logo & Contact - spans 5 cols */}
          <div className="lg:col-span-5">
            <span className="text-xl font-bold text-background-50 mb-4 block">양주문화재단</span>
            <address className="not-italic text-sm text-foreground-400 leading-relaxed space-y-1.5">
              <p>(우)11461 경기도 양주시 광적면 부흥로618번길 303</p>
              <p className="flex flex-wrap gap-x-4 gap-y-1">
                <span>대표전화: <strong className="text-foreground-200 font-medium">031-828-9772</strong></span>
                <span>FAX: 031-828-9779</span>
              </p>
              <p>사업자등록번호: 153-82-00687</p>
              <p>대표자: 화재단</p>
            </address>
          </div>

          {/* Operating Hours - spans 4 cols */}
          <div className="lg:col-span-4">
            <h4 className="text-sm font-bold text-background-50 mb-4 flex items-center gap-2">
              <i className="ri-time-line text-accent-400"></i>
              운영시간 안내
            </h4>
            <div className="text-sm text-foreground-400 space-y-2">
              <div className="flex justify-between">
                <span>평일 (월~금)</span>
                <span className="text-foreground-200">09:00 ~ 18:00</span>
              </div>
              <div className="flex justify-between">
                <span>점심시간</span>
                <span className="text-foreground-200">12:00 ~ 13:00</span>
              </div>
              <div className="flex justify-between">
                <span>주말·공휴일</span>
                <span className="text-accent-400">휴무</span>
              </div>
              <p className="text-xs text-foreground-500 mt-3 leading-relaxed">
                공연장·전시실 등 시설 이용 시간은<br />
                대관 계약 및 행사 일정에 따라 별도 운영됩니다.
              </p>
            </div>
          </div>

          {/* Social Media - spans 3 cols */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold text-background-50 mb-4 flex items-center gap-2">
              <i className="ri-share-line text-accent-400"></i>
              SNS 채널
            </h4>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://blog.naver.com/yjcf_kr"
                target="_blank"
                rel="noopener noreferrer"
                title="양주문화재단 블로그"
                className="w-10 h-10 rounded-lg bg-foreground-800 hover:bg-accent-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <i className="ri-article-line text-lg text-background-50"></i>
              </a>
              <a
                href="https://www.youtube.com/@yangju_cf"
                target="_blank"
                rel="noopener noreferrer"
                title="양주문화재단 유튜브"
                className="w-10 h-10 rounded-lg bg-foreground-800 hover:bg-accent-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <i className="ri-youtube-line text-lg text-background-50"></i>
              </a>
              <a
                href="https://www.instagram.com/yangju_cf"
                target="_blank"
                rel="noopener noreferrer"
                title="양주문화재단 인스타그램"
                className="w-10 h-10 rounded-lg bg-foreground-800 hover:bg-accent-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <i className="ri-instagram-line text-lg text-background-50"></i>
              </a>
              <a
                href="https://www.facebook.com/yangjucf"
                target="_blank"
                rel="noopener noreferrer"
                title="양주문화재단 페이스북"
                className="w-10 h-10 rounded-lg bg-foreground-800 hover:bg-accent-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <i className="ri-facebook-line text-lg text-background-50"></i>
              </a>
              <a
                href="https://pf.kakao.com/_yangjucf"
                target="_blank"
                rel="noopener noreferrer"
                title="양주문화재단 카카오톡 채널"
                className="w-10 h-10 rounded-lg bg-foreground-800 hover:bg-accent-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <i className="ri-kakao-talk-line text-lg text-background-50"></i>
              </a>
            </div>
            <p className="text-xs text-foreground-500 mt-4 leading-relaxed">
              양주문화재단의 다양한 소식을<br />
              SNS에서 빠르게 만나보세요.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-4 border-t border-foreground-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-foreground-500">
            COPYRIGHT ⓒ 2026 Yangju Cultural Foundation. ALL RIGHTS RESERVED.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 border border-foreground-600 text-foreground-300 px-4 py-2 text-xs hover:bg-foreground-800 transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>TOP</span>
            <i className="ri-arrow-up-line"></i>
          </button>
        </div>
      </div>
    </footer>
  );
}