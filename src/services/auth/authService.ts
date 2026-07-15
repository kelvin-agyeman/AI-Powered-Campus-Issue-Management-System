import User from "../../models/User";
import Token from "../../models/Token";
import EditDetailsRequest from "../../models/EditDetailsRequest";
import crypto from "crypto";
import { comparePassword, hashPasswordToken } from "../../utils/passwordUtils";
import * as emailService from "../email/emailService";
import { StatusCodes } from "http-status-codes";
import {
  RegisterStudentType,
  RegisterStaffType,
  LoginUserType,
  ResetPasswordType,
  DepartmentType,
} from "../../types/auth.types";
import { TokenUser, UserRole } from "../../types/user.types";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000;

export type ServiceResponse = {
  status: number;
  msg?: string;
  data?: any;
  cookieData?: {
    user: TokenUser;
    refreshToken: string;
  };
};

export const registerStudentService = async (
  payload: RegisterStudentType,
  origin: string,
): Promise<ServiceResponse> => {
  const { fullName, email, institutionId, password } = payload;

  const existingUser = await User.findOne({
    $or: [{ email }, { institutionId }],
  });

  if (existingUser) {
    return {
      status: StatusCodes.BAD_REQUEST,
      msg: "Student with this email or institution ID already exists",
    };
  }

  const verificationToken = crypto.randomBytes(40).toString("hex");
  const oneDay = 24 * 60 * 60 * 1000;

  const student = await User.create({
    fullName,
    email,
    institutionId,
    password,
    role: "student",
    verificationToken: hashPasswordToken(verificationToken),
    verificationTokenExpirationDate: new Date(Date.now() + oneDay),
  });

  try {
    await emailService.sendVerificationEmail({
      name: student.fullName,
      email: student.email as string,
      verificationToken,
      origin,
      purpose: "User Registration",
    });
  } catch (error: unknown) {
    student.email = undefined;
    student.verificationToken = undefined;
    student.verificationTokenExpirationDate = undefined;
    student.lastVerificationEmailSent = undefined;
    await student.save();

    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      msg: "Failed to send verification email. Please try again later.",
    };
  }

  return {
    status: StatusCodes.CREATED,
    msg: "Verification email sent to your new email address",
  };
};

export const registerStaffService = async (
  payload: RegisterStaffType,
): Promise<ServiceResponse> => {
  const { fullName, email, institutionId, password, department } = payload;

  const existingUser = await User.findOne({
    $or: [{ email }, { institutionId }],
  });

  if (existingUser) {
    return {
      status: StatusCodes.BAD_REQUEST,
      msg: "Staff already exists",
    };
  }

  const staff = await User.create({
    fullName,
    email,
    institutionId,
    password,
    department,
    role: "staff",
    emailVerified: true,
    verifiedAt: new Date(),
  });

  return {
    status: StatusCodes.CREATED,
    msg: "Staff created successfully",
    data: staff,
  };
};

export const verifyEmailService = async (
  email: string,
  verificationToken: string,
): Promise<ServiceResponse> => {
  const user = await User.findOne({ email }).select("+verificationToken");

  if (!user) {
    return {
      status: StatusCodes.BAD_REQUEST,
      msg: "Invalid verification request",
    };
  }

  if (user.emailVerified) {
    return {
      status: StatusCodes.BAD_REQUEST,
      msg: "Account already verified",
    };
  }

  if (
    !user.verificationTokenExpirationDate ||
    user.verificationTokenExpirationDate < new Date()
  ) {
    user.verificationToken = undefined;
    user.verificationTokenExpirationDate = undefined;
    await user.save();
    return {
      status: StatusCodes.BAD_REQUEST,
      msg: "Verification token has expired",
    };
  }

  if (user.verificationToken !== hashPasswordToken(verificationToken)) {
    return {
      status: StatusCodes.BAD_REQUEST,
      msg: "Invalid verification request",
    };
  }

  user.emailVerified = true;
  user.verifiedAt = new Date();
  user.verificationToken = undefined;
  user.verificationTokenExpirationDate = undefined;
  await user.save();

  return {
    status: StatusCodes.OK,
    msg: "Email verified successfully",
  };
};

