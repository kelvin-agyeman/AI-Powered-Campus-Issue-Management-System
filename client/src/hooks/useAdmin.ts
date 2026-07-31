import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPendingIssues,
  getAllIssues,
  getIssueById,
  approveIssue,
  modifyIssue,
  rejectIssue,
  assignIssue,
  getIssueDuplicates,
  getStaffByDepartment,
  getIssueProgress,
} from "../services/admin.service";
import type { ApiErrorResponse } from "../types/user.types";
import { AxiosError } from "axios";
import { toast } from "sonner";

// --- QUERIES ---

export const usePendingIssues = () => {
  return useQuery({
    queryKey: ["admin-pending-issues"],
    queryFn: getPendingIssues,
  });
};

export const useAllIssues = (filters?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ["admin-all-issues", filters],
    queryFn: () => getAllIssues(filters),
  });
};

export const useIssueDetails = (id: string) => {
  return useQuery({
    queryKey: ["admin-issue", id],
    queryFn: () => getIssueById(id),
    enabled: !!id,
  });
};

// --- MUTATIONS ---

export const useApproveIssue = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, string>({
    mutationFn: approveIssue,
    onSuccess: (_, variables) => {
      toast.success("Issue approved successfully.");
      queryClient.invalidateQueries({ queryKey: ["admin-pending-issues"] });
      queryClient.invalidateQueries({ queryKey: ["admin-issue", variables] });
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.msg ??
          error.response?.data?.message ??
          "Failed to approve issue.",
      );
    },
  });
};

export const useModifyIssue = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    {
      id: string;
      data: { category: string; priority: string; department: string };
    }
  >({
    mutationFn: ({ id, data }) => modifyIssue(id, data),
    onSuccess: (_, variables) => {
      toast.success("Issue modified and approved successfully.");
      queryClient.invalidateQueries({ queryKey: ["admin-pending-issues"] });
      queryClient.invalidateQueries({
        queryKey: ["admin-issue", variables.id],
      });
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.msg ??
          error.response?.data?.message ??
          "Failed to modify issue.",
      );
    },
  });
};

export const useRejectIssue = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    { id: string; data: { reason: string } }
  >({
    mutationFn: ({ id, data }) => rejectIssue(id, data),
    onSuccess: (_, variables) => {
      toast.success("Issue rejected successfully.");
      queryClient.invalidateQueries({ queryKey: ["admin-pending-issues"] });
      queryClient.invalidateQueries({
        queryKey: ["admin-issue", variables.id],
      });
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.msg ??
          error.response?.data?.message ??
          "Failed to reject issue.",
      );
    },
  });
};

export const useAssignIssue = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    { id: string; data: { staffId: string } }
  >({
    mutationFn: ({ id, data }) => assignIssue(id, data),
    onSuccess: (_, variables) => {
      toast.success("Issue assigned successfully.");
      queryClient.invalidateQueries({
        queryKey: ["admin-issue", variables.id],
      });
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.msg ??
          error.response?.data?.message ??
          "Failed to assign issue.",
      );
    },
  });
};

export const useIssueDuplicates = (id?: string) => {
  return useQuery({
    queryKey: ["issue-duplicates", id],
    queryFn: () => getIssueDuplicates(id!),
  });
};

export const useStaffByDepartment = (department?: string) => {
  return useQuery({
    queryKey: ["staff", department],
    queryFn: () => getStaffByDepartment(department!),
    enabled: !!department,
  });
};

export const useIssueProgress = (id: string) => {
  return useQuery({
    queryKey: ["admin-issue-progress", id],
    queryFn: () => getIssueProgress(id),
    enabled: !!id,
  });
};
