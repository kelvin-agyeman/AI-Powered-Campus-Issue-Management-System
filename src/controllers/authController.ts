import { Request, Response } from "express";
import User from "../models/User";
import Token from "../models/Token";
import {
  RegisterStudentType,
  RegisterStaffType,
  LoginUserType,
  ResetPasswordType,
  DepartmentType,
} from "../types/auth.types";
import { StatusCodes } from "http-status-codes";
import { attachCookiesToResponse } from "../utils/tokenUtils";
import crypto from "crypto";
import { comparePassword, hashPasswordToken } from "../utils/passwordUtils";
import {
  sendVerificationEmail,
  sendResetPasswordEmail,
} from "../utils/sendEmailUtils";
import { TokenUser, UserRole } from "../types/user.types";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000;

export const registerStudent = async (
  req: Request<{}, {}, RegisterStudentType>,
  res: Response,
) => {
  const { fullName, email, institutionId, password } = req.body;

  const existingUser = await User.findOne({
    $or: [{ email }, { institutionId }],
  });

  if (existingUser) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Student with this email or institution ID already exists",
    });
  }

  const verificationToken = crypto.randomBytes(40).toString("hex");
  // console.log("RAW TOKEN FOR POSTMAN:", verificationToken);
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

  const origin = process.env.CLIENT_URL || "http://localhost:5173";

  await sendVerificationEmail({
    name: student.fullName,
    email: student.email as string,
    verificationToken,
    origin,
  });

  res.status(StatusCodes.CREATED).json({
    msg: "Student created successfully. Please verify your email.",
  });
};

// FOR ADMIN ONLY
export const registerStaff = async (
  req: Request<{}, {}, RegisterStaffType>,
  res: Response,
) => {
  const { fullName, email, institutionId, password, department } = req.body;

  const existingUser = await User.findOne({
    $or: [{ email }, { institutionId }],
  });

  if (existingUser) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Staff already exists",
    });
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

  res.status(StatusCodes.CREATED).json({
    msg: "Staff created successfully",
    staff,
  });
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { verificationToken, email } = req.body;

  const user = await User.findOne({ email }).select("+verificationToken");

  if (!user) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Invalid verification request" });
  }

  if (user.emailVerified) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Account already verified",
    });
  }

  if (
    !user.verificationTokenExpirationDate ||
    user.verificationTokenExpirationDate < new Date()
  ) {
    user.verificationToken = undefined;
    user.verificationTokenExpirationDate = undefined;
    await user.save();
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Verification token has expired" });
  }

  if (user.verificationToken !== hashPasswordToken(verificationToken)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Invalid verification request" });
  }

  user.emailVerified = true;
  user.verifiedAt = new Date();
  user.verificationToken = undefined;
  user.verificationTokenExpirationDate = undefined;

  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Email verified successfully" });
};

export const resendVerificationEmail = async (
  req: Request<{}, {}, { email: string }>,
  res: Response,
) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide an email" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(StatusCodes.OK).json({
      msg: "If this email is registered, a new verification link has been sent.",
    });
  }

  if (user.emailVerified) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Account is already verified" });
  }

  if (
    user.lastVerificationEmailSent &&
    Date.now() - user.lastVerificationEmailSent.getTime() < 60 * 1000
  ) {
    return res.status(StatusCodes.TOO_MANY_REQUESTS).json({
      msg: "Please wait before requesting another verification email.",
    });
  }

  const verificationToken = crypto.randomBytes(40).toString("hex");
  // console.log("RAW TOKEN FOR POSTMAN:", verificationToken);
  const oneDay = 24 * 60 * 60 * 1000;

  user.verificationToken = hashPasswordToken(verificationToken);
  user.verificationTokenExpirationDate = new Date(Date.now() + oneDay);
  user.lastVerificationEmailSent = new Date();
  await user.save();

  const origin = process.env.CLIENT_URL || "http://localhost:5173";

  await sendVerificationEmail({
    name: user.fullName,
    email: user.email as string,
    verificationToken,
    origin,
  });

  res.status(StatusCodes.OK).json({
    msg: "If this email is registered, a new verification link has been sent.",
  });
};