export const resendVerificationEmailService = async (
  email: string,
  origin: string,
): Promise<ServiceResponse> => {
  if (!email) {
    return { status: StatusCodes.BAD_REQUEST, msg: "Please provide an email" };
  }

  const user = await User.findOne({ email });

  if (!user) {
    return {
      status: StatusCodes.OK,
      msg: "If this email is registered, a new verification link has been sent.",
    };
  }

  if (user.emailVerified) {
    return {
      status: StatusCodes.BAD_REQUEST,
      msg: "Account is already verified",
    };
  }

  if (
    user.lastVerificationEmailSent &&
    Date.now() - user.lastVerificationEmailSent.getTime() < 60 * 1000
  ) {
    return {
      status: StatusCodes.TOO_MANY_REQUESTS,
      msg: "Please wait before requesting another verification email.",
    };
  }

  const verificationToken = crypto.randomBytes(40).toString("hex");
  const oneDay = 24 * 60 * 60 * 1000;

  user.verificationToken = hashPasswordToken(verificationToken);
  user.verificationTokenExpirationDate = new Date(Date.now() + oneDay);
  user.lastVerificationEmailSent = new Date();
  await user.save();

  try {
    await emailService.sendVerificationEmail({
      name: user.fullName,
      email: user.email as string,
      verificationToken,
      origin,
      purpose: "User Registration",
    });
  } catch (error: unknown) {
    user.email = undefined;
    user.verificationToken = undefined;
    user.verificationTokenExpirationDate = undefined;
    user.lastVerificationEmailSent = undefined;
    await user.save();

    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      msg: "Failed to send verification email. Please try again later.",
    };
  }

  return {
    status: StatusCodes.OK,
    msg: "If this email is registered, a new verification link has been sent.",
  };
};

export const loginUserService = async (
  payload: LoginUserType,
  ip: string,
  userAgent: string | undefined,
): Promise<ServiceResponse> => {
  const { institutionId, password } = payload;

  if (!institutionId || !password) {
    return {
      status: StatusCodes.BAD_REQUEST,
      msg: "Please provide institution ID and password",
    };
  }

  const user = await User.findOne({ institutionId }).select("+password");

  if (!user) {
    return { status: StatusCodes.UNAUTHORIZED, msg: "Invalid credentials" };
  }

  const pendingRequest = await EditDetailsRequest.findOne({
    requestedBy: user._id,
    status: "pending",
  });

  if (pendingRequest) {
    return {
      status: StatusCodes.FORBIDDEN,
      msg: "Your details correction request is still under review. Please wait for admin approval.",
    };
  }

  if (user.isDeleted) {
    return { status: StatusCodes.UNAUTHORIZED, msg: "Account does not exist" };
  }

  if (!user.isActive) {
    return {
      status: StatusCodes.FORBIDDEN,
      msg: "Account has been deactivated",
    };
  }

  if (user.lockUntil && user.lockUntil < new Date()) {
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();
  }

  if (user.lockUntil && user.lockUntil > new Date()) {
    const minutes = Math.ceil((user.lockUntil.getTime() - Date.now()) / 60000);
    return {
      status: StatusCodes.LOCKED,
      msg: `Account locked. Try again in ${minutes} minutes.`,
    };
  }

  const isPasswordCorrect = await comparePassword(password, user.password);

  if (!isPasswordCorrect) {
    user.failedLoginAttempts += 1;
    if (user.failedLoginAttempts >= MAX_LOGIN_ATTEMPTS) {
      user.lockUntil = new Date(Date.now() + LOCK_TIME);
    }
    await user.save();
    return { status: StatusCodes.UNAUTHORIZED, msg: "Invalid credentials" };
  }

  if (!user.emailVerified) {
    return {
      status: StatusCodes.UNAUTHORIZED,
      msg: "Please verify your email",
    };
  }

  user.failedLoginAttempts = 0;
  user.lockUntil = undefined;
  user.lastLogin = new Date();
  await user.save();

  const tokenUser: TokenUser = {
    _id: user._id,
    fullName: user.fullName,
    role: user.role as UserRole,
  };

  if (user.role === "staff" && user.department) {
    tokenUser.department = user.department as DepartmentType;
  }

  let refreshToken = "";
  const existingToken = await Token.findOne({ user: user._id });

  if (existingToken) {
    if (!existingToken.isValid) {
      return { status: StatusCodes.UNAUTHORIZED, msg: "Invalid credentials" };
    }
    refreshToken = existingToken.refreshToken;
    return {
      status: StatusCodes.OK,
      cookieData: { user: tokenUser, refreshToken },
    };
  }

  refreshToken = crypto.randomBytes(40).toString("hex");

  await Token.create({
    refreshToken,
    ip,
    userAgent,
    user: user._id,
  });

  return {
    status: StatusCodes.OK,
    cookieData: { user: tokenUser, refreshToken },
  };
};

