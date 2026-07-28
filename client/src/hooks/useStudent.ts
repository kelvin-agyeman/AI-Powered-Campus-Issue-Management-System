import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getStudentIssues,
  createIssue,
  updateIssue,
  deleteIssue,
  getStudentNotifications,
  markAllNotificationsRead,
} from "../services/student.service";
import type {
  ApiErrorResponse,
  UpdateIssuePayload,
  GetIssuesResponse,
  SingleIssueResponse,
  DeleteIssueResponse,
  GetNotificationsResponse,
} from "../types/student.types";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// --- ISSUES HOOKS ---

export const useStudentIssues = () => {
  return useQuery<GetIssuesResponse, AxiosError<ApiErrorResponse>>({
    queryKey: ["student-issues"],
    queryFn: getStudentIssues,
  });
};

export const useCreateIssue = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<
    SingleIssueResponse,
    AxiosError<ApiErrorResponse>,
    FormData
  >({
    mutationFn: createIssue,
    onSuccess: () => {
      toast.success("Issue reported successfully!");
      queryClient.invalidateQueries({ queryKey: ["student-issues"] });
      navigate("/student/reports");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.msg ??
          error.response?.data?.message ??
          "Failed to submit report.",
      );
    },
  });
};

export const useUpdateIssue = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<
    SingleIssueResponse,
    AxiosError<ApiErrorResponse>,
    UpdateIssuePayload
  >({
    mutationFn: ({ id, formData }) => updateIssue(id, formData),
    onSuccess: () => {
      toast.success("Issue updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["student-issues"] });
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.msg ??
          error.response?.data?.message ??
          "Failed to update issue.",
      );
    },
  });
};

export const useDeleteIssue = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<DeleteIssueResponse, AxiosError<ApiErrorResponse>, string>(
    {
      mutationFn: deleteIssue,
      onSuccess: () => {
        toast.success("Issue deleted successfully!");
        queryClient.invalidateQueries({ queryKey: ["student-issues"] });
        if (onSuccessCallback) onSuccessCallback();
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.msg ??
            error.response?.data?.message ??
            "Failed to delete issue.",
        );
      },
    },
  );
};

// --- NOTIFICATIONS HOOKS ---

export const useStudentNotifications = () => {
  return useQuery<GetNotificationsResponse, AxiosError<ApiErrorResponse>>({
    queryKey: ["student-notifications"],
    queryFn: getStudentNotifications,
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ApiErrorResponse>, void>({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      toast.success("All notifications marked as read.");
      queryClient.invalidateQueries({ queryKey: ["student-notifications"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.msg ??
          error.response?.data?.message ??
          "Failed to update notifications.",
      );
    },
  });
};
