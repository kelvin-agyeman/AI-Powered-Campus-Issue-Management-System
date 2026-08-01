import customFetch from "../utils/customFetch";
import type {
  CreateAdminType,
  CreateStaffType,
  UpdateUserType,
  FilterUsersQuery,
  FilterEditRequestsQuery,
  BroadcastAnnouncementType,
  UsersListResponse,
  EditRequestsResponse,
  SuperAdminDashboardResponse,
} from "../types/superAdmin.types";
import type { User } from "../types/user.types";

export const registerAdmin = async (data: CreateAdminType) => {
  const response = await customFetch.post("/super-admin/register/admin", data);
  return response.data;
};

export const registerStaff = async (data: CreateStaffType) => {
  const response = await customFetch.post("/super-admin/register/staff", data);
  return response.data;
};

export const getAllUsers = async (
  filters?: FilterUsersQuery,
): Promise<UsersListResponse> => {
  const response = await customFetch.get("/super-admin/users", {
    params: filters,
  });
  return response.data;
};

export const getUserById = async (id: string): Promise<{ user: User }> => {
  const response = await customFetch.get(`/super-admin/users/${id}`);
  return response.data;
};

export const updateUser = async (id: string, data: UpdateUserType) => {
  const response = await customFetch.patch(`/super-admin/users/${id}`, data);
  return response.data;
};

export const deactivateUser = async (id: string) => {
  const response = await customFetch.patch(
    `/super-admin/users/${id}/deactivate`,
  );
  return response.data;
};

export const reactivateUser = async (id: string) => {
  const response = await customFetch.patch(
    `/super-admin/users/${id}/reactivate`,
  );
  return response.data;
};

export const getEditRequests = async (
  filters?: FilterEditRequestsQuery,
): Promise<EditRequestsResponse> => {
  const response = await customFetch.get("/super-admin/edit-requests", {
    params: filters,
  });
  return response.data;
};

export const approveEditRequest = async (id: string) => {
  const response = await customFetch.patch(
    `/super-admin/edit-requests/${id}/approve`,
  );
  return response.data;
};

export const rejectEditRequest = async (id: string, reason: string) => {
  const response = await customFetch.patch(
    `/super-admin/edit-requests/${id}/reject`,
    { reason },
  );
  return response.data;
};

export const getSuperAdminDashboard =
  async (): Promise<SuperAdminDashboardResponse> => {
    const response = await customFetch.get("/super-admin/dashboard");
    return response.data;
  };

export const sendBroadcast = async (data: BroadcastAnnouncementType) => {
  const response = await customFetch.post("/super-admin/broadcast", data);
  return response.data;
};
