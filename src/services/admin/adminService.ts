import { Types } from "mongoose";
import Issue from "../../models/Issue";
import User from "../../models/User";
import * as notificationService from "../notification/notificationService";
import {
  AssignStaffType,
  FilterIssuesQuery,
  ModifyIssueType,
} from "../../types/admin.types";

export const getPendingIssues = async () => {
  return Issue.find({
    status: "pending_admin_review",
    isDeleted: false,
  }).sort({
    createdAt: -1,
  });
};

export const getAllIssues = async (filters: FilterIssuesQuery) => {
  const query: any = {
    isDeleted: false,
  };

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.assignedDepartment) {
    query.assignedDepartment = filters.assignedDepartment;
  }

  if (filters.priority) {
    query.priority = filters.priority;
  }

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.reportedBy) {
    query.reportedBy = filters.reportedBy;
  }

  if (filters.assignedStaff) {
    query.assignedStaff = filters.assignedStaff;
  }

  if (filters.aiStatus) {
    query.aiStatus = filters.aiStatus;
  }

  if (filters.adminDecision) {
    query.adminDecision = filters.adminDecision;
  }

  if (filters.date) {
    const start = new Date(filters.date);

    const end = new Date(filters.date);
    end.setDate(end.getDate() + 1);

    query.createdAt = {
      $gte: start,
      $lt: end,
    };
  }

  return Issue.find(query)
    .populate("reportedBy", "fullName email institutionId")
    .populate("assignedStaff", "fullName email")
    .populate("assignedBy", "fullName")
    .populate("reviewedBy", "fullName")
    .sort({
      createdAt: -1,
    });
};

export const getIssueById = async (issueId: string) => {
  return Issue.findById(issueId)
    .populate("reportedBy", "fullName email institutionId")
    .populate("assignedStaff", "fullName email")
    .populate("assignedBy", "fullName")
    .populate("reviewedBy", "fullName");
};

export const approveIssue = async (
  issueId: string,
  adminId: Types.ObjectId,
) => {
  const issue = await Issue.findById(issueId).populate("reportedBy");

  if (!issue) {
    throw new Error("Issue not found");
  }

  issue.adminDecision = "approved";
  issue.status = "approved";
  issue.reviewedBy = adminId;
  issue.reviewedAt = new Date();

  issue.category = issue.aiRecommendation?.category;
  issue.priority = issue.aiRecommendation?.priority;
  issue.assignedDepartment = issue.aiRecommendation?.department;

  await issue.save();

  await notificationService.notifyIssueApproved(issue.reportedBy, issue);

  return issue;
};

export const modifyIssue = async (
  issueId: string,
  adminId: Types.ObjectId,
  updateData: ModifyIssueType,
) => {
  const issue = await Issue.findById(issueId).populate("reportedBy");

  if (!issue) {
    throw new Error("Issue not found");
  }

  issue.adminDecision = "modified";
  issue.status = "approved";
  issue.reviewedBy = adminId;
  issue.reviewedAt = new Date();

  issue.category = updateData.category;
  issue.priority = updateData.priority;
  issue.assignedDepartment = updateData.department;

  await issue.save();

  await notificationService.notifyIssueApproved(issue.reportedBy, issue);

  return issue;
};

export const rejectIssue = async (
  issueId: string,
  adminId: Types.ObjectId,
  reason: string,
) => {
  const issue = await Issue.findById(issueId).populate("reportedBy");

  if (!issue) {
    throw new Error("Issue not found");
  }

  issue.adminDecision = "rejected";
  issue.status = "rejected";
  issue.rejectionReason = reason;
  issue.reviewedBy = adminId;
  issue.reviewedAt = new Date();

  await issue.save();

  await notificationService.notifyIssueRejected(issue.reportedBy, issue);

  return issue;
};

export const assignStaff = async (
  issueId: string,
  adminId: Types.ObjectId,
  staffId: AssignStaffType["staffId"],
) => {
  const issue = await Issue.findById(issueId).populate("reportedBy");

  if (!issue) {
    throw new Error("Issue not found");
  }

  const staff = await User.findById(staffId);

  if (!staff) {
    throw new Error("Staff not found");
  }

  issue.status = "assigned";
  issue.assignedStaff = staffId;
  issue.assignedBy = adminId;
  issue.assignedAt = new Date();

  await issue.save();

  await notificationService.notifyIssueAssigned(
    issue.reportedBy,
    issue,
    staff.fullName,
  );

  return issue;
};
