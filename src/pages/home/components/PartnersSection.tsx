import { useState } from "react";
import { partners } from "@/mocks/home";
import { realPartners } from "@/mocks/real-assets";

// 실제 여수시 로고를 앞에 배치
const partnerList = [...realPartners, ...partners];

export default function PartnersSection() {
  const [start, setStart] = useState(0);
  const visible = 5;

  const prev = () => {
    if (start > 0) setStart(start - 1);
  };

  const next = () => {
    if (start + visible < partnerList.length) setStart(start + 1);
  };

  return (
    <section className="py-12 md:py-16 bg-background-100 border-t border-background-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="relative flex items-center gap-4">
          <button
            onClick={prev}
            disabled={start === 0}
            className="flex-shrink-0 w-10 h-10 border border-background-200 rounded-full flex items-center justify-center bg-white hover:bg-background-100 disabled:opacity-30 cursor-pointer"
          >
            <i className="ri-arrow-left-s-line text-lg text-foreground-600"></i>
          </button>
          <div className="flex-1 grid grid-cols-3 sm:grid-cols-5 gap-4">
            {partnerList.slice(start, start + visible).map((partner) => (
              <a
                key={partner.id}
                href={partner.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-white border border-background-200 rounded-lg p-3 h-28 md:h-32 hover:shadow-sm transition-shadow"
              >
                <img
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain"
                  src={partner.image}
                />
              </a>
            ))}
          </div>
          <button
            onClick={next}
            disabled={start + visible >= partnerList.length}
            className="flex-shrink-0 w-10 h-10 border border-background-200 rounded-full flex items-center justify-center bg-white hover:bg-background-100 disabled:opacity-30 cursor-pointer"
          >
            <i className="ri-arrow-right-s-line text-lg text-foreground-600"></i>
          </button>
        </div>
      </div>
    </section>
  );
}