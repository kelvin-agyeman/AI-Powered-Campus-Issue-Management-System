import Issue from "../../models/Issue";
import User from "../../models/User";
import { Types } from "mongoose";
import {
  UpdateProgressInput,
  ResolveIssueInput,
} from "../../types/staff.types";
import * as notificationService from "../notification/notificationService";

export const getAssignedIssues = async (
  staffId: Types.ObjectId,
  filters: any,
) => {
  const query: any = {
    assignedStaff: staffId,
    isDeleted: false,
  };

  if (filters.status) query.status = filters.status;
  if (filters.priority) query.priority = filters.priority;
  if (filters.category) query.category = filters.category;

  return await Issue.find(query)
    .populate("reportedBy", "fullName email institutionId")
    .sort({ createdAt: -1 });
};

export const getAssignedIssueById = async (
  issueId: string | string[],
  staffId: Types.ObjectId,
) => {
  return await Issue.findOne({
    _id: issueId,
    assignedStaff: staffId,
    isDeleted: false,
  }).populate("reportedBy", "fullName email institutionId");
};

export const acceptAssignment = async (
  issueId: string | string[],
  staffId: Types.ObjectId,
) => {
  const issue = await Issue.findOne({
    _id: issueId,
    assignedStaff: staffId,
    isDeleted: false,
  }).populate("reportedBy", "fullName email");

  if (!issue) {
    throw new Error("Issue not found or not assigned to you");
  }

  if (issue.status === "in_progress") {
    throw new Error("This issue assignment has already been accepted");
  }

  issue.status = "in_progress";

  issue.acceptedAt = new Date();

  issue.progressUpdates.push({
    note: "Assignment accepted. Work has commenced.",
    status: "in_progress",
    updatedBy: staffId,
    createdAt: new Date(),
  } as any);

  await issue.save();

  await notificationService.notifyAssignmentAccepted(issue, staffId);

  return issue;
};

export const updateProgress = async (
  issueId: string | string[],
  staffId: Types.ObjectId,
  data: UpdateProgressInput,
) => {
  const issue = await Issue.findOne({
    _id: issueId,
    assignedStaff: staffId,
    isDeleted: false,
  });

  if (!issue) {
    throw new Error("Issue not found or not assigned to you");
  }

  if (issue.isResolved) {
    throw new Error("Cannot update progress on a resolved issue");
  }

  if (data.status) {
    issue.status = data.status;
  }

  issue.progressUpdates.push({
    note: data.note,
    status: data.status || issue.status,
    updatedBy: staffId,
    createdAt: new Date(),
  } as any);

  await issue.save();

  const staff = await User.findById(staffId);
  if (staff) {
    await notificationService.notifyProgressUpdated(issue, staff, data.note);
  }

  return issue;
};

export const resolveIssue = async (
  issueId: string | string[],
  staffId: Types.ObjectId,
  data: ResolveIssueInput,
) => {
  const issue = await Issue.findOne({
    _id: issueId,
    assignedStaff: staffId,
    isDeleted: false,
  }).populate("reportedBy", "fullName email");

  if (!issue) {
    throw new Error("Issue not found or not assigned to you");
  }

  if (issue.isResolved) {
    throw new Error("Issue is already resolved");
  }

  issue.status = "resolved";
  issue.isResolved = true;
  issue.resolvedBy = staffId;
  issue.resolvedAt = new Date();
  issue.resolutionNotes = data.resolutionNotes;

  if (data.resolutionImages && data.resolutionImages.length > 0) {
    issue.resolutionImages = data.resolutionImages as any;
  }

  issue.progressUpdates.push({
    note: `Issue resolved: ${data.resolutionNotes}`,
    status: "resolved",
    updatedBy: staffId,
    createdAt: new Date(),
  } as any);

  await issue.save();

  await notificationService.notifyIssueResolved(issue.reportedBy, issue);

  return issue;
};

export const reopenIssue = async (
  issueId: string | string[],
  staffId: Types.ObjectId,
) => {
  const issue = await Issue.findOne({
    _id: issueId,
    assignedStaff: staffId,
    isDeleted: false,
  });

  if (!issue) {
    throw new Error("Issue not found or not assigned to you");
  }

  if (!issue.isResolved) {
    throw new Error("Issue is not currently resolved");
  }

  issue.status = "in_progress";
  issue.isResolved = false;
  issue.resolvedBy = undefined;
  issue.resolvedAt = undefined;

  issue.progressUpdates.push({
    note: "Issue reopened by staff.",
    status: "in_progress",
    updatedBy: staffId,
    createdAt: new Date(),
  } as any);

  await issue.save();
  return issue;
};
