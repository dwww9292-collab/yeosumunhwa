export const BOARDS = ["notice", "news", "archive", "data"] as const;
export type BoardKey = (typeof BOARDS)[number];

export const BOARD_LABEL: Record<BoardKey, string> = {
  notice: "공지사항",
  news: "보도자료",
  archive: "재단소식",
  data: "자료실",
};

export const BOARD_PATH: Record<BoardKey, string> = {
  notice: "/community/notice",
  news: "/community/news",
  archive: "/community/archive",
  data: "/community/data",
};

/** 재단소식(archive) 갤러리 구분 */
export type MediaType = "video" | "photo";

export interface Attachment {
  name: string;
  /** 아직 파일을 올리지 않은 이관 데이터는 null */
  url: string | null;
  /** 확장자 배지(PDF/HWP/XLSX/ZIP ...) */
  ext: string;
}

export interface PostRow {
  id: string;
  board: BoardKey;
  title: string;
  body: string | null;
  image_url: string | null;
  media_type: MediaType | null;
  media_url: string | null;
  attachments: Attachment[];
  is_pinned: boolean;
  is_published: boolean;
  /** 개인정보 패턴 검사 예외 처리 여부 (담당자 연락처 등 의도적 포함 시) */
  pii_reviewed: boolean;
  view_count: number;
  published_at: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface PostInput {
  board: BoardKey;
  title: string;
  body: string | null;
  image_url: string | null;
  media_type: MediaType | null;
  media_url: string | null;
  attachments: Attachment[];
  is_pinned: boolean;
  is_published: boolean;
  pii_reviewed: boolean;
  published_at: string;
}

/** 첨부파일 이름에서 확장자 배지 텍스트를 뽑는다 */
export function extOf(fileName: string): string {
  const ext = fileName.split(".").pop() ?? "";
  return ext.toUpperCase().slice(0, 5) || "FILE";
}
