import type { RequestHandler } from "express";
import { notificationService } from "../../services/notification.service";
import { successResponse } from "../../utils/response";

export const listNotifications: RequestHandler = async (req, res, next) => {
  try {
    const result = await notificationService.listNotifications(req.user!.id, req.query);
    res.status(200).json({
      ...successResponse("Notifications retrieved successfully", result.notifications),
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

export const getUnreadCount: RequestHandler = async (req, res, next) => {
  try {
    const unreadCount = await notificationService.getUnreadCount(req.user!.id);
    res.status(200).json(successResponse("Unread notification count retrieved successfully", { unreadCount }));
  } catch (error) {
    next(error);
  }
};

export const markNotificationAsRead: RequestHandler = async (req, res, next) => {
  try {
    const notification = await notificationService.markAsRead(req.user!.id, req.params.id);
    res.status(200).json(successResponse("Notification marked as read", { notification }));
  } catch (error) {
    next(error);
  }
};

export const markAllNotificationsAsRead: RequestHandler = async (req, res, next) => {
  try {
    const result = await notificationService.markAllAsRead(req.user!.id);
    res.status(200).json(successResponse("Notifications marked as read", result));
  } catch (error) {
    next(error);
  }
};
