import { smtpTransport } from "../config/smtp";
import { env } from "../config/env";
import { NotificationType } from "@prisma/client";

type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export type EmailTemplateInput = {
  type: NotificationType;
  title: string;
  message: string;
};

const templateSubjects: Partial<Record<NotificationType, string>> = {
  [NotificationType.ACCOUNT_APPROVAL]: "Your DECA Sentrio account was approved",
  [NotificationType.ACCOUNT_REJECTED]: "Your DECA Sentrio account registration was rejected",
  [NotificationType.CONCERN_ASSIGNED]: "A concern has been assigned",
  [NotificationType.CONCERN_RESOLVED]: "Your concern has been resolved",
  [NotificationType.APPOINTMENT_APPROVED]: "Your appointment was approved",
  [NotificationType.APPOINTMENT_DECLINED]: "Your appointment was declined"
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

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

  buildNotificationEmail(input: EmailTemplateInput) {
    const subject = templateSubjects[input.type] ?? input.title;
    const safeTitle = escapeHtml(input.title);
    const safeMessage = escapeHtml(input.message);

    return {
      subject,
      text: `${input.title}\n\n${input.message}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111827;">
          <h2>${safeTitle}</h2>
          <p>${safeMessage}</p>
          <p style="color: #6b7280; font-size: 12px;">DECA Sentrio</p>
        </div>
      `
    };
  }
}

export const emailService = new EmailService();
