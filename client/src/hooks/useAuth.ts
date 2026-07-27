import { useMutation } from "@tanstack/react-query";
import {
  registerUser,
  loginUser,
  verifyEmail,
  resendVerificationEmail,
  logoutUser,
  forgotPassword,
  resetPassword,
} from "../services/auth.service";
import type {
  LoginResponse,
  RegisterStudentPayload,
  LoginUserPayload,
  ApiErrorResponse,
  VerifyEmailPayload,
  ResendEmailPayload,
  ResendVerificationEmailResponse,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  ForgotPasswordResponse,
  ResetPasswordResponse,
} from "../types/auth.types";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useRegister = () => {
  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    RegisterStudentPayload
  >({
    mutationFn: registerUser,
  });
};

export const useLogin = () => {
  return useMutation<
    LoginResponse,
    AxiosError<ApiErrorResponse>,
    LoginUserPayload
  >({
    mutationFn: loginUser,
  });
};

export const useVerifyEmail = () => {
  return useMutation<unknown, AxiosError<ApiErrorResponse>, VerifyEmailPayload>(
    {
      mutationFn: verifyEmail,
    },
  );
};

export const useResendVerificationEmail = () => {
  return useMutation<
    ResendVerificationEmailResponse,
    AxiosError<ApiErrorResponse>,
    ResendEmailPayload
  >({
    mutationFn: resendVerificationEmail,
    onSuccess: (data) => {
      toast.success(data.message || "Verification email sent!");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.msg ??
          error.response?.data?.message ??
          "Failed to resend email.",
      );
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      toast.success("Logged out successfully");
      navigate("/login");
    },
    onError: () => {
      toast.error("An error occurred during logout.");
      navigate("/login");
    },
  });
};

export const useForgotPassword = () => {
  return useMutation<
    ForgotPasswordResponse,
    AxiosError<ApiErrorResponse>,
    ForgotPasswordPayload
  >({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      toast.success(data.message || "Reset link sent to your email.");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.msg ??
          error.response?.data?.message ??
          "Failed to send reset link.",
      );
    },
  });
};

export const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation<
    ResetPasswordResponse,
    AxiosError<ApiErrorResponse>,
    ResetPasswordPayload
  >({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      toast.success(data.message || "Password reset successfully!");
      navigate("/login");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.msg ??
          error.response?.data?.message ??
          "Failed to reset password.",
      );
    },
  });
};
