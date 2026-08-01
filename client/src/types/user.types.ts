export interface ApiErrorResponse {
  msg?: string;
  message?: string;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: "student" | "staff" | "admin" | "super_admin";
  institutionId?: string;
  department?: string;
  avatar?: string;
  isVerified: boolean;
  isActive: boolean;
}

export interface PopulatedUser {
  _id: string;
  fullName: string;
  email: string;
  institutionId: string;
  avatar?: string;
}

export interface StudentUser extends User {
  role: "student";
}

export interface AdminUser extends User {
  role: "admin";
}

export interface StaffUser extends User {
  role: "staff";
}

export interface GetCurrentUserResponse {
  user: User;
}

export interface UpdateEmailPayload {
  newEmail: string;
}

export interface VerifyUpdatedEmailPayload {
  newEmail: string;
  newVerificationToken: string;
}

export interface SendEditDetailsRequestPayload {
  newInstitutionId: string;
  reason: string;
}