export const loginUser = async (
  req: Request<{}, {}, LoginUserType>,
  res: Response,
) => {
  const { institutionId, password } = req.body;

  if (!institutionId || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Please provide institution ID and password",
    });
  }

  const user = await User.findOne({ institutionId }).select("+password");

  if (!user) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Invalid credentials" });
  }

  if (user.isDeleted) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Account does not exist" });
  }

  if (!user.isActive) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ msg: "Account has been deactivated" });
  }

  if (user.lockUntil && user.lockUntil < new Date()) {
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();
  }

  if (user.lockUntil && user.lockUntil > new Date()) {
    const minutes = Math.ceil((user.lockUntil.getTime() - Date.now()) / 60000);
    return res.status(StatusCodes.LOCKED).json({
      msg: `Account locked. Try again in ${minutes} minutes.`,
    });
  }

  const isPasswordCorrect = await comparePassword(password, user.password);

  if (!isPasswordCorrect) {
    user.failedLoginAttempts += 1;

    if (user.failedLoginAttempts >= MAX_LOGIN_ATTEMPTS) {
      user.lockUntil = new Date(Date.now() + LOCK_TIME);
    }

    await user.save();
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Invalid credentials" });
  }

  if (!user.emailVerified) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Please verify your email" });
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
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Invalid credentials" });
    }

    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });

    return res.status(StatusCodes.OK).json({ user: tokenUser });
  }

  refreshToken = crypto.randomBytes(40).toString("hex");

  await Token.create({
    refreshToken,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
    user: user._id,
  });

  attachCookiesToResponse({ res, user: tokenUser, refreshToken });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

export const forgotPassword = async (
  req: Request<{}, {}, { email: string }>,
  res: Response,
) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide email" });
  }

  const user = await User.findOne({ email });

  if (!user || !user.isActive || user.isDeleted) {
    return res
      .status(StatusCodes.OK)
      .json({ msg: "Please check your email for the reset link." });
  }

  if (
    user.lastPasswordResetRequest &&
    Date.now() - user.lastPasswordResetRequest.getTime() < 60 * 1000
  ) {
    return res.status(StatusCodes.TOO_MANY_REQUESTS).json({
      msg: "Please wait before requesting another reset email.",
    });
  }

  const resetPasswordToken = crypto.randomBytes(70).toString("hex");
  // console.log("RAW TOKEN FOR POSTMAN:", resetPasswordToken);
  const origin = process.env.CLIENT_URL || "http://localhost:5173";

  await sendResetPasswordEmail({
    name: user.fullName,
    email: user.email as string,
    resetPasswordToken,
    origin,
  });

  user.resetPasswordToken = hashPasswordToken(resetPasswordToken);
  user.resetPasswordTokenExpirationDate = new Date(Date.now() + 60 * 60 * 1000);
  user.lastPasswordResetRequest = new Date();
  await user.save();

  res
    .status(StatusCodes.OK)
    .json({ msg: "Please check your email for the reset link." });
};

export const resetPassword = async (
  req: Request<{}, {}, ResetPasswordType>,
  res: Response,
) => {
  const { resetPasswordToken, email, password } = req.body;

  if (!resetPasswordToken || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all required fields" });
  }

  const user = await User.findOne({ email }).select("+resetPasswordToken");

  if (!user) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "User does not exist" });
  }

  if (!user.resetPasswordToken || !user.resetPasswordTokenExpirationDate) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "No password reset request found" });
  }

  const currentDate = new Date();

  if (user.resetPasswordTokenExpirationDate < currentDate) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpirationDate = undefined;
    await user.save();
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Reset password token has expired" });
  }

  if (user.resetPasswordToken !== hashPasswordToken(resetPasswordToken)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Invalid reset token" });
  }

  user.password = password;
  user.passwordChangedAt = currentDate;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpirationDate = undefined;
  user.failedLoginAttempts = 0;
  user.lockUntil = undefined;

  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Password reset successfully" });
};

export const logoutUser = async (req: Request, res: Response) => {
  await Token.deleteMany({
    user: req.user!._id,
  });

  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({ msg: "User logged out" });
};

export const registerAdmin = async (req: Request, res: Response) => {
  const { fullName, institutionId, password } = req.body;

  const existingUser = await User.findOne({
    institutionId,
  });

  if (existingUser) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Admin already exists",
    });
  }

  const admin = await User.create({
    fullName,
    institutionId,
    password,
    role: "admin",
    emailVerified: true,
    verifiedAt: new Date(),
  });

  res.status(StatusCodes.CREATED).json({
    msg: "Admin created successfully",
    admin,
  });
};
