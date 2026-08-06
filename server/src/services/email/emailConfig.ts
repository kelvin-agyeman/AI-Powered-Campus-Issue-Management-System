import dns from "dns";
import nodemailer from "nodemailer";

dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
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