export const forgotPasswordService = async (
  email: string,
  origin: string,
): Promise<ServiceResponse> => {
  if (!email) {
    return { status: StatusCodes.BAD_REQUEST, msg: "Please provide email" };
  }

  const user = await User.findOne({ email });

  if (!user || !user.isActive || user.isDeleted) {
    return {
      status: StatusCodes.OK,
      msg: "Please check your email for the reset link.",
    };
  }

  if (
    user.lastPasswordResetRequest &&
    Date.now() - user.lastPasswordResetRequest.getTime() < 60 * 1000
  ) {
    return {
      status: StatusCodes.TOO_MANY_REQUESTS,
      msg: "Please wait before requesting another reset email.",
    };
  }

  const resetPasswordToken = crypto.randomBytes(70).toString("hex");

  try {
    await emailService.sendResetPasswordEmail({
      name: user.fullName,
      email: user.email as string,
      resetPasswordToken,
      origin,
    });
  } catch (error: unknown) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpirationDate = undefined;
    user.lastPasswordResetRequest = undefined;
    await user.save();

    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      msg: "Failed to send reset password email. Please try again later.",
    };
  }

  user.resetPasswordToken = hashPasswordToken(resetPasswordToken);
  user.resetPasswordTokenExpirationDate = new Date(Date.now() + 60 * 60 * 1000);
  user.lastPasswordResetRequest = new Date();
  await user.save();

  return {
    status: StatusCodes.OK,
    msg: "Please check your email for the reset link.",
  };
};

export const resetPasswordService = async (
  payload: ResetPasswordType,
): Promise<ServiceResponse> => {
  const { resetPasswordToken, email, password } = payload;

  if (!resetPasswordToken || !email || !password) {
    return {
      status: StatusCodes.BAD_REQUEST,
      msg: "Please provide all required fields",
    };
  }

  const user = await User.findOne({ email }).select("+resetPasswordToken");

  if (!user) {
    return { status: StatusCodes.UNAUTHORIZED, msg: "User does not exist" };
  }

  if (!user.resetPasswordToken || !user.resetPasswordTokenExpirationDate) {
    return {
      status: StatusCodes.BAD_REQUEST,
      msg: "No password reset request found",
    };
  }

  const currentDate = new Date();

  if (user.resetPasswordTokenExpirationDate < currentDate) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpirationDate = undefined;
    await user.save();
    return {
      status: StatusCodes.BAD_REQUEST,
      msg: "Reset password token has expired",
    };
  }

  if (user.resetPasswordToken !== hashPasswordToken(resetPasswordToken)) {
    return { status: StatusCodes.BAD_REQUEST, msg: "Invalid reset token" };
  }

  user.password = password;
  user.passwordChangedAt = currentDate;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpirationDate = undefined;
  user.failedLoginAttempts = 0;
  user.lockUntil = undefined;
  await user.save();

  return { status: StatusCodes.OK, msg: "Password reset successfully" };
};

export const logoutUserService = async (userId: string): Promise<void> => {
  await Token.deleteMany({ user: userId });
};

export const registerAdminService = async (
  payload: any,
): Promise<ServiceResponse> => {
  const { fullName, institutionId, password } = payload;

  const existingUser = await User.findOne({ institutionId });

  if (existingUser) {
    return { status: StatusCodes.BAD_REQUEST, msg: "Admin already exists" };
  }

  const admin = await User.create({
    fullName,
    institutionId,
    password,
    role: "admin",
    emailVerified: true,
    verifiedAt: new Date(),
  });

  return {
    status: StatusCodes.CREATED,
    msg: "Admin created successfully",
    data: admin,
  };
};
