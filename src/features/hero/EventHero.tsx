import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchActiveSlides, type HeroSlide } from "./api";

const TABS = [
  { label: "공연", href: "/business/performance" },
  { label: "전시", href: "/business/exhibition" },
  { label: "축제", href: "/business/festival" },
];

interface EventHeroProps {
  section: "performance" | "exhibition" | "festival";
  activeHref: string;
  /** 슬라이드가 없을 때 보여줄 기본 배너 */
  fallbackTitle: string;
  fallbackDesc: string;
  eyebrow?: string;
}

/** 공연·전시·축제 공통 히어로 슬라이더 (관리자 '배너 관리'에서 등록, 3초 자동 전환, 16:9) */
export default function EventHero({ section, activeHref, fallbackTitle, fallbackDesc, eyebrow }: EventHeroProps) {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    fetchActiveSlides(section)
      .then(setSlides)
      .catch(() => setSlides([]));
  }, [section]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 3000);
    return () => clearInterval(t);
  }, [slides.length]);

  const current = slides[idx];

  return (
    <div className="relative w-full aspect-video overflow-hidden bg-gray-900">
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === idx ? "opacity-100" : "opacity-0"}`}
        >
          {slide.image_url && <img src={slide.image_url} alt={slide.subtitle ?? ""} className="w-full h-full object-cover" />}
        </div>
      ))}

      {/* 텍스트 가독성용 하단 그라데이션 (이미지 윗부분은 선명하게 유지) */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 to-transparent z-[5] pointer-events-none"></div>

      <div className="absolute inset-x-0 bottom-24 md:bottom-32 z-10 px-8 text-center">
        {slides.length > 0 ? (
          <>
            {eyebrow && <p className="text-sm text-amber-300 font-semibold mb-2">{eyebrow}</p>}
            <h3 className="text-2xl md:text-4xl font-bold text-white mb-3 drop-shadow-lg">{current?.title}</h3>
            {current?.subtitle && <p className="text-base md:text-lg text-white font-medium mb-1 drop-shadow">{current.subtitle}</p>}
            {current?.description && <p className="text-xs md:text-sm text-gray-100 drop-shadow">{current.description}</p>}
          </>
        ) : (
          <>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 drop-shadow-lg">{fallbackTitle}</h3>
            <p className="text-sm md:text-base text-gray-200 max-w-2xl mx-auto drop-shadow">{fallbackDesc}</p>
          </>
        )}
      </div>

      {/* 인디케이터 */}
      {slides.length > 1 && (
        <div className="absolute bottom-14 left-0 right-0 z-10 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`슬라이드 ${i + 1}`}
              className={`w-2.5 h-2.5 rounded-full transition-colors cursor-pointer ${i === idx ? "bg-white" : "bg-white/40"}`}
            />
          ))}
        </div>
      )}

      {/* 하단 탭 */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-center border-t border-white/20 bg-black/20">
        {TABS.map((tab) => (
          <Link
            key={tab.href}
            to={tab.href}
            className={`px-10 py-3 text-sm font-medium transition-colors border-b-2 ${
              tab.href === activeHref ? "text-white border-white" : "text-gray-300 border-transparent hover:text-white"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
