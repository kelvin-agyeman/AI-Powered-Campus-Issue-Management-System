import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
    const { data, error } = await resend.emails.send({
      from: "Campus Issue Management System <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error("Failed to send email:", error);
      return null;
    }

    console.log("Email sent successfully:", data);
    return data;
  } catch (error) {
    console.error("Email configuration exception:", error);
    return null;
  }
};
