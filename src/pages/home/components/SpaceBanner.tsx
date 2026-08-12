import { useState } from "react";
import { spaceBanners } from "@/mocks/home";

export default function SpaceBanner() {
  const [current, setCurrent] = useState(0);
  const banner = spaceBanners[current];

  return (
    <section className="py-12 md:py-16 bg-background-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="bg-background-100 rounded-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/2 aspect-[4/3] lg:aspect-auto">
              <img
                alt={banner.title}
                className="w-full h-full object-cover"
                src={banner.image}
              />
            </div>
            <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <p className="text-sm text-foreground-500 mb-2">{banner.subtitle}</p>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground-950 mb-4">{banner.title}</h3>
              <p className="text-foreground-600 mb-6 leading-relaxed whitespace-pre-line">
                {banner.description}
              </p>
              <div className="flex items-center gap-4">
                <a
                  href={banner.link}
                  className="inline-flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded text-sm font-medium hover:bg-primary-600 transition-colors whitespace-nowrap"
                >
                  <i className="ri-calendar-line"></i>자세히보기
                </a>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrent((prev) => (prev - 1 + spaceBanners.length) % spaceBanners.length)}
                    className="w-10 h-10 border border-background-300 rounded-full flex items-center justify-center hover:bg-background-100 transition-colors cursor-pointer"
                  >
                    <i className="ri-arrow-left-s-line text-lg text-foreground-600"></i>
                  </button>
                  <button
                    onClick={() => setCurrent((prev) => (prev + 1) % spaceBanners.length)}
                    className="w-10 h-10 border border-background-300 rounded-full flex items-center justify-center hover:bg-background-100 transition-colors cursor-pointer"
                  >
                    <i className="ri-arrow-right-s-line text-lg text-foreground-600"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}