import { Request, Response } from "express";
import User from "../models/User";
import EditDetailsRequest from "../models/EditDetailsRequest";
import Token from "../models/Token";
import { StatusCodes } from "http-status-codes";
import cloudinary from "cloudinary";
import { formatImage } from "../middleware/multerMiddleware";
import crypto from "crypto";
import { hashPasswordToken } from "../utils/passwordUtils";
import { sendVerificationEmail } from "../utils/sendEmailUtils";

export const getCurrentUser = async (req: Request, res: Response) => {
  const user = await User.findById(req.user!._id).select("-password");

  if (!user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "User not found" });
  }

  res.status(StatusCodes.OK).json({ user });
};

export const updateUser = async (
  req: Request<
    {},
    {},
    {
      fullName?: string;
      avatar?: string;
      password?: string;
      avatarPublicId?: string;
    }
  >,
  res: Response,
) => {
  // console.log(req.file);
  const updateData: {
    fullName?: string;
    avatar?: string;
    avatarPublicId?: string;
  } = {};

  if (req.body.fullName) {
    updateData.fullName = req.body.fullName;
  }

  const user = await User.findOne({ _id: req.user!._id });

  if (!user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "User not found" });
  }

  if (req.file) {
    const file = formatImage(req.file);

    if (!file) {
      throw new Error("Failed to format image file");
    }

    const response = await cloudinary.v2.uploader.upload(file, {
      use_filename: true,
      folder: "campus-issue-management-system-user-images",
    });
    // console.log(response)
    updateData.avatar = response.secure_url;
    updateData.avatarPublicId = response.public_id;
  }

  if (req.file && user.avatarPublicId) {
    await cloudinary.v2.uploader.destroy(user.avatarPublicId);
  }

  const updatedUser = await User.findByIdAndUpdate(req.user!._id, updateData, {
    returnDocument: "after",
    runValidators: true,
  });

  res
    .status(StatusCodes.OK)
    .json({ msg: "user updated successfully", user: updatedUser });
};

export const updateEmail = async (
  req: Request<{}, {}, { newEmail: string }>,
  res: Response,
) => {
  const { newEmail } = req.body;

  const user = await User.findById(req.user!._id);

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({
      msg: "User not found",
    });
  }

  if (user.email === newEmail) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Please provide a different email address",
    });
  }

  const existingUser = await User.findOne({
    $or: [{ email: newEmail }, { newEmail: newEmail }],
  }); // For checking if the requested email is taken as a primary email OR if someone else is currently in the middle of updating to that newEmail (to prevent two people fighting over the same new email at the exact same time).

  if (existingUser) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "This email is currently unavailable",
    });
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

  console.log("RAW TOKEN FOR POSTMAN:", verificationToken);

  const oneDay = 1000 * 60 * 60 * 24;

  user.newEmail = newEmail;
  user.newVerificationToken = hashPasswordToken(verificationToken);
  user.newVerificationTokenExpirationDate = new Date(Date.now() + oneDay);
  user.lastVerificationEmailSent = new Date();

  await user.save();

  const origin = process.env.CLIENT_URL || "http://localhost:5173";

  try {
    await sendVerificationEmail({
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

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Failed to send verification email. Please try again later.",
    });
  }

  res.status(StatusCodes.OK).json({
    msg: "Verification email sent to your new email address.",
  });
};

export const resendVerificationEmail = async (
  req: Request<{}, {}, { newEmail: string }>,
  res: Response,
) => {
  const { newEmail } = req.body;

  if (!newEmail) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide an email" });
  }

  const user = await User.findOne({ newEmail });

  if (!user) {
    return res.status(StatusCodes.OK).json({
      msg: "If this email is registered, a new verification link has been sent.",
    });
  }

  if (user.emailVerified && !user.newEmail) {
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
  const oneDay = 24 * 60 * 60 * 1000;

  user.newVerificationToken = hashPasswordToken(verificationToken);
  user.newVerificationTokenExpirationDate = new Date(Date.now() + oneDay);
  user.lastVerificationEmailSent = new Date();
  await user.save();

  const origin = process.env.CLIENT_URL || "http://localhost:5173";

  try {
    await sendVerificationEmail({
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

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Failed to send verification email. Please try again later.",
    });
  }

  res.status(StatusCodes.OK).json({
    msg: "If this email is registered, a new verification link has been sent.",
  });
};

export const verifyUpdatedEmail = async (
  req: Request<{}, {}, { newEmail: string; newVerificationToken: string }>,
  res: Response,
) => {
  const { newEmail, newVerificationToken } = req.body;

  const user = await User.findOne({
    newEmail,
  }).select(
    "+newEmail +newVerificationToken +newVerificationTokenExpirationDate",
  );

  if (!user) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Invalid verification request",
    });
  }

  if (!user.newVerificationToken || !user.newVerificationTokenExpirationDate) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Invalid verification request",
    });
  }

  if (user.newVerificationTokenExpirationDate < new Date()) {
    user.newEmail = undefined;
    user.newVerificationToken = undefined;
    user.newVerificationTokenExpirationDate = undefined;
    user.lastVerificationEmailSent = undefined;

    await user.save();

    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Verification token has expired",
    });
  }

  if (user.newVerificationToken !== hashPasswordToken(newVerificationToken)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Invalid verification request",
    });
  }

  user.email = user.newEmail;

  user.newEmail = undefined;
  user.newVerificationToken = undefined;
  user.newVerificationTokenExpirationDate = undefined;

  user.emailVerified = true;
  user.verifiedAt = new Date();

  user.lastVerificationEmailSent = undefined;

  await user.save();

  res.status(StatusCodes.OK).json({
    msg: "Email updated successfully",
  });
};

export const sendEditDetailsRequest = async (
  req: Request<{ newInstitutionId: string; reason: string }>,
  res: Response,
) => {
  const { newInstitutionId, reason } = req.body;

  const studentAlreadyExists = await User.findOne({
    institutionId: newInstitutionId,
  });

  if (studentAlreadyExists) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "A student with this student ID already exists." });
  }

  const editDetailsRequest = await EditDetailsRequest.create({
    requestedBy: req.user!._id,
    newInstitutionId,
    reason,
  });

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

  res.status(StatusCodes.OK).json({
    msg: "Request sent successfully. You will be logged out until your request is approved.",
    editDetailsRequest,
  });
};

export const deleteAvatar = async (req: Request, res: Response) => {
  const user = await User.findById(req.user!._id);

  if (!user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "User not found" });
  }

  if (!user.avatarPublicId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "No avatar to delete" });
  }

  await cloudinary.v2.uploader.destroy(user.avatarPublicId);

  user.avatar = undefined;
  user.avatarPublicId = undefined;
  await user.save();

  res.status(StatusCodes.OK).json({
    msg: "Avatar removed successfully",
    user,
  });
};
