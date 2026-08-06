import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP connection failed:", error);
  } else {
    console.log("SMTP server ready:", success);
  }
});

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
