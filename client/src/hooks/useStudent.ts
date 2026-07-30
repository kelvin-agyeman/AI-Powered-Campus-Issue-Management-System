import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getStudentIssues,
  createIssue,
  updateIssue,
  deleteIssue,
  deleteIssueImage, // NEW
} from "../services/student.service";
import type {
  ApiErrorResponse,
  UpdateIssuePayload,
  GetIssuesResponse,
  SingleIssueResponse,
  DeleteIssueResponse,
  DeleteIssueImagePayload, // NEW
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

// NEW: Hook to delete a single image
export const useDeleteIssueImage = () => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    DeleteIssueImagePayload
  >({
    mutationFn: deleteIssueImage,
    onSuccess: () => {
      toast.success("Image deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["student-issues"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.msg ??
          error.response?.data?.message ??
          "Failed to delete image.",
      );
    },
  });
};
