import { AppointmentStatus, ConcernStatus, NotificationType } from "@prisma/client";
import { prisma } from "../config/prisma";
import { emailService } from "./email.service";
import { notificationService, type CreateNotificationInput } from "./notification.service";
import { logger } from "../utils/logger";

type Recipient = {
  id: string;
  email: string;
};

type NotificationPayload = {
  type: NotificationType;
  title: string;
  message: string;
};

const uniqueRecipients = (recipients: Recipient[]) => {
  const seen = new Set<string>();
  return recipients.filter((recipient) => {
    if (seen.has(recipient.id)) {
      return false;
    }

    seen.add(recipient.id);
    return true;
  });
};

const concernTypeMap: Partial<Record<ConcernStatus, NotificationType>> = {
  [ConcernStatus.ACCEPTED]: NotificationType.CONCERN_ACCEPTED,
  [ConcernStatus.REJECTED]: NotificationType.CONCERN_REJECTED,
  [ConcernStatus.ASSIGNED]: NotificationType.CONCERN_ASSIGNED,
  [ConcernStatus.IN_PROGRESS]: NotificationType.CONCERN_UPDATED,
  [ConcernStatus.RESOLVED]: NotificationType.CONCERN_RESOLVED,
  [ConcernStatus.PENDING_TENANT_APPROVAL]: NotificationType.CONCERN_UPDATED,
  [ConcernStatus.REOPENED]: NotificationType.CONCERN_REOPENED,
  [ConcernStatus.CLOSED]: NotificationType.CONCERN_CLOSED
};

const appointmentTypeMap: Partial<Record<AppointmentStatus, NotificationType>> = {
  [AppointmentStatus.APPROVED]: NotificationType.APPOINTMENT_APPROVED,
  [AppointmentStatus.DECLINED]: NotificationType.APPOINTMENT_DECLINED,
  [AppointmentStatus.CANCELLED]: NotificationType.APPOINTMENT_CANCELLED,
  [AppointmentStatus.COMPLETED]: NotificationType.APPOINTMENT_COMPLETED
};

type AccountNotificationType = Extract<
  NotificationType,
  "ACCOUNT_APPROVAL" | "ACCOUNT_REJECTED" | "ACCOUNT_SUSPENDED" | "ACCOUNT_REACTIVATED"
>;

const accountPayloadMap: Record<AccountNotificationType, NotificationPayload> = {
  [NotificationType.ACCOUNT_APPROVAL]: {
    type: NotificationType.ACCOUNT_APPROVAL,
    title: "Account approved",
    message: "Your tenant account has been approved."
  },
  [NotificationType.ACCOUNT_REJECTED]: {
    type: NotificationType.ACCOUNT_REJECTED,
    title: "Account registration rejected",
    message: "Your tenant account registration has been rejected."
  },
  [NotificationType.ACCOUNT_SUSPENDED]: {
    type: NotificationType.ACCOUNT_SUSPENDED,
    title: "Account suspended",
    message: "Your tenant account has been suspended."
  },
  [NotificationType.ACCOUNT_REACTIVATED]: {
    type: NotificationType.ACCOUNT_REACTIVATED,
    title: "Account reactivated",
    message: "Your tenant account has been reactivated."
  }
};

