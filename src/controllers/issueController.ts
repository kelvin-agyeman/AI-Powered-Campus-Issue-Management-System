import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as issueService from "../services/issue/issueService";
import * as fileUploadService from "../services/fileUpload/fileUploadService";
import {
  CreateIssueType,
  UpdateIssueType,
  IssueImageType,
} from "../types/issue.types";
import { Types } from "mongoose";

const ISSUES_FOLDER = "campus-issue-management-system-issue-images";

export const createIssue = async (
  req: Request<{}, {}, CreateIssueType>,
  res: Response,
) => {
  const files = req.files || req.file;

  const images: IssueImageType[] = await fileUploadService.uploadMultipleFiles(
    files,
    ISSUES_FOLDER,
  );

  const studentId = new Types.ObjectId(req.user!._id);

  const issue = await issueService.createIssue({
    ...req.body,
    reportedBy: studentId,
    images,
  });

  res.status(StatusCodes.CREATED).json({
    message: "Issue reported successfully",
    issue,
  });
};

export const getSingleIssue = async (req: Request, res: Response) => {
  const { id: issueId } = req.params;
  const issue = await issueService.findIssueById(issueId);

  if (!issue) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "Issue not found" });
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
      message: "Issue not found, or it can no longer be updated because it is under review",
    });
  }

  const updateData: UpdateIssueType = { ...req.body };
  const files = req.files || req.file;

  if (files) {
    const newImages = await fileUploadService.uploadMultipleFiles(
      files,
      ISSUES_FOLDER,
    );

    if (newImages.length > 0) {
      const oldPublicIds = existingIssue.images
        .map((img) => img.publicId)
        .filter((id): id is string => !!id);

      if (oldPublicIds.length > 0) {
        await fileUploadService.deleteMultipleCloudinaryImages(oldPublicIds);
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
    message: "Issue updated successfully",
    issue: updatedIssue,
  });
};

export const deleteIssue = async (req: Request, res: Response) => {
  const { id: issueId } = req.params;
  const studentId = new Types.ObjectId(req.user!._id);

  const deletedIssue = await issueService.softDeleteIssue(issueId, studentId);

  if (!deletedIssue) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Issue not found, or it can no longer be deleted because it is under review",
    });
  }

  res.status(StatusCodes.OK).json({ message: "Issue removed successfully" });
};

export const restoreIssue = async (req: Request, res: Response) => {
  const { id: issueId } = req.params;
  const studentId = new Types.ObjectId(req.user!._id);

  const restoredIssue = await issueService.restoreIssue(issueId, studentId);

  if (!restoredIssue) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Unable to restore issue" });
  }

  res.status(StatusCodes.OK).json({
    message: "Issue restored successfully",
    issue: restoredIssue,
  });
};
