export const RENTAL_SPACES = [
  "시민회관",
  "양주사랑행복센터",
  "양주우정행복센터",
  "양주아트홀",
] as const;

export type RentalSpace = (typeof RENTAL_SPACES)[number];
export type RentalStatus = "pending" | "approved" | "rejected";

export const STATUS_LABEL: Record<RentalStatus, string> = {
  pending: "검토중",
  approved: "승인",
  rejected: "거절",
};

export interface RentalApplication {
  id: string;
  user_id: string;
  space: string;
  applicant_name: string;
  phone: string | null;
  email: string | null;
  org: string | null;
  use_date_from: string;
  use_date_to: string | null;
  purpose: string | null;
  headcount: number | null;
  memo: string | null;
  status: RentalStatus;
  admin_memo: string | null;
  reviewed_by: string | null;
  created_at: string;
}

export interface RentalInput {
  space: string;
  applicant_name: string;
  phone: string | null;
  email: string | null;
  org: string | null;
  use_date_from: string;
  use_date_to: string | null;
  purpose: string | null;
  headcount: number | null;
  memo: string | null;
}
