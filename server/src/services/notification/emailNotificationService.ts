import { sendEmail } from "../email/emailConfig";

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
  isAssignedStaff: boolean,
) => {
  await sendEmail({
    to: email,
    subject: "Issue Assigned",
    html: isAssignedStaff
      ? `
        <h2>Hello ${name},</h2>
        <p>The issue <strong>"${issueTitle}"</strong> has been assigned to you.</p>
        <p>Please review the issue and begin working on it as soon as possible.</p>
      `
      : `
        <h2>Hello ${name},</h2>
        <p>Your reported issue <strong>"${issueTitle}"</strong> has been assigned to <strong>${staffName}</strong>.</p>
        <p>They will begin working on it shortly.</p>
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

// --- NEW FUNCTIONS BELOW ---

export const sendEditRequestApprovedEmail = async (
  email: string,
  name: string,
  newInstitutionId: string,
) => {
  await sendEmail({
    to: email,
    subject: "ID Update Request Approved",
    html: `
      <h2>Hello ${name},</h2>
      <p>Your request to update your Institution ID has been <strong>approved</strong>.</p>
      <p>Your new ID is: <strong>${newInstitutionId}</strong></p>
      <p>You can now use this ID for future logins and activities within the system.</p>
    `,
  });
};

export const sendEditRequestRejectedEmail = async (
  email: string,
  name: string,
  reason: string,
) => {
  await sendEmail({
    to: email,
    subject: "ID Update Request Rejected",
    html: `
      <h2>Hello ${name},</h2>
      <p>Unfortunately, your request to update your Institution ID has been <strong>rejected</strong> by the system administrators.</p>
      <p><strong>Reason for rejection:</strong></p>
      <p style="background-color: #f8f9fa; padding: 10px; border-left: 4px solid #dc3545;">${reason}</p>
      <p>If you believe this is a mistake, please reach out to the administrative office for further clarification.</p>
    `,
  });
};

export const sendAssignmentAcceptedEmail = async (
  email: string,
  name: string,
  issueTitle: string,
  staffName: string,
) => {
  await sendEmail({
    to: email,
    subject: "Work Commenced on Assigned Issue",
    html: `
      <h2>Hello ${name},</h2>
      <p><strong>${staffName}</strong> has accepted the assigned issue and has begun working on it.</p>
      <p><strong>Issue:</strong> "${issueTitle}"</p>
      <p>You can monitor the progress through the admin dashboard as updates are submitted.</p>
    `,
  });
};

export const sendAdminCreatedEmail = async (email: string, name: string) => {
  await sendEmail({
    to: email,
    subject: "Welcome! Your Admin Account Has Been Created",
    html: `
      <h2>Hello ${name},</h2>
      <p>An administrator account has been provisioned for you.</p>
      <p><strong>Important Next Step:</strong> Before you can log in, you must set your password.</p>
      <p>Please navigate to the login page and use the <strong>"Forgot Password"</strong> route with this email address (${email}) to establish your secure password.</p>
      <p>Welcome to the team!</p>
    `,
  });
};

export const sendStaffCreatedEmail = async (email: string, name: string) => {
  await sendEmail({
    to: email,
    subject: "Welcome! Your Staff Account Has Been Created",
    html: `
      <h2>Hello ${name},</h2>
      <p>A maintenance staff account has been provisioned for you.</p>
      <p><strong>Important Next Step:</strong> Before you can access your dashboard and receive issue assignments, you must set your password.</p>
      <p>Please navigate to the login page and use the <strong>"Forgot Password"</strong> route with this email address (${email}) to establish your secure password.</p>
      <p>Welcome to the team!</p>
    `,
  });
};

export const sendBroadcastEmail = async (
  email: string,
  title: string,
  message: string,
) => {
  await sendEmail({
    to: email,
    subject: `System Broadcast: ${title}`,
    html: `
      <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; font-family: sans-serif;">
        <h2 style="color: #4a0400; margin-top: 0;">${title}</h2>
        <p style="color: #333; line-height: 1.6;">${message}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #888;">This is an automated system broadcast. Please do not reply directly to this email.</p>
      </div>
    `,
  });
};

export const sendProgressUpdatedEmail = async (
  email: string,
  name: string,
  issueTitle: string,
  staffName: string,
  note: string,
) => {
  await sendEmail({
    to: email,
    subject: "New Issue Progress Update",
    html: `
      <h2>Hello ${name},</h2>
      <p><strong>${staffName}</strong> has posted a new progress update for the issue: <strong>"${issueTitle}"</strong>.</p>
      <p><strong>Update Note:</strong></p>
      <p style="background-color: #f8f9fa; padding: 10px; border-left: 4px solid #10B981;">${note}</p>
      <p>Please log in to your dashboard to view the full progress timeline.</p>
    `,
  });
};
