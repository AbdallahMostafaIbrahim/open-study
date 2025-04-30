export type Role = "admin" | "professor" | "student";

export interface SignedUrlResponse {
  uploadUrl: string;
  fileKey: string;
}
