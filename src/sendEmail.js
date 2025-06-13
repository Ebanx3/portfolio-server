import { Resend } from "resend";
import { envs } from "./environmentVariables.js";

const resend = new Resend(envs.EMAIL_PASSWORD);

export const sendEmail = async ({html, from, to, subject}) => {
  const { data, error } = await resend.emails.send({
    from: `${from} <${envs.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
  if (error) {
    console.log(error);
    return false;
  }
  return true;
};
