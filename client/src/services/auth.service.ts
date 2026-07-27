import customFetch from "../utils/customFetch";
import type {
  RegisterStudentPayload,
  LoginUserPayload,
  LoginResponse,
  VerifyEmailPayload,
  ResendEmailPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from "../types/auth.types";

export const registerUser = async (data: RegisterStudentPayload) => {
  const response = await customFetch.post("/auth/register", data);
  return response.data;
};

export const loginUser = async (
  data: LoginUserPayload,
): Promise<LoginResponse> => {
  const response = await customFetch.post("/auth/login", data);
  return response.data;
};

export const verifyEmail = async (data: VerifyEmailPayload) => {
  const response = await customFetch.post("/auth/verify-email", data);
  return response.data;
};

export const resendVerificationEmail = async (data: ResendEmailPayload) => {
  const response = await customFetch.post(
    "/auth/resend-verification-email",
    data,
  );
  return response.data;
};

export const logoutUser = async () => {
  // Assuming your backend uses a GET or POST request to clear the httpOnly cookie
  const response = await customFetch.delete("/auth/logout");
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await customFetch.get("/user/current");
  return response.data; // Ensure this returns { status, data: user } based on your backend
};

export const forgotPassword = async (payload: ForgotPasswordPayload) => {
  const response = await customFetch.post("/auth/forgot-password", payload);
  return response.data;
};

export const resetPassword = async (payload: ResetPasswordPayload) => {
  const response = await customFetch.post("/auth/reset-password", payload);
  return response.data;
};
