import customFetch from "../utils/customFetch";
import type {
  GetCurrentUserResponse,
  UpdateEmailPayload,
  VerifyUpdatedEmailPayload,
  SendEditDetailsRequestPayload,
} from "../types/user.types";

export const getCurrentUser = async (): Promise<GetCurrentUserResponse> => {
  const response = await customFetch.get("/user/current");
  return response.data;
};

export const updateUser = async (data: FormData) => {
  const response = await customFetch.patch("/user/update", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateEmail = async (data: UpdateEmailPayload) => {
  const response = await customFetch.patch("/user/update-email", data);
  return response.data;
};

export const verifyUpdatedEmail = async (data: VerifyUpdatedEmailPayload) => {
  const response = await customFetch.post("/user/verify-updated-email", data);
  return response.data;
};

export const resendVerificationEmail = async (data: UpdateEmailPayload) => {
  const response = await customFetch.post(
    "/user/resend-verification-email",
    data,
  );
  return response.data;
};

export const sendEditDetailsRequest = async (
  data: SendEditDetailsRequestPayload,
) => {
  const response = await customFetch.post(
    "/user/send-edit-details-request",
    data,
  );
  return response.data;
};

export const deleteAvatar = async () => {
  const response = await customFetch.delete("/user/delete-avatar");
  return response.data;
};
