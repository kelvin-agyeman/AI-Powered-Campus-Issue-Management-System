import customFetch from "../utils/customFetch";
import type {
  GetIssuesResponse,
  SingleIssueResponse,
} from "../types/issue.types";

export const getAssignedIssues = async (
  filters?: Record<string, unknown>,
): Promise<GetIssuesResponse> => {
  const response = await customFetch.get("/staff/issues", { params: filters });
  return response.data;
};

export const getAssignedIssueById = async (
  id: string,
): Promise<SingleIssueResponse> => {
  const response = await customFetch.get(`/staff/issues/${id}`);
  return response.data;
};

export const acceptAssignment = async (id: string) => {
  const response = await customFetch.patch(`/staff/issues/${id}/accept`);
  return response.data;
};

export const updateProgress = async (
  id: string,
  data: { note: string; status?: string },
) => {
  const response = await customFetch.patch(
    `/staff/issues/${id}/progress`,
    data,
  );
  return response.data;
};

export const resolveIssue = async (id: string, data: FormData) => {
  const response = await customFetch.patch(
    `/staff/issues/${id}/resolve`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const reopenIssue = async (id: string) => {
  const response = await customFetch.patch(`/staff/issues/${id}/reopen`);
  return response.data;
};
