import { z } from "zod";

const idParamsSchema = z.object({
  id: z.string().uuid("Valid notification id is required.")
});

export const listNotificationsSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    unreadOnly: z.coerce.boolean().optional()
  })
});

export const notificationIdSchema = z.object({
  body: z.object({}).optional(),
  params: idParamsSchema,
  query: z.object({}).optional()
});

export const emptyNotificationSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export type ListNotificationsQuery = z.infer<typeof listNotificationsSchema>["query"];
