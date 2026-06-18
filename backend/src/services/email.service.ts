import { smtpTransport } from "../config/smtp";
import { env } from "../config/env";

type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export class EmailService {
  async sendEmail(input: SendEmailInput) {
    return smtpTransport.sendMail({
      from: env.SMTP_FROM,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html
    });
  }
}

export const emailService = new EmailService();
