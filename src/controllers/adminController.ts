import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as adminService from "../services/admin/adminService";
import { Types } from "mongoose";
import {
  AssignStaffType,
  FilterIssuesQuery,
  KNUST_DEPARTMENTS,
  ModifyIssueType,
  RejectIssueType,
} from "../types/admin.types";

export const getPendingIssues = async (req: Request, res: Response) => {
  const issues = await adminService.getPendingIssues();

  res.status(StatusCodes.OK).json({ success: true, data: { issues } });
};

export const getAllIssues = async (
  req: Request<{}, {}, {}, FilterIssuesQuery>,
  res: Response,
) => {
  const issues = await adminService.getAllIssues(req.query);

  res.status(StatusCodes.OK).json({ success: true, data: { issues } });
};

export const getIssueById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const issue = await adminService.getIssueById(req.params.id);

  if (!issue) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, message: "Issue not found" });
  }

  res.status(StatusCodes.OK).json({ success: true, data: { issue } });
};

export const approveIssue = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const adminId = new Types.ObjectId(req.user!._id);
  const issue = await adminService.approveIssue(req.params.id, adminId);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Issue approved successfully.",
    data: { issue },
  });
};

export const modifyIssue = async (
  req: Request<{ id: string }, {}, ModifyIssueType>,
  res: Response,
) => {
  const adminId = new Types.ObjectId(req.user!._id);
  const issue = await adminService.modifyIssue(
    req.params.id,
    adminId,
    req.body,
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Issue modified and approved successfully.",
    data: { issue },
  });
};

export const rejectIssue = async (
  req: Request<{ id: string }, {}, RejectIssueType>,
  res: Response,
) => {
  const adminId = new Types.ObjectId(req.user!._id);
  const issue = await adminService.rejectIssue(
    req.params.id,
    adminId,
    req.body.reason,
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Issue rejected successfully.",
    data: { issue },
  });
};

export const assignStaff = async (
  req: Request<{ id: string }, {}, AssignStaffType>,
  res: Response,
) => {
  const adminId = new Types.ObjectId(req.user!._id);
  const issue = await adminService.assignStaff(
    req.params.id,
    adminId,
    req.body.staffId,
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Staff assigned successfully.",
    data: { issue },
  });
};

export const getIssueDuplicates = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const duplicates = await adminService.getIssueDuplicates(req.params.id);

  res.status(StatusCodes.OK).json({ success: true, data: { duplicates } });
};

export const getStaffByDepartment = async (
  req: Request<{ department: KNUST_DEPARTMENTS }>,
  res: Response,
) => {
  try {
    const { department } = req.params;
    const staffMembers = await adminService.getStaffByDepartment(department);

    res.status(StatusCodes.OK).json({
      success: true,
      data: staffMembers,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message || "Failed to fetch staff members",
    });
  }
};
