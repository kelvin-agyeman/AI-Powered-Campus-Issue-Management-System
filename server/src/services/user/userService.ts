import User from "../../models/User";
import EditDetailsRequest from "../../models/EditDetailsRequest";
import Token from "../../models/Token";
import { StatusCodes } from "http-status-codes";
import crypto from "crypto";
import { hashPasswordToken } from "../../utils/passwordUtils";
import * as emailService from "../email/emailService";
import * as fileUploadService from "../fileUpload/fileUploadService";

const USER_AVATARS_FOLDER = "campus-issue-management-system-user-images";

export type ServiceResponse = {
  status: number;
  message?: string;
  data?: any;
  logoutRequired?: boolean;
};

export const getCurrentUserService = async (
  userId: string,
): Promise<ServiceResponse> => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    return { status: StatusCodes.UNAUTHORIZED, message: "User not found" };
  }

  return { status: StatusCodes.OK, data: user };
};

export const updateUserService = async (
  userId: string,
  fullName?: string,
  file?: Express.Multer.File,
): Promise<ServiceResponse> => {
  const user = await User.findById(userId);

  if (!user) {
    return { status: StatusCodes.UNAUTHORIZED, message: "User not found" };
  }

  const updateData: {
    fullName?: string;
    avatar?: string;
    avatarPublicId?: string;
  } = {};

  if (fullName) {
    updateData.fullName = fullName;
  }

  if (file) {
    const uploadedImage = await fileUploadService.uploadSingleFile(
      file,
      USER_AVATARS_FOLDER,
    );

    updateData.avatar = uploadedImage.url;
    updateData.avatarPublicId = uploadedImage.publicId;

    if (user.avatarPublicId) {
      await fileUploadService.deleteCloudinaryImage(user.avatarPublicId);
    }
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    returnDocument: "after",
    runValidators: true,
  });

  return {
    status: StatusCodes.OK,
    message: "user updated successfully",
    data: updatedUser,
  };
};

export const updateEmailService = async (
  userId: string,
  newEmail: string,
  origin: string,
): Promise<ServiceResponse> => {
  const user = await User.findById(userId);

  if (!user) {
    return { status: StatusCodes.NOT_FOUND, message: "User not found" };
  }

  if (user.email === newEmail) {
    return {
      status: StatusCodes.BAD_REQUEST,
      message: "Please provide a different email address",
    };
  }

  const existingUser = await User.findOne({
    $or: [{ email: newEmail }, { newEmail: newEmail }],
  });

  if (existingUser) {
    return {
      status: StatusCodes.BAD_REQUEST,
      message: "This email is currently unavailable",
    };
  }

  if (
    user.lastVerificationEmailSent &&
    Date.now() - user.lastVerificationEmailSent.getTime() < 60 * 1000
  ) {
    return {
      status: StatusCodes.TOO_MANY_REQUESTS,
      message: "Please wait before requesting another verification email.",
    };
  }

  const verificationToken = crypto.randomBytes(40).toString("hex");
  const oneDay = 1000 * 60 * 60 * 24;

  user.newEmail = newEmail;
  user.newVerificationToken = hashPasswordToken(verificationToken);
  user.newVerificationTokenExpirationDate = new Date(Date.now() + oneDay);
  user.lastVerificationEmailSent = new Date();

  await user.save();

  try {
    await emailService.sendVerificationEmail({
      name: user.fullName,
      email: user.newEmail as string,
      verificationToken,
      origin,
      purpose: "Email Update",
    });
  } catch (error: unknown) {
    user.newEmail = undefined;
    user.newVerificationToken = undefined;
    user.newVerificationTokenExpirationDate = undefined;
    user.lastVerificationEmailSent = undefined;
    await user.save();

    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Failed to send verification email. Please try again later.",
    };
  }

  return {
    status: StatusCodes.OK,
    message: "Verification email sent to your new email address.",
  };
};

