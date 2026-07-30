import customFetch from "../utils/customFetch";
import type { GetNotificationsResponse } from "../types/notification.types";

export const getUserNotifications =
  async (): Promise<GetNotificationsResponse> => {
    const response = await customFetch.get("/notifications");
    return response.data;
  };

export const markAllNotificationsRead = async () => {
  const response = await customFetch.patch("/notifications/read-all");
  return response.data;
};
