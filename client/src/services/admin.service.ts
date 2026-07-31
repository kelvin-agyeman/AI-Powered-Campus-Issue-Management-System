import customFetch from "../utils/customFetch";
import type {
  GetIssuesResponse,
  SingleIssueResponse,
} from "../types/issue.types";

export const getPendingIssues = async (): Promise<GetIssuesResponse> => {
  const response = await customFetch.get("/admin/issues/pending");
  return response.data;
};

export const getAllIssues = async (
  filters?: Record<string, unknown>,
): Promise<GetIssuesResponse> => {
  const response = await customFetch.get("/admin/issues", { params: filters });
  return response.data;
};

export const getIssueById = async (
  id: string,
): Promise<SingleIssueResponse> => {
  const response = await customFetch.get(`/admin/issues/${id}`);
  return response.data;
};

export const approveIssue = async (id: string) => {
  const response = await customFetch.patch(`/admin/issues/${id}/approve`);
  return response.data;
};

export const modifyIssue = async (
  id: string,
  data: { category: string; priority: string; department: string },
) => {
  const response = await customFetch.patch(`/admin/issues/${id}/modify`, data);
  return response.data;
};

export const rejectIssue = async (id: string, data: { reason: string }) => {
  const response = await customFetch.patch(`/admin/issues/${id}/reject`, data);
  return response.data;
};

export const assignIssue = async (id: string, data: { staffId: string }) => {
  const response = await customFetch.patch(`/admin/issues/${id}/assign`, data);
  return response.data;
};

export const getStaffByDepartment = async (department: string) => {
  const response = await customFetch.get(`/admin/staff/${department}`);
  return response.data;
};

export const getIssueDuplicates = async (id: string) => {
  const response = await customFetch.get(`/admin/issues/${id}/duplicates`);
  return response.data;
};

export const getIssueProgress = async (id: string) => {
  const response = await customFetch.get(`/admin/issues/${id}/progress`);
  return response.data;
};