export const resendNewEmailVerificationService = async (
  newEmail: string,
  origin: string,
): Promise<ServiceResponse> => {
  if (!newEmail) {
    return { status: StatusCodes.BAD_REQUEST, message: "Please provide an email" };
  }

  const user = await User.findOne({ newEmail });

  if (!user) {
    return {
      status: StatusCodes.OK,
      message: "If this email is registered, a new verification link has been sent.",
    };
  }

  if (user.emailVerified && !user.newEmail) {
    return {
      status: StatusCodes.BAD_REQUEST,
      message: "Account is already verified",
    };
  }

  if (
    user.lastVerificationEmailSent &&
    Date.now() - user.lastVerificationEmailSent.getTime() < 60 * 1000
  ) {
    return {
      status: StatusCodes.TOO_MANY_REQUESTS,
      message: "Please wait before requesting another verification email.",
    };
  }

  const verificationToken = crypto.randomBytes(40).toString("hex");
  const oneDay = 24 * 60 * 60 * 1000;

  user.newVerificationToken = hashPasswordToken(verificationToken);
  user.newVerificationTokenExpirationDate = new Date(Date.now() + oneDay);
  user.lastVerificationEmailSent = new Date();
  await user.save();

  try {
    await emailService.sendVerificationEmail({
      name: user.fullName,
      email: user.newEmail as string,
      verificationToken,
      origin,
      purpose: "Email Update",
    });
  } catch (error: unknown) {
    user.newEmail = undefined;
    user.newVerificationToken = undefined;
    user.newVerificationTokenExpirationDate = undefined;
    user.lastVerificationEmailSent = undefined;
    await user.save();

    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Failed to send verification email. Please try again later.",
    };
  }

  return {
    status: StatusCodes.OK,
    message: "If this email is registered, a new verification link has been sent.",
  };
};

export const verifyUpdatedEmailService = async (
  newEmail: string,
  newVerificationToken: string,
): Promise<ServiceResponse> => {
  const user = await User.findOne({ newEmail }).select(
    "+newEmail +newVerificationToken +newVerificationTokenExpirationDate",
  );

  if (
    !user ||
    !user.newVerificationToken ||
    !user.newVerificationTokenExpirationDate
  ) {
    return {
      status: StatusCodes.BAD_REQUEST,
      message: "Invalid verification request",
    };
  }

  if (user.newVerificationTokenExpirationDate < new Date()) {
    user.newEmail = undefined;
    user.newVerificationToken = undefined;
    user.newVerificationTokenExpirationDate = undefined;
    user.lastVerificationEmailSent = undefined;
    await user.save();

    return {
      status: StatusCodes.BAD_REQUEST,
      message: "Verification token has expired",
    };
  }

  if (user.newVerificationToken !== hashPasswordToken(newVerificationToken)) {
    return {
      status: StatusCodes.BAD_REQUEST,
      message: "Invalid verification request",
    };
  }

  user.email = user.newEmail;
  user.newEmail = undefined;
  user.newVerificationToken = undefined;
  user.newVerificationTokenExpirationDate = undefined;
  user.emailVerified = true;
  user.verifiedAt = new Date();
  user.lastVerificationEmailSent = undefined;

  await user.save();

  return { status: StatusCodes.OK, message: "Email updated successfully" };
};

export const sendEditDetailsRequestService = async (
  userId: string,
  newInstitutionId: string,
  reason: string,
): Promise<ServiceResponse> => {
  const studentAlreadyExists = await User.findOne({
    institutionId: newInstitutionId,
  });

  if (studentAlreadyExists) {
    return {
      status: StatusCodes.BAD_REQUEST,
      message: "A student with this student ID already exists.",
    };
  }

  const editDetailsRequest = await EditDetailsRequest.create({
    requestedBy: userId,
    newInstitutionId,
    reason,
  });

  await Token.deleteMany({ user: userId });

  return {
    status: StatusCodes.OK,
    message: "Request sent successfully. You will be logged out until your request is approved.",
    data: editDetailsRequest,
    logoutRequired: true,
  };
};

export const deleteAvatarService = async (
  userId: string,
): Promise<ServiceResponse> => {
  const user = await User.findById(userId);

  if (!user) {
    return { status: StatusCodes.UNAUTHORIZED, message: "User not found" };
  }

  if (!user.avatarPublicId) {
    return { status: StatusCodes.BAD_REQUEST, message: "No avatar to delete" };
  }

  await fileUploadService.deleteCloudinaryImage(user.avatarPublicId);

  user.avatar = undefined;
  user.avatarPublicId = undefined;
  await user.save();

  return {
    status: StatusCodes.OK,
    message: "Avatar removed successfully",
    data: user,
  };
};
