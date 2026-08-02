import { Types } from "mongoose";
import Notification from "../../models/Notification";
import User from "../../models/User";
import { NOTIFICATION_TYPES } from "../../utils/constants";
import * as emailService from "./emailNotificationService";

const createNotification = async (
  recipientId: string | Types.ObjectId,
  title: string,
  message: string,
  type: string,
  relatedIssue?: string,
) => {
  return await Notification.create({
    recipient: recipientId,
    title,
    message,
    type,
    relatedIssue,
  });
};

export const notifyIssueApproved = async (user: any, issue: any) => {
  const issueTitle = issue.aiRecommendation?.title || "Reported Issue";

  await createNotification(
    user._id,
    "Issue Approved",
    `Your issue "${issueTitle}" has been approved.`,
    NOTIFICATION_TYPES.ISSUE_APPROVED,
    issue._id,
  );

  await emailService.sendIssueApprovedEmail(
    user.email,
    user.fullName,
    issueTitle,
  );
};

export const notifyIssueRejected = async (user: any, issue: any) => {
  const issueTitle = issue.aiRecommendation?.title || "Reported Issue";
  const reason = issue.rejectionReason || "No specific reason provided.";

  await createNotification(
    user._id,
    "Issue Rejected",
    `Your issue "${issueTitle}" was rejected. Reason: ${reason}`,
    NOTIFICATION_TYPES.ISSUE_REJECTED,
    issue._id,
  );

  await emailService.sendIssueRejectedEmail(
    user.email,
    user.fullName,
    issueTitle,
    reason,
  );
};

export const notifyIssueAssigned = async (
  user: any,
  issue: any,
  staffName: string,
) => {
  const issueTitle = issue.aiRecommendation?.title || "Reported Issue";

  const isAssignedStaff = String(user._id) === String(issue.assignedStaff);

  const title = "Issue Assigned";

  const message = isAssignedStaff
    ? `The issue "${issueTitle}" has been assigned to you.`
    : `Your reported issue "${issueTitle}" has been assigned to ${staffName}.`;

  await createNotification(
    user._id,
    title,
    message,
    NOTIFICATION_TYPES.ISSUE_ASSIGNED,
    issue._id,
  );

  await emailService.sendIssueAssignedEmail(
    user.email,
    user.fullName,
    issueTitle,
    staffName,
    isAssignedStaff,
  );
};

export const notifyAssignmentAccepted = async (issue: any, staffId: any) => {
  const issueTitle = issue.aiRecommendation?.title || "Reported Issue";

  const admin = await User.findById(issue.assignedBy);
  const staff = await User.findById(staffId);

  if (!admin || !staff) return;

  if (!admin.email) return;

  await createNotification(
    admin._id,
    "Work Commenced",
    `${staff.fullName} has started working on the issue: "${issueTitle}".`,
    NOTIFICATION_TYPES.ISSUE_IN_PROGRESS || "ISSUE_IN_PROGRESS",
    issue._id,
  );

  await emailService.sendAssignmentAcceptedEmail(
    admin.email,
    admin.fullName,
    issueTitle,
    staff.fullName,
  );
};

export const notifyIssueResolved = async (user: any, issue: any) => {
  const issueTitle = issue.aiRecommendation?.title || "Reported Issue";

  await createNotification(
    user._id,
    "Issue Resolved",
    `Your issue "${issueTitle}" has been successfully resolved.`,
    NOTIFICATION_TYPES.ISSUE_RESOLVED,
    issue._id,
  );

  await emailService.sendIssueResolvedEmail(
    user.email,
    user.fullName,
    issueTitle,
  );
};

// --- NEW NOTIFICATION HANDLERS ---

export const notifyEditRequestApproved = async (
  user: any,
  newInstitutionId: string,
) => {
  await createNotification(
    user._id,
    "ID Update Approved",
    `Your request to change your ID to ${newInstitutionId} has been approved.`,
    "EDIT_REQUEST_APPROVED",
  );

  await emailService.sendEditRequestApprovedEmail(
    user.email,
    user.fullName,
    newInstitutionId,
  );
};

export const notifyEditRequestRejected = async (user: any, request: any) => {
  const reason = request.reason || "No specific reason provided.";

  await createNotification(
    user._id,
    "ID Update Rejected",
    `Your request to update your ID has been rejected.`,
    "EDIT_REQUEST_REJECTED",
  );

  await emailService.sendEditRequestRejectedEmail(
    user.email,
    user.fullName,
    reason,
  );
};

export const notifyAdminUserCreated = async (user: any) => {
  await createNotification(
    user._id,
    "Welcome to the System",
    "Your admin account has been created. Please set up your password.",
    "ACCOUNT_CREATED",
  );

  await emailService.sendAdminCreatedEmail(user.email, user.fullName);
};

export const notifyStaffUserCreated = async (user: any) => {
  await createNotification(
    user._id,
    "Welcome to the System",
    "Your staff account has been created. Please set up your password.",
    "ACCOUNT_CREATED",
  );

  await emailService.sendStaffCreatedEmail(user.email, user.fullName);
};

export const sendSystemBroadcast = async (broadcastData: {
  title: string;
  message: string;
  targetAudience: "all" | "students" | "staff" | "admins";
}) => {
  const { title, message, targetAudience } = broadcastData;
  const query: any = { isActive: true, role: { $ne: "super_admin" } };

  if (targetAudience !== "all") {
    const roleMap: Record<string, string> = {
      students: "student",
      staff: "staff",
      admins: "admin",
    };
    query.role = roleMap[targetAudience];
  }

  // Ensure we grab the email alongside the ID for our email service
  const users = await User.find(query).select("_id email");

  if (users.length === 0) return;

  const notifications = users.map((user) => ({
    recipient: user._id,
    title,
    message,
    type: NOTIFICATION_TYPES.SYSTEM_BROADCAST || "SYSTEM_BROADCAST",
  }));

  // Create in-app notifications in bulk
  await Notification.insertMany(notifications);

  // Send broadcast emails concurrently
  // (Using Promise.all allows Node.js to fire these off efficiently)
  await Promise.all(
    users.map((user) => {
      if (!user.email) return Promise.resolve();

      return emailService.sendBroadcastEmail(user.email, title, message);
    }),
  );
};

export const notifyProgressUpdated = async (
  issue: any,
  staff: any,
  note: string,
) => {
  const issueTitle = issue.aiRecommendation?.title || "Reported Issue";

  // Find the admin who assigned the issue to notify them
  const admin = await User.findById(issue.assignedBy);
  if (!admin) return;

  if (!admin.email) return;

  await createNotification(
    admin._id,
    "Progress Update",
    `${staff.fullName} updated progress on "${issueTitle}".`,
    "PROGRESS_UPDATE",
    issue._id,
  );

  await emailService.sendProgressUpdatedEmail(
    admin.email,
    admin.fullName,
    issueTitle,
    staff.fullName,
    note,
  );
};
