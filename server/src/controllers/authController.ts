import { Request, Response } from "express";
import { attachCookiesToResponse } from "../utils/tokenUtils";
import {
  RegisterStudentType,
  LoginUserType,
  ResetPasswordType,
} from "../types/auth.types";
import * as authService from "../services/auth/authService";
import { StatusCodes } from "http-status-codes";
import User from "../models/User";

export const registerStudent = async (
  req: Request<{}, {}, RegisterStudentType>,
  res: Response,
) => {
  const origin = process.env.CLIENT_URL || "http://localhost:5173";
  const result = await authService.registerStudentService(req.body, origin);

  res.status(result.status).json({ message: result.message });
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { verificationToken, email } = req.body;
  const result = await authService.verifyEmailService(email, verificationToken);

  res.status(result.status).json({ message: result.message });
};

export const resendVerificationEmail = async (
  req: Request<{}, {}, { email: string }>,
  res: Response,
) => {
  const origin = process.env.CLIENT_URL || "http://localhost:5173";
  const result = await authService.resendVerificationEmailService(
    req.body.email,
    origin,
  );

  res.status(result.status).json({ message: result.message });
};

export const loginUser = async (
  req: Request<{}, {}, LoginUserType>,
  res: Response,
) => {
  const result = await authService.loginUserService(
    req.body,
    req.ip || "",
    req.headers["user-agent"],
  );

  if (result.cookieData) {
    attachCookiesToResponse({
      res,
      user: result.cookieData.user,
      refreshToken: result.cookieData.refreshToken,
    });

    return res.status(result.status).json({ user: result.cookieData.user });
  }

  res.status(result.status).json({ message: result.message });
};

export const forgotPassword = async (
  req: Request<{}, {}, { email: string }>,
  res: Response,
) => {
  const origin = process.env.CLIENT_URL || "http://localhost:5173";
  const result = await authService.forgotPasswordService(
    req.body.email,
    origin,
  );

  res.status(result.status).json({ message: result.message });
};

export const resetPassword = async (
  req: Request<{}, {}, ResetPasswordType>,
  res: Response,
) => {
  const result = await authService.resetPasswordService(req.body);

  res.status(result.status).json({ message: result.message });
};

export const logoutUser = async (req: Request, res: Response) => {
  await authService.logoutUserService(req.user!._id.toString());

  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "User logged out" });
};

// Only used in postman for super admin creation
export const createSuperAdmin = async (req: Request, res: Response) => {
  const { fullName, institutionId, password } = req.body;

  const existingUser = await User.findOne({
    institutionId,
  });
  if (existingUser) {
    throw new Error("User with this Admin ID already exists.");
  }

  const superAdminUser = await User.create({
    fullName,
    institutionId,
    password,
    role: "super_admin",
    emailVerified: true,
    verifiedAt: new Date(),
  });

  return res
    .status(StatusCodes.OK)
    .json({ message: "User created successfully", superAdminUser });
};
