import { Types } from "mongoose";
import Issue from "../../models/Issue";
import User from "../../models/User";
import * as notificationService from "../notification/notificationService";
import { FilterIssuesQuery, ModifyIssueType } from "../../types/admin.types";
import { KNUST_DEPARTMENTS } from "../../types/admin.types";

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

  issue.category = issue.aiRecommendation?.category as any;
  issue.priority = issue.aiRecommendation?.priority as any;
  issue.assignedDepartment = issue.aiRecommendation?.department as any;

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
  staffId: Types.ObjectId, // Bring this back
) => {
  const issue = await Issue.findById(issueId).populate("reportedBy");

  if (!issue) {
    throw new Error("Issue not found");
  }

  if (issue.adminDecision === "rejected") {
    throw new Error("Cannot assign a rejected issue. Please approve it first.");
  }

  const staff = await User.findById(staffId);

  if (!staff || staff.role !== "staff") {
    throw new Error("Valid staff member not found");
  }

  if (issue.adminDecision !== "approved") {
    issue.adminDecision = "approved";
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

export const getIssueDuplicates = async (issueId: string) => {
  const issue = await Issue.findById(issueId).populate(
    "duplicateAnalysis.possibleDuplicateOf",
    "category priority status createdAt description",
  );

  if (!issue) {
    throw new Error("Issue not found");
  }

  return {
    possibleDuplicateOf: issue.duplicateAnalysis?.possibleDuplicateOf || null,
    duplicateScore: issue.duplicateAnalysis?.duplicateScore || null,
    reasoning: issue.duplicateAnalysis?.reasoning || null,
  };
};

export const getStaffByDepartment = async (department: KNUST_DEPARTMENTS) => {
  if (!department) {
    throw new Error("Department is required");
  }

  const staffMembers = await User.find({
    role: "staff",
    department: department,
    isActive: true,
  }).select("fullName email _id");

  return staffMembers;
};
