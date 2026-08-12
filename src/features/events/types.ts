export type EventType = "performance" | "exhibition" | "festival";
export type EventTag = "기획" | "대관";

export interface EventRow {
  id: string;
  type: EventType;
  title: string;
  image_url: string | null;
  tag: EventTag;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  body: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
}

export interface EventInput {
  type: EventType;
  title: string;
  image_url: string | null;
  tag: EventTag;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  body: string | null;
  is_published: boolean;
}

/** 공개 페이지(카드)에서 쓰는 표시용 형태 — 기존 mock 데이터와 호환 */
export interface EventDisplayItem {
  id: string;
  title: string;
  image: string;
  tag: EventTag;
  status: "진행중" | "종료";
  location: string;
  dateRange: string;
}
