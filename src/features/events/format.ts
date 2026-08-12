import type { EventRow, EventDisplayItem } from "./types";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

const FALLBACK_IMAGE =
  "https://placehold.co/800x600/e5e7eb/9ca3af?text=No+Image";

function formatDate(d: string): string {
  const dt = new Date(`${d}T00:00:00`);
  if (Number.isNaN(dt.getTime())) return d;
  return `${d}(${WEEKDAYS[dt.getDay()]})`;
}

export function formatDateRange(start: string | null, end: string | null): string {
  if (!start) return "";
  if (!end || end === start) return formatDate(start);
  return `${formatDate(start)} ~ ${formatDate(end)}`;
}

/** 종료일이 오늘 이전이면 '종료', 아니면 '진행중' */
export function deriveStatus(end: string | null): "진행중" | "종료" {
  if (!end) return "진행중";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(`${end}T00:00:00`) < today ? "종료" : "진행중";
}

export function toDisplayItem(row: EventRow): EventDisplayItem {
  return {
    id: row.id,
    title: row.title,
    image: row.image_url || FALLBACK_IMAGE,
    tag: row.tag,
    status: deriveStatus(row.end_date),
    location: row.location ?? "",
    dateRange: formatDateRange(row.start_date, row.end_date),
  };
}