export class NotificationEventService {
  async emitAccountEvent(
    userId: string,
    type: AccountNotificationType
  ) {
    const user = await prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      select: { id: true, email: true }
    });

    if (!user) {
      return;
    }

    await this.createAndDispatch([user], accountPayloadMap[type]);
  }

  async emitConcernStatusChange(concernId: string, _oldStatus: ConcernStatus, newStatus: ConcernStatus) {
    const type = concernTypeMap[newStatus];

    if (!type) {
      return;
    }

    const concern = await prisma.concern.findUnique({
      where: { id: concernId },
      select: {
        concernNumber: true,
        title: true,
        status: true,
        tenant: {
          select: { id: true, email: true }
        },
        assignedStaff: {
          select: {
            user: {
              select: { id: true, email: true }
            }
          }
        },
        office: {
          select: {
            staff: {
              where: {
                isOfficeHead: true,
                deletedAt: null
              },
              select: {
                user: {
                  select: { id: true, email: true }
                }
              }
            }
          }
        }
      }
    });

    if (!concern) {
      return;
    }

    const recipients = uniqueRecipients([
      concern.tenant,
      ...(concern.assignedStaff ? [concern.assignedStaff.user] : []),
      ...concern.office.staff.map((staff) => staff.user)
    ]);

    await this.createAndDispatch(recipients, {
      type,
      title: this.getConcernTitle(type),
      message: `Concern ${concern.concernNumber} (${concern.title}) is now ${concern.status}.`
    });
  }

  async emitAppointmentEvent(appointmentId: string, status: AppointmentStatus) {
    const type = appointmentTypeMap[status];

    if (!type) {
      return;
    }

    const appointment = await prisma.appointment.findFirst({
      where: { id: appointmentId, deletedAt: null },
      select: {
        scheduledAt: true,
        purpose: true,
        status: true,
        tenant: {
          select: { id: true, email: true }
        },
        office: {
          select: {
            name: true,
            staff: {
              where: { deletedAt: null },
              select: {
                user: {
                  select: { id: true, email: true }
                }
              }
            }
          }
        }
      }
    });

    if (!appointment) {
      return;
    }

    const recipients = uniqueRecipients([appointment.tenant, ...appointment.office.staff.map((staff) => staff.user)]);

    await this.createAndDispatch(recipients, {
      type,
      title: this.getAppointmentTitle(type),
      message: `Appointment for ${appointment.purpose} with ${appointment.office.name} on ${appointment.scheduledAt.toISOString()} is ${appointment.status}.`
    });
  }

  private async createAndDispatch(recipients: Recipient[], payload: NotificationPayload) {
    const notifications: CreateNotificationInput[] = recipients.map((recipient) => ({
      userId: recipient.id,
      type: payload.type,
      title: payload.title,
      message: payload.message
    }));

    await notificationService.createNotifications(notifications);
    this.dispatchEmails(recipients, payload);
  }

  private dispatchEmails(recipients: Recipient[], payload: NotificationPayload) {
    void Promise.allSettled(
      recipients.map((recipient) => {
        const email = emailService.buildNotificationEmail(payload);

        return emailService.sendEmail({
          to: recipient.email,
          subject: email.subject,
          text: email.text,
          html: email.html
        });
      })
    ).then((results) => {
      for (const result of results) {
        if (result.status === "rejected") {
          logger.error(result.reason);
        }
      }
    });
  }

  private getConcernTitle(type: NotificationType) {
    switch (type) {
      case NotificationType.CONCERN_ACCEPTED:
        return "Concern accepted";
      case NotificationType.CONCERN_REJECTED:
        return "Concern rejected";
      case NotificationType.CONCERN_ASSIGNED:
        return "Concern assigned";
      case NotificationType.CONCERN_RESOLVED:
        return "Concern resolved";
      case NotificationType.CONCERN_REOPENED:
        return "Concern reopened";
      case NotificationType.CONCERN_CLOSED:
        return "Concern closed";
      default:
        return "Concern updated";
    }
  }

  private getAppointmentTitle(type: NotificationType) {
    switch (type) {
      case NotificationType.APPOINTMENT_APPROVED:
        return "Appointment approved";
      case NotificationType.APPOINTMENT_DECLINED:
        return "Appointment declined";
      case NotificationType.APPOINTMENT_CANCELLED:
        return "Appointment cancelled";
      case NotificationType.APPOINTMENT_COMPLETED:
        return "Appointment completed";
      default:
        return "Appointment updated";
    }
  }
}

export const notificationEventService = new NotificationEventService();
