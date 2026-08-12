import { useState } from "react";
import { Link } from "react-router-dom";
import { rentalTabs, rentalDates, rentalItems } from "@/mocks/home";

export default function RentalSection() {
  const [activeTab, setActiveTab] = useState("시민회관");
  const [activeDate, setActiveDate] = useState("08");

  return (
    <section className="py-12 md:py-16 bg-background-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground-950 text-center mb-8">대관현황</h2>
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {rentalTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 text-sm border rounded transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === tab
                  ? "bg-primary-500 text-white border-primary-500"
                  : "bg-white text-foreground-600 border-background-300 hover:border-primary-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="bg-white rounded-lg p-6 border border-background-200">
          <div className="flex items-center gap-4 mb-4">
            <h3 className="text-xl font-bold text-foreground-950">2026.06</h3>
            <div className="flex-1 overflow-x-auto">
              <div className="flex gap-1 min-w-max">
                {rentalDates.map((date) => (
                  <button
                    key={date.day}
                    onClick={() => setActiveDate(date.day)}
                    className={`flex flex-col items-center px-2 py-2 rounded min-w-[44px] transition-colors cursor-pointer ${
                      activeDate === date.day
                        ? "bg-primary-500 text-white"
                        : "bg-white text-foreground-600 hover:bg-background-100"
                    }`}
                  >
                    <span className="text-[10px] uppercase">{date.week}</span>
                    <span className="text-sm font-bold">{date.day}</span>
                  </button>
                ))}
              </div>
            </div>
            <Link
              to="/rent/status"
              className="flex-shrink-0 bg-primary-500 text-white px-5 py-2 rounded text-sm hover:bg-primary-600 transition-colors whitespace-nowrap"
            >
              전체보기
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rentalItems.map((item) => (
              <div
                key={item.id}
                className="border border-background-200 rounded-lg p-5 hover:border-primary-500 hover:shadow-md transition-all cursor-pointer"
              >
                <h4 className="text-base font-bold text-foreground-800 mb-2">{item.title}</h4>
                <p className="text-sm text-foreground-500 mb-1">{item.place}</p>
                <p className="text-sm text-foreground-500 mb-2">{item.time}</p>
                <p className="text-sm text-foreground-500">주최 : {item.host}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}