import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCurrentUser,
  updateUser,
  updateEmail,
  verifyUpdatedEmail,
  resendVerificationEmail,
  sendEditDetailsRequest,
  deleteAvatar,
} from "../services/user.service";
import type {
  ApiErrorResponse,
  UpdateEmailPayload,
  VerifyUpdatedEmailPayload,
  SendEditDetailsRequestPayload,
} from "../types/user.types";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
  });
};

export const useUpdateUser = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, FormData>({
    mutationFn: updateUser,
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.msg ??
          error.response?.data?.message ??
          "Failed to update profile.",
      );
    },
  });
};

export const useUpdateEmail = (onSuccessCallback?: () => void) => {
  return useMutation<unknown, AxiosError<ApiErrorResponse>, UpdateEmailPayload>(
    {
      mutationFn: updateEmail,
      onSuccess: () => {
        toast.success("Verification email sent to your new address.");
        if (onSuccessCallback) onSuccessCallback();
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.msg ??
            error.response?.data?.message ??
            "Failed to update email.",
        );
      },
    },
  );
};

export const useVerifyUpdatedEmail = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    VerifyUpdatedEmailPayload
  >({
    mutationFn: verifyUpdatedEmail,
    onSuccess: () => {
      toast.success("Email verified and updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.msg ??
          error.response?.data?.message ??
          "Failed to verify email.",
      );
    },
  });
};

export const useResendVerificationEmail = () => {
  return useMutation<unknown, AxiosError<ApiErrorResponse>, UpdateEmailPayload>(
    {
      mutationFn: resendVerificationEmail,
      onSuccess: () => {
        toast.success("Verification email resent.");
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.msg ??
            error.response?.data?.message ??
            "Failed to resend verification email.",
        );
      },
    },
  );
};

export const useSendEditDetailsRequest = (onSuccessCallback?: () => void) => {
  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    SendEditDetailsRequestPayload
  >({
    mutationFn: sendEditDetailsRequest,
    onSuccess: () => {
      toast.success("ID change request submitted successfully.");
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.msg ??
          error.response?.data?.message ??
          "Failed to submit ID change request.",
      );
    },
  });
};

export const useDeleteAvatar = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, void>({
    mutationFn: deleteAvatar,
    onSuccess: () => {
      toast.success("Avatar deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.msg ??
          error.response?.data?.message ??
          "Failed to delete avatar.",
      );
    },
  });
};
