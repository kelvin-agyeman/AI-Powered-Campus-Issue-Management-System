import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { AxiosError } from "axios";
import { toast } from "sonner";

import {
  getUserNotifications,
  markAllNotificationsRead,
} from "../services/notification.service";

import type {
  ApiErrorResponse,
  GetNotificationsResponse,
} from "../types/notification.types";

export const useUserNotifications = () => {
  return useQuery<GetNotificationsResponse, AxiosError<ApiErrorResponse>>({
    queryKey: ["user-notifications"],
    queryFn: getUserNotifications,
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ApiErrorResponse>, void>({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      toast.success("All notifications marked as read.");
      queryClient.invalidateQueries({ queryKey: ["user-notifications"] });
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
