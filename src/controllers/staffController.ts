import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as staffService from "../services/staff/staffService";
import { Types } from "mongoose";

export const getAssignedIssues = async (req: Request, res: Response) => {
  const staffId = req.user!._id as Types.ObjectId;
  const filters = req.query;

  const issues = await staffService.getAssignedIssues(staffId, filters);

  res.status(StatusCodes.OK).json({
    success: true,
    count: issues.length,
    data: issues,
  });
};

export const getAssignedIssueById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const staffId = req.user!._id as Types.ObjectId;

  const issue = await staffService.getAssignedIssueById(id, staffId);

  if (!issue) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: "Issue not found or you do not have permission to view it",
    });
  }

  res.status(StatusCodes.OK).json({
    success: true,
    data: issue,
  });
};

export const acceptAssignment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const staffId = req.user!._id as Types.ObjectId;

    const issue = await staffService.acceptAssignment(id, staffId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Assignment accepted successfully",
      data: issue,
    });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProgress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const staffId = req.user!._id as Types.ObjectId;
    const data = req.body;

    const issue = await staffService.updateProgress(id, staffId, data);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Progress updated successfully",
      data: issue,
    });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.message,
    });
  }
};

export const resolveIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const staffId = req.user!._id as Types.ObjectId;
    const data = req.body;

    const issue = await staffService.resolveIssue(id, staffId, data);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Issue marked as resolved",
      data: issue,
    });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.message,
    });
  }
};

export const reopenIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const staffId = req.user!._id as Types.ObjectId;

    const issue = await staffService.reopenIssue(id, staffId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Issue reopened successfully",
      data: issue,
    });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.message,
    });
  }
};