import { Resend } from "resend";

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { data, error } = await resend.emails.send({
      from: "Campus Issue Management System <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    });
    if (error) {
      return console.error({ error });
    } else {
      console.log(data);
    }
  } catch (error) {
    console.error(error);
  }
};
