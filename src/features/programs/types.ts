export const PROGRAM_CATEGORIES = ["교육", "지원사업", "행사", "공연", "기타"] as const;
export const PROGRAM_STATUSES = ["진행중", "예정", "종료"] as const;

export type ProgramCategory = (typeof PROGRAM_CATEGORIES)[number];
export type ProgramStatus = (typeof PROGRAM_STATUSES)[number];

export interface Attachment {
  name: string;
  url: string;
}

export interface ProgramRow {
  id: string;
  title: string;
  category: string;
  status: string;
  image_url: string | null;
  location: string | null;
  date_range: string | null;
  body: string | null;
  contact: string | null;
  attachments: Attachment[];
  is_published: boolean;
  sort_order: number;
  created_at: string;
}

export interface ProgramInput {
  title: string;
  category: ProgramCategory;
  status: ProgramStatus;
  image_url: string | null;
  location: string | null;
  date_range: string | null;
  body: string | null;
  contact: string | null;
  attachments: Attachment[];
  is_published: boolean;
}
