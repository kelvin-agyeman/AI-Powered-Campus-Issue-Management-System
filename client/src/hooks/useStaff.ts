import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAssignedIssues,
  getAssignedIssueById,
  acceptAssignment,
  updateProgress,
  resolveIssue,
  reopenIssue,
} from "../services/staff.service";
import type { ApiErrorResponse } from "../types/user.types";
import { AxiosError } from "axios";
import { toast } from "sonner";

// --- QUERIES ---

export const useAssignedIssues = (filters?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ["staff-issues", filters],
    queryFn: () => getAssignedIssues(filters),
  });
};

export const useAssignedIssueDetail = (id: string) => {
  return useQuery({
    queryKey: ["staff-issue", id],
    queryFn: () => getAssignedIssueById(id),
    enabled: !!id,
  });
};

// --- MUTATIONS ---

export const useAcceptAssignment = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, string>({
    mutationFn: acceptAssignment,
    onSuccess: (_, variables) => {
      toast.success("Assignment accepted successfully.");
      queryClient.invalidateQueries({ queryKey: ["staff-issues"] });
      queryClient.invalidateQueries({ queryKey: ["staff-issue", variables] });
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.msg ??
          error.response?.data?.message ??
          "Failed to accept assignment.",
      );
    },
  });
};

export const useUpdateProgress = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    { id: string; data: { note: string; status?: string } }
  >({
    mutationFn: ({ id, data }) => updateProgress(id, data),
    onSuccess: (_, variables) => {
      toast.success("Progress updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["staff-issues"] });
      queryClient.invalidateQueries({
        queryKey: ["staff-issue", variables.id],
      });
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.msg ??
          error.response?.data?.message ??
          "Failed to update progress.",
      );
    },
  });
};

export const useResolveIssue = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    { id: string; data: FormData }
  >({
    mutationFn: ({ id, data }) => resolveIssue(id, data),
    onSuccess: (_, variables) => {
      toast.success("Issue resolved successfully.");
      queryClient.invalidateQueries({ queryKey: ["staff-issues"] });
      queryClient.invalidateQueries({
        queryKey: ["staff-issue", variables.id],
      });
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.msg ??
          error.response?.data?.message ??
          "Failed to resolve issue.",
      );
    },
  });
};

export const useReopenIssue = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, string>({
    mutationFn: reopenIssue,
    onSuccess: (_, variables) => {
      toast.success("Task reopened successfully.");
      queryClient.invalidateQueries({ queryKey: ["staff-issues"] });
      queryClient.invalidateQueries({ queryKey: ["staff-issue", variables] });
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.msg ??
          error.response?.data?.message ??
          "Failed to reopen task.",
      );
    },
  });
};
