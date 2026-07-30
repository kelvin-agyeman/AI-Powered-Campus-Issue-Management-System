export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface ApiErrorResponse {
  msg?: string;
  message?: string;
}

export interface GetNotificationsResponse {
  success: boolean;
  message: string;
  data: {
    notifications: Notification[];
  };
}