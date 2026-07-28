import type { Issue } from "./issue.types";
export type { Issue };

export interface GetIssuesResponse {
  success?: boolean;
  issues: Issue[];
}

export interface SingleIssueResponse {
  success?: boolean;
  message?: string;
  issue: Issue;
}

export interface DeleteIssueResponse {
  success?: boolean;
  message?: string;
}

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface ApiErrorResponse {
  msg?: string;
  message?: string;
}

export interface GetNotificationsResponse {
  success: boolean;
  message: string;
  data: {
    notifications: Notification[];
  };
}

export interface UpdateIssuePayload {
  id: string;
  formData: FormData;
}

export interface StudentUser {
  _id: string;
  fullName: string;
  email: string;
  institutionId: string;
  role: "student" | "staff" | "admin" | "super_admin";
  isVerified?: boolean;
}
