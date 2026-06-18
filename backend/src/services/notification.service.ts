import type { NotificationType, Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/appError";
import { getPagination, type PaginationInput } from "../utils/pagination";

export type CreateNotificationInput = {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
};

export type ListNotificationsInput = PaginationInput & {
  unreadOnly?: boolean;
};

const notificationSelect = {
  id: true,
  userId: true,
  type: true,
  title: true,
  message: true,
  isRead: true,
  createdAt: true,
  updatedAt: true
};

export class NotificationService {
  async createNotification(input: CreateNotificationInput) {
    return prisma.notification.create({
      data: {
        userId: input.userId,
        type: input.type,
        title: input.title,
        message: input.message,
        isRead: false
      },
      select: notificationSelect
    });
  }

  async createNotifications(inputs: CreateNotificationInput[]) {
    if (inputs.length === 0) {
      return [];
    }

    await prisma.notification.createMany({
      data: inputs.map((input) => ({
        userId: input.userId,
        type: input.type,
        title: input.title,
        message: input.message,
        isRead: false
      }))
    });

    return inputs;
  }

  async listNotifications(userId: string, input: ListNotificationsInput) {
    const pagination = getPagination({
      page: input.page,
      limit: input.limit ?? 20
    });

    const where: Prisma.NotificationWhereInput = {
      userId,
      deletedAt: null,
      ...(input.unreadOnly ? { isRead: false } : {})
    };

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: pagination.skip,
        take: pagination.take,
        select: notificationSelect
      }),
      prisma.notification.count({ where })
    ]);

    return {
      notifications,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit)
      }
    };
  }

  async getUnreadCount(userId: string) {
    return prisma.notification.count({
      where: {
        userId,
        isRead: false,
        deletedAt: null
      }
    });
  }

  async markAsRead(userId: string, notificationId: string) {
    const result = await prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId,
        deletedAt: null
      },
      data: { isRead: true }
    });

    if (result.count === 0) {
      throw new AppError("Notification was not found.", 404);
    }

    return prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
        deletedAt: null
      },
      select: notificationSelect
    });
  }

  async markAllAsRead(userId: string) {
    const result = await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
        deletedAt: null
      },
      data: { isRead: true }
    });

    return { updatedCount: result.count };
  }
}

export const notificationService = new NotificationService();
