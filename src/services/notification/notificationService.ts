import Notification from "../../models/Notification";
import { NOTIFICATION_TYPES } from "../../utils/constants";
import * as emailService from "./emailNotificationService";

const createNotification = async (
  recipientId: string,
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

  await createNotification(
    user._id,
    "Issue Assigned",
    `Your issue "${issueTitle}" has been assigned to ${staffName}.`,
    NOTIFICATION_TYPES.ISSUE_ASSIGNED,
    issue._id,
  );

  await emailService.sendIssueAssignedEmail(
    user.email,
    user.fullName,
    issueTitle,
    staffName,
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
