import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validation.middleware";
import {
  getUnreadCount,
  listNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead
} from "./notification.controller";
import { emptyNotificationSchema, listNotificationsSchema, notificationIdSchema } from "./notification.validation";

export const notificationRoutes = Router();

notificationRoutes.use(requireAuth);

notificationRoutes.get("/", validate(listNotificationsSchema), listNotifications);
notificationRoutes.get("/unread-count", validate(emptyNotificationSchema), getUnreadCount);
notificationRoutes.patch("/read-all", validate(emptyNotificationSchema), markAllNotificationsAsRead);
notificationRoutes.patch("/:id/read", validate(notificationIdSchema), markNotificationAsRead);
