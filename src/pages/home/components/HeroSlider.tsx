import { useState, useEffect, useCallback } from "react";
import { heroSlides } from "@/mocks/home";
import { realHeroSlides } from "@/mocks/real-assets";
import { fetchActiveSlides } from "@/features/hero/api";

interface Slide {
  id: string | number;
  title: string;
  image: string;
  link?: string;
  poster?: boolean;
}

// 관리자 슬라이드가 없을 때 보여줄 기본값: 포스터형(캐릭터) 슬라이드를 맨 앞으로, 그 뒤 실자산 + 나머지 임시 슬라이드
const posterSlides: Slide[] = heroSlides.filter((s) => s.poster);
const nonPosterSlides: Slide[] = heroSlides.filter((s) => !s.poster);
const fallbackSlides: Slide[] = [...posterSlides, ...realHeroSlides, ...nonPosterSlides];

export default function HeroSlider() {
  const [slides, setSlides] = useState<Slide[]>(fallbackSlides);
  const [current, setCurrent] = useState(0);

  // 관리자(hero_slides, section="home")에 등록된 슬라이드가 있으면 그것으로 표시
  useEffect(() => {
    let active = true;
    fetchActiveSlides("home")
      .then((rows) => {
        if (!active || rows.length === 0) return;
        setSlides(
          rows
            .filter((r) => r.image_url)
            .map((r) => ({
              id: r.id,
              title: r.title || r.subtitle || "",
              image: r.image_url as string,
              link: r.description || undefined,
            })),
        );
        setCurrent(0);
      })
      .catch(() => {
        /* 실패 시 기본 슬라이드 유지 */
      });
    return () => {
      active = false;
    };
  }, []);

  const next = useCallback(() => {
    setCurrent((prev) => (slides.length ? (prev + 1) % slides.length : 0));
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  return (
    <section className="relative w-full h-[600px] md:h-[760px] lg:h-[900px] xl:h-[980px] overflow-hidden bg-gradient-to-r from-primary-950 via-primary-900 to-primary-800 mt-[-80px] md:mt-[-96px]">
      {slides.map((slide, index) => {
        const isPoster = !!slide.poster;
        const hasLink = !!slide.link && slide.link !== "#";
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className={`absolute inset-0 w-full h-full object-cover ${isPoster ? "object-[50%_60%]" : "object-center"}`}
            />
            {!isPoster && (
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
            )}
            {!isPoster && (
              <div className="relative z-10 h-full flex items-center px-4 md:px-12 lg:px-20 pt-[80px] md:pt-[96px]">
                <div className="max-w-3xl">
                  <h2 className="text-white text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 drop-shadow-lg">
                    {slide.title}
                  </h2>
                  {hasLink && (
                    <a
                      href={slide.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 border-2 border-white text-white px-8 py-3 text-sm font-medium hover:bg-white hover:text-primary-900 transition-colors whitespace-nowrap"
                    >
                      자세히보기
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* 인디케이터 */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrent(i)}
              aria-label={`${i + 1}번째 슬라이드`}
              className={`h-2 rounded-full transition-all ${i === current ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
