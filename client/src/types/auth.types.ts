export interface ApiErrorResponse {
  msg: string;
  message: string;
  errors?: { field: string; message: string }[];
}

export interface RegisterStudentPayload {
  fullName: string;
  institutionId: string;
  email: string;
  password?: string;
  confirmPassword?: string;
}

export interface LoginUserPayload {
  institutionId: string;
  password?: string;
}

export interface User {
  _id: string;
  fullName: string;
  role: "student" | "staff" | "admin" | "super_admin";
  department?: string;
}

export interface LoginResponse {
  user: User;
}

export interface VerifyEmailPayload {
  email: string;
  verificationToken: string;
}

export interface ResendEmailPayload {
  email: string;
}

export interface ResendVerificationEmailResponse {
  status: number;
  message: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  password: string;
  email: string;
  resetPasswordToken: string;
}

export interface ForgotPasswordResponse {
  status: number;
  message: string;
}

export interface ResetPasswordResponse {
  status: number;
  message: string;
}
