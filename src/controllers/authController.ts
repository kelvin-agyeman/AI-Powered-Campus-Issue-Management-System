import { Request, Response } from "express";
import { attachCookiesToResponse } from "../utils/tokenUtils";
import {
  RegisterStudentType,
  RegisterStaffType,
  LoginUserType,
  ResetPasswordType,
} from "../types/auth.types";
import * as authService from "../services/auth/authService";
import { StatusCodes } from "http-status-codes";

export const registerStudent = async (
  req: Request<{}, {}, RegisterStudentType>,
  res: Response,
) => {
  const origin = process.env.CLIENT_URL || "http://localhost:5173";
  const result = await authService.registerStudentService(req.body, origin);

  res.status(result.status).json({ msg: result.msg });
};

// FOR ADMIN ONLY
export const registerStaff = async (
  req: Request<{}, {}, RegisterStaffType>,
  res: Response,
) => {
  const result = await authService.registerStaffService(req.body);

  if (result.status === StatusCodes.CREATED) {
    return res
      .status(result.status)
      .json({ msg: result.msg, staff: result.data });
  }

  res.status(result.status).json({ msg: result.msg });
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { verificationToken, email } = req.body;
  const result = await authService.verifyEmailService(email, verificationToken);

  res.status(result.status).json({ msg: result.msg });
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

  res.status(result.status).json({ msg: result.msg });
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

  res.status(result.status).json({ msg: result.msg });
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

  res.status(result.status).json({ msg: result.msg });
};

export const resetPassword = async (
  req: Request<{}, {}, ResetPasswordType>,
  res: Response,
) => {
  const result = await authService.resetPasswordService(req.body);

  res.status(result.status).json({ msg: result.msg });
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

  res.status(StatusCodes.OK).json({ msg: "User logged out" });
};

export const registerAdmin = async (req: Request, res: Response) => {
  const result = await authService.registerAdminService(req.body);

  if (result.status === StatusCodes.CREATED) {
    return res
      .status(result.status)
      .json({ msg: result.msg, admin: result.data });
  }

  res.status(result.status).json({ msg: result.msg });
};
