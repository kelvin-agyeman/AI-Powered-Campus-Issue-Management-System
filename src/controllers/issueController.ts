import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as issueService from "../services/issue/issueService";
import {
  CreateIssueType,
  UpdateIssueType,
  IssueImageType,
} from "../types/issue.types";
import { formatImage } from "../middleware/multerMiddleware";
import cloudinary from "cloudinary";
import { Types } from "mongoose";

export const createIssue = async (
  req: Request<{}, {}, CreateIssueType>,
  res: Response,
) => {
  const images: IssueImageType[] = [];

  if (req.files) {
    const filesArray = Array.isArray(req.files)
      ? req.files
      : Object.values(req.files).flat();

    for (const file of filesArray) {
      const formattedFile = formatImage(file);
      if (formattedFile) {
        const response = await cloudinary.v2.uploader.upload(formattedFile, {
          folder: "campus-issue-management-system-issue-images",
        });
        images.push({ url: response.secure_url, publicId: response.public_id });
      }
    }
  } else if (req.file) {
    const formattedFile = formatImage(req.file);
    if (formattedFile) {
      const response = await cloudinary.v2.uploader.upload(formattedFile, {
        folder: "campus-issue-management-system-issue-images",
      });
      images.push({ url: response.secure_url, publicId: response.public_id });
    }
  }

  const studentId = new Types.ObjectId(req.user!._id);

  const issue = await issueService.createIssue({
    ...req.body,
    reportedBy: studentId,
    images,
  });

  res.status(StatusCodes.CREATED).json({
    msg: "Issue reported successfully",
    issue,
  });
};

export const getSingleIssue = async (req: Request, res: Response) => {
  const { id: issueId } = req.params;
  const issue = await issueService.findIssueById(issueId);

  if (!issue) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "Issue not found" });
  }

  res.status(StatusCodes.OK).json({ issue });
};

export const getMyReportedIssues = async (req: Request, res: Response) => {
  const studentId = new Types.ObjectId(req.user!._id);
  const issues = await issueService.findIssuesByStudent(studentId);

  res.status(StatusCodes.OK).json({ issues });
};

export const updateIssue = async (
  req: Request<{ id: string }, {}, UpdateIssueType>,
  res: Response,
) => {
  const { id: issueId } = req.params;
  const studentId = new Types.ObjectId(req.user!._id);

  const existingIssue = await issueService.findIssueById(issueId);

  if (
    !existingIssue ||
    existingIssue.reportedBy._id.toString() !== studentId.toString() ||
    existingIssue.status !== "pending_admin_review"
  ) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Issue not found, or it can no longer be updated because it is under review",
    });
  }

  const updateData: UpdateIssueType = { ...req.body };

  if (req.files || req.file) {
    const newImages: IssueImageType[] = [];
    const filesArray = req.files
      ? Array.isArray(req.files)
        ? req.files
        : Object.values(req.files).flat()
      : req.file
        ? [req.file]
        : [];

    if (filesArray.length > 0) {
      for (const file of filesArray) {
        const formattedFile = formatImage(file);
        if (formattedFile) {
          const response = await cloudinary.v2.uploader.upload(formattedFile, {
            folder: "campus-issue-management-system-issue-images",
          });
          newImages.push({
            url: response.secure_url,
            publicId: response.public_id,
          });
        }
      }

      for (const oldImage of existingIssue.images) {
        if (oldImage.publicId) {
          await cloudinary.v2.uploader.destroy(oldImage.publicId);
        }
      }

      updateData.images = newImages;
    }
  }

  const updatedIssue = await issueService.updateIssue(
    issueId,
    studentId,
    updateData,
  );

  res.status(StatusCodes.OK).json({
    msg: "Issue updated successfully",
    issue: updatedIssue,
  });
};

export const deleteIssue = async (req: Request, res: Response) => {
  const { id: issueId } = req.params;
  const studentId = new Types.ObjectId(req.user!._id);

  const deletedIssue = await issueService.softDeleteIssue(issueId, studentId);

  if (!deletedIssue) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Issue not found, or it can no longer be deleted because it is under review",
    });
  }

  res.status(StatusCodes.OK).json({ msg: "Issue removed successfully" });
};

export const restoreIssue = async (req: Request, res: Response) => {
  const { id: issueId } = req.params;
  const studentId = new Types.ObjectId(req.user!._id);

  const restoredIssue = await issueService.restoreIssue(issueId, studentId);

  if (!restoredIssue) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Unable to restore issue" });
  }

  res.status(StatusCodes.OK).json({
    msg: "Issue restored successfully",
    issue: restoredIssue,
  });
};
