import customFetch from "../utils/customFetch";
import type {
  GetIssuesResponse,
  DeleteIssueImagePayload,
} from "../types/student.types";

export const getStudentIssues = async (): Promise<GetIssuesResponse> => {
  const response = await customFetch.get("/issues");
  return response.data;
};

export const createIssue = async (data: FormData) => {
  const response = await customFetch.post("/issues", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateIssue = async (id: string, data: FormData) => {
  const response = await customFetch.patch(`/issues/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteIssue = async (id: string) => {
  const response = await customFetch.delete(`/issues/${id}`);
  return response.data;
};

// NEW: Service to delete a single image
export const deleteIssueImage = async ({ issueId, publicId }: DeleteIssueImagePayload) => {
  const response = await customFetch.delete(`/issues/${issueId}/images`, {
    data: { publicId },
  });
  return response.data;
};