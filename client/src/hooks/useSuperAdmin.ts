import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import type { ApiErrorResponse } from "../types/user.types";
import * as superAdminService from "../services/superAdmin.service";
import type {
  FilterUsersQuery,
  FilterEditRequestsQuery,
  CreateAdminType,
  CreateStaffType,
  BroadcastAnnouncementType,
} from "../types/superAdmin.types";

// --- QUERIES ---

export const useAllUsers = (filters?: FilterUsersQuery) => {
  return useQuery({
    queryKey: ["super-admin-users", filters],
    queryFn: () => superAdminService.getAllUsers(filters),
  });
};

export const useEditRequests = (filters?: FilterEditRequestsQuery) => {
  return useQuery({
    queryKey: ["super-admin-edit-requests", filters],
    queryFn: () => superAdminService.getEditRequests(filters),
  });
};

export const useSuperAdminDashboardAnalytics = () => {
  return useQuery({
    queryKey: ["super-admin-dashboard"],
    queryFn: superAdminService.getSuperAdminDashboard,
  });
};

// --- MUTATIONS ---

export const useRegisterUser = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    { type: "admin" | "staff"; data: CreateAdminType | CreateStaffType }
  >({
    mutationFn: ({ type, data }) => {
      if (type === "admin") {
        return superAdminService.registerAdmin(data as CreateAdminType);
      }
      return superAdminService.registerStaff(data as CreateStaffType);
    },
    onSuccess: () => {
      toast.success("User registered successfully.");
      queryClient.invalidateQueries({ queryKey: ["super-admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["super-admin-dashboard"] });
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.msg ||
          "Failed to register user.",
      );
    },
  });
};

export const useUpdateUser = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    { id: string; data: Partial<CreateAdminType | CreateStaffType> }
  >({
    mutationFn: ({ id, data }) => superAdminService.updateUser(id, data),
    onSuccess: () => {
      toast.success("User updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["super-admin-users"] });
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.msg ||
          "Failed to update user details.",
      );
    },
  });
};

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    { id: string; activate: boolean }
  >({
    mutationFn: ({ id, activate }) =>
      activate
        ? superAdminService.reactivateUser(id)
        : superAdminService.deactivateUser(id),
    onSuccess: (_, variables) => {
      toast.success(
        `User ${variables.activate ? "reactivated" : "deactivated"} successfully.`,
      );
      queryClient.invalidateQueries({ queryKey: ["super-admin-users"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.msg ||
          "Failed to update user status.",
      );
    },
  });
};

export const useProcessEditRequest = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    { action: "approve" | "reject"; id: string; reason?: string }
  >({
    mutationFn: ({ action, id, reason }) => {
      if (action === "approve") return superAdminService.approveEditRequest(id);
      return superAdminService.rejectEditRequest(id, reason!);
    },
    onSuccess: (_, variables) => {
      toast.success(
        `Edit request ${variables.action === "approve" ? "approved" : "rejected"}.`,
      );
      queryClient.invalidateQueries({
        queryKey: ["super-admin-edit-requests"],
      });
      queryClient.invalidateQueries({ queryKey: ["super-admin-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["super-admin-users"] });
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.msg ||
          "Failed to process edit request.",
      );
    },
  });
};

export const useSendBroadcast = (onSuccessCallback?: () => void) => {
  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    BroadcastAnnouncementType
  >({
    mutationFn: superAdminService.sendBroadcast,
    onSuccess: () => {
      toast.success("Broadcast announcement sent successfully.");
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.msg ||
          "Failed to send broadcast.",
      );
    },
  });
};