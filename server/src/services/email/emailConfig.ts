import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  family: 4,
  pool: true,
  maxConnections: 5,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
} as SMTPTransport.Options);

export type SendEmailPayload = {
  to: string;
  subject: string;
  html: string;
};

export const sendEmail = async ({
  to,
  subject,
  html,
}: SendEmailPayload): Promise<unknown> => {
  try {
    const info = await transporter.sendMail({
      from: `"Campus Issue Management System" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully! Message ID:", info.messageId);
    return info;
  } catch (error) {
    console.error("Email configuration exception:", error);
    return null;
  }
};
