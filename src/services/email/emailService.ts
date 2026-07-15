import { sendEmail } from "./emailConfig";
import resetPasswordEmailHTML from "./resetPasswordEmailHTML";

type VerificationEmailPayload = {
  name: string;
  email: string;
  verificationToken: string;
  origin: string;
  purpose: string;
};

type ResetPasswordPayload = {
  name: string;
  email: string;
  resetPasswordToken: string;
  origin: string;
};

export const sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
  origin,
  purpose,
}: VerificationEmailPayload): Promise<unknown> => {
  const verifyEmail = `${origin}/student/verify-email?token=${verificationToken}&email=${email}`;

  const message = `
    <p>Please confirm your email by clicking on the following link:</p>
    <p><a href="${verifyEmail}">Verify Email</a></p>
  `;

  return sendEmail({
    to: email,
    subject: `Email Confirmation for ${purpose}`,
    html: `<h4>Hello, ${name}</h4>${message}`,
  });
};

export const sendResetPasswordEmail = async ({
  name,
  email,
  resetPasswordToken,
  origin,
}: ResetPasswordPayload): Promise<unknown> => {
  const resetURL = `${origin}/student/reset-password?token=${resetPasswordToken}&email=${email}`;

  return sendEmail({
    to: email,
    subject: "Reset Password",
    html: resetPasswordEmailHTML({ name, resetURL }),
  });
};
