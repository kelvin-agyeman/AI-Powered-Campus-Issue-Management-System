import type { User } from "./user.types";

// Payload Types
export interface CreateAdminType {
  fullName: string;
  email: string;
  institutionId: string;
  password?: string;
}

export interface CreateStaffType extends CreateAdminType {
  department: string;
}

export interface UpdateUserType {
  fullName?: string;
  email?: string;
  department?: string;
  isActive?: boolean;
}

export interface FilterUsersQuery {
  role?: string;
  isActive?: string | boolean;
  department?: string;
  search?: string;
}

export interface FilterEditRequestsQuery {
  status?: "pending" | "approved" | "rejected";
}

export interface BroadcastAnnouncementType {
  targetAudience: string; // "all" | "students" | "staff" | "admins"
  title: string;
  message: string;
  priority?: string;
}

// Response Types
export interface EditRequest {
  _id: string;
  requestedBy: {
    _id: string;
    fullName: string;
    email: string;
    institutionId: string;
  };
  newInstitutionId: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface EditRequestsResponse {
  message?: string;
  requests: EditRequest[];
}

export interface UsersListResponse {
  message?: string;
  users: User[];
}

export interface SuperAdminAnalytics {
  users: {
    students: number;
    staff: number;
    admins: number;
    total: number;
  };
  issues: {
    open: number;
    resolved: number;
    total: number;
  };
  requests: {
    pendingEdits: number;
  };
}

export interface SuperAdminDashboardResponse {
  message?: string;
  analytics: SuperAdminAnalytics;
}
