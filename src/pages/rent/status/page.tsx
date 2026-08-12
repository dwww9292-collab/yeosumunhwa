import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SubPageLayout from "@/components/feature/SubPageLayout";
import { fetchApprovedBookings, type PublicBooking } from "@/features/rentals/api";

function ymd(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** 캘린더 한 칸에 표시되는 일정 */
interface DayEntry {
  title: string;
  hall: string | null;
  isClosed: boolean;
}

const rentTabs = [
  { label: "대관현황", href: "/rent/status" },
  { label: "대관신청", href: "/rent/apply" },
  { label: "공간소개", href: "/rent/space" },
];

const venues = ["시민회관", "여수사랑행복센터", "여수우정행복센터", "여수아트홀"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month - 1, 1).getDay();
}

export default function RentStatusPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [selectedVenue, setSelectedVenue] = useState(venues[0]);
  const [bookings, setBookings] = useState<PublicBooking[]>([]);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    fetchApprovedBookings()
      .then(setBookings)
      .catch(() => setLoadError(true));
  }, []);

  // 선택 시설의 일정을 'YYYY-MM-DD' → 항목 목록 으로 펼친다(기간 신청 포함)
  const bookingsByDate = useMemo(() => {
    const map = new Map<string, DayEntry[]>();
    for (const b of bookings) {
      if (b.space !== selectedVenue) continue;
      const from = new Date(`${b.use_date_from}T00:00:00`);
      const to = new Date(`${(b.use_date_to ?? b.use_date_from)}T00:00:00`);
      for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
        const key = ymd(d.getFullYear(), d.getMonth() + 1, d.getDate());
        const list = map.get(key) ?? [];
        list.push({ title: b.title, hall: b.hall, isClosed: b.is_closed });
        map.set(key, list);
      }
    }
    return map;
  }, [bookings, selectedVenue]);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const getEventsForDay = (day: number): DayEntry[] => bookingsByDate.get(ymd(year, month, day)) ?? [];

  const prevMonth = () => {
    if (month === 1) { setYear(year - 1); setMonth(12); }
    else setMonth(month - 1);
  };
  const nextMonth = () => {
    if (month === 12) { setYear(year + 1); setMonth(1); }
    else setMonth(month + 1);
  };

  // Build calendar grid
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length < totalCells) cells.push(null);

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  const dayLabels = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

  return (
    <SubPageLayout
      categoryLabel="대관안내"
      categoryPath="/rent/status"
      currentLabel="대관현황"
      tabs={rentTabs}
    >
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">대관현황</h2>

      {/* Venue Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {venues.map((v) => (
          <button
            key={v}
            onClick={() => setSelectedVenue(v)}
            className={`px-6 py-2 border rounded text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
              selectedVenue === v
                ? "bg-[#1a4fa0] border-[#1a4fa0] text-white"
                : "border-gray-300 text-gray-600 bg-white hover:bg-gray-50"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {/* 대관신청 버튼 */}
      <div className="flex justify-center mb-8">
        <Link
          to="/rent/apply"
          className="flex items-center gap-2 bg-[#1a4fa0] text-white px-8 py-3 rounded text-sm font-medium hover:bg-[#163e85] transition-colors cursor-pointer"
        >
          <i className="ri-calendar-check-line"></i>대관신청
        </Link>
      </div>

      {/* Month/Year Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={prevMonth}
            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 cursor-pointer"
          >
            <i className="ri-arrow-left-s-line"></i>
          </button>
          <div className="flex items-center gap-1 text-lg font-bold text-gray-800">
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="border-none bg-transparent text-lg font-bold focus:outline-none cursor-pointer"
            >
              {[2024, 2025, 2026, 2027].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <span>년</span>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="border-none bg-transparent text-lg font-bold focus:outline-none cursor-pointer ml-1"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>{String(m).padStart(2, "0")}</option>
              ))}
            </select>
            <span>월</span>
          </div>
          <button
            onClick={nextMonth}
            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 cursor-pointer"
          >
            <i className="ri-arrow-right-s-line"></i>
          </button>
        </div>
        <span className="text-xs text-gray-400">승인된 대관 신청과 재단 운영 일정이 표시됩니다.</span>
      </div>

      {/* Calendar Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[700px]">
          <thead>
            <tr>
              {dayLabels.map((d, i) => (
                <th
                  key={d}
                  className={`py-3 text-sm font-medium border-b border-gray-200 ${
                    i === 0 ? "text-red-500" : i === 6 ? "text-[#1a4fa0]" : "text-gray-700"
                  }`}
                >
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, wi) => (
              <tr key={wi}>
                {week.map((day, di) => {
                  const isToday =
                    day === today.getDate() &&
                    month === today.getMonth() + 1 &&
                    year === today.getFullYear();
                  const isSun = di === 0;
                  const isSat = di === 6;
                  const events = day ? getEventsForDay(day) : [];

                  return (
                    <td
                      key={di}
                      className={`align-top border border-gray-100 p-1 min-h-[90px] ${
                        isSun ? "bg-red-50/30" : isSat ? "bg-sky-50/30" : ""
                      }`}
                    >
                      {day && (
                        <>
                          <div className={`text-sm font-medium mb-1 px-1 ${
                            isSun ? "text-red-500" : isSat ? "text-[#1a4fa0]" : "text-gray-700"
                          }`}>
                            {isToday ? (
                              <span className="inline-flex items-center gap-1">
                                <span className="text-xs text-[#1a4fa0] font-bold">오늘</span> {day}
                              </span>
                            ) : day}
                          </div>
                          <ul className="space-y-0.5">
                            {events.map((entry, ei) => (
                              <li key={ei}>
                                <span
                                  className={`block text-xs px-1 py-0.5 leading-tight truncate border-l-2 ${
                                    entry.isClosed
                                      ? "text-red-600 bg-red-50 border-red-300"
                                      : "text-gray-600 bg-[#1a4fa0]/5 border-[#1a4fa0]/50"
                                  }`}
                                  title={entry.hall ? `[${entry.hall}] ${entry.title}` : entry.title}
                                >
                                  {entry.hall && (
                                    <span className="text-gray-400">[{entry.hall}] </span>
                                  )}
                                  {entry.title}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {loadError ? (
        <p className="mt-4 text-center text-xs text-gray-400">
          대관현황 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
        </p>
      ) : (
        bookingsByDate.size === 0 && (
          <p className="mt-4 text-center text-xs text-gray-400">
            {selectedVenue}의 등록된 일정이 아직 없습니다.
          </p>
        )
      )}

      {/* Contact Info */}
      <div className="mt-8 bg-gray-50 rounded-lg p-5">
        <dl>
          <dt className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <i className="ri-team-line"></i>담당부서 : 공연전시팀
          </dt>
          {/* TODO: 재단 확정 연락처 확보 후 입력. 기존 값은 경기(031) 지역번호였다. */}
          <dd className="text-sm text-gray-600 flex items-center gap-2">
            <i className="ri-phone-line"></i>
            문의전화 : [확인필요]
          </dd>
        </dl>
      </div>
    </SubPageLayout>
  );
}