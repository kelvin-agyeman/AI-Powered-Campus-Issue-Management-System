import { Request, Response } from "express";
import * as userService from "../services/user/userService";
import { StatusCodes } from "http-status-codes";

export const getCurrentUser = async (req: Request, res: Response) => {
  const result = await userService.getCurrentUserService(
    req.user!._id.toString(),
  );

  if (result.status === StatusCodes.OK) {
    return res.status(result.status).json({ user: result.data });
  }

  res.status(result.status).json({ message: result.message });
};

export const updateUser = async (
  req: Request<{}, {}, { fullName?: string; password?: string }>,
  res: Response,
) => {
  const result = await userService.updateUserService(
    req.user!._id.toString(),
    req.body.fullName,
    req.file,
  );

  if (result.status === StatusCodes.OK) {
    return res
      .status(result.status)
      .json({ message: result.message, user: result.data });
  }

  res.status(result.status).json({ message: result.message });
};

export const updateEmail = async (
  req: Request<{}, {}, { newEmail: string }>,
  res: Response,
) => {
  const origin = process.env.CLIENT_URL || "http://localhost:5173";
  const result = await userService.updateEmailService(
    req.user!._id.toString(),
    req.body.newEmail,
    origin,
  );

  res.status(result.status).json({ message: result.message });
};

export const resendVerificationEmail = async (
  req: Request<{}, {}, { newEmail: string }>,
  res: Response,
) => {
  const origin = process.env.CLIENT_URL || "http://localhost:5173";
  const result = await userService.resendNewEmailVerificationService(
    req.body.newEmail,
    origin,
  );

  res.status(result.status).json({ message: result.message });
};

export const verifyUpdatedEmail = async (
  req: Request<{}, {}, { newEmail: string; newVerificationToken: string }>,
  res: Response,
) => {
  const { newEmail, newVerificationToken } = req.body;
  const result = await userService.verifyUpdatedEmailService(
    newEmail,
    newVerificationToken,
  );

  res.status(result.status).json({ message: result.message });
};

export const sendEditDetailsRequest = async (
  req: Request<{}, {}, { newInstitutionId: string; reason: string }>,
  res: Response,
) => {
  const result = await userService.sendEditDetailsRequestService(
    req.user!._id.toString(),
    req.body.newInstitutionId,
    req.body.reason,
  );

  if (result.logoutRequired) {
    res.cookie("accessToken", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });

    res.cookie("refreshToken", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
  }

  if (result.status === StatusCodes.OK) {
    return res
      .status(result.status)
      .json({ message: result.message, editDetailsRequest: result.data });
  }

  res.status(result.status).json({ message: result.message });
};

export const deleteAvatar = async (req: Request, res: Response) => {
  const result = await userService.deleteAvatarService(
    req.user!._id.toString(),
  );

  if (result.status === StatusCodes.OK) {
    return res
      .status(result.status)
      .json({ message: result.message, user: result.data });
  }

  res.status(result.status).json({ message: result.message });
};
