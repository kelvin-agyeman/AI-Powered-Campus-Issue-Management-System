export interface AiRecommendation {
  title: string;
  category?: string;
  priority?: string;
}

export interface Issue {
  _id: string;
  description: string;
  location: string;
  status:
    | "pending_admin_review"
    | "in_progress"
    | "assigned"
    | "resolved"
    | "approved"
    | "rejected";
  createdAt: string;
  aiRecommendation?: AiRecommendation;
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

export interface GetIssuesResponse {
  issues: Issue[];
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
