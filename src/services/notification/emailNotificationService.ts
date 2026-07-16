import { sendEmail } from "../../services/email/emailConfig";

export const sendIssueApprovedEmail = async (
  email: string,
  name: string,
  issueTitle: string,
) => {
  await sendEmail({
    to: email,
    subject: "Issue Approved",
    html: `
      <h2>Hello ${name},</h2>
      <p>Your issue regarding <strong>"${issueTitle}"</strong> has been <strong>approved</strong> by the admin and is ready for further action.</p>
      <p>Thank you for your patience.</p>
    `,
  });
};

export const sendIssueRejectedEmail = async (
  email: string,
  name: string,
  issueTitle: string,
  reason: string,
) => {
  await sendEmail({
    to: email,
    subject: "Issue Rejected",
    html: `
      <h2>Hello ${name},</h2>
      <p>Your issue regarding <strong>"${issueTitle}"</strong> has been <strong>rejected</strong> by the admin.</p>
      <p><strong>Reason for rejection:</strong></p>
      <p style="background-color: #f8f9fa; padding: 10px; border-left: 4px solid #dc3545;">${reason}</p>
      <p>Thank you for your patience.</p>
    `,
  });
};

export const sendIssueAssignedEmail = async (
  email: string,
  name: string,
  issueTitle: string,
  staffName: string,
) => {
  await sendEmail({
    to: email,
    subject: "Issue Assigned",
    html: `
      <h2>Hello ${name},</h2>
      <p>Your issue regarding <strong>"${issueTitle}"</strong> has been assigned to <strong>${staffName}</strong>.</p>
      <p>They will be working on it shortly.</p>
    `,
  });
};

export const sendIssueResolvedEmail = async (
  email: string,
  name: string,
  issueTitle: string,
) => {
  await sendEmail({
    to: email,
    subject: "Issue Resolved",
    html: `
      <h2>Hello ${name},</h2>
      <p>Great news! Your issue regarding <strong>"${issueTitle}"</strong> has been <strong>resolved</strong>.</p>
      <p>Thank you for using the system.</p>
    `,
  });
};
