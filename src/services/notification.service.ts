import type { NotificationType } from "@prisma/client";

export type CreateNotificationInput = {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
};

export class NotificationService {
  async createNotification(_input: CreateNotificationInput) {
    throw new Error("Notification persistence will be implemented in Phase 10.");
  }
}

export const notificationService = new NotificationService();
