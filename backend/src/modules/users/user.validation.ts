import { Role, UserStatus } from "@prisma/client";
import { z } from "zod";

const idParamsSchema = z.object({
  id: z.string().uuid("Valid user id is required.")
});

const userStatusFilterSchema = z.enum([
  UserStatus.PENDING,
  UserStatus.APPROVED,
  UserStatus.REJECTED,
  UserStatus.SUSPENDED
]);

export const listUsersSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    role: z.literal(Role.TENANT).optional(),
    status: userStatusFilterSchema.optional(),
    search: z.string().trim().max(100, "Search must not exceed 100 characters.").optional()
  })
});

export const userIdSchema = z.object({
  body: z.object({}).optional(),
  params: idParamsSchema,
  query: z.object({}).optional()
});

export type ListUsersQuery = z.infer<typeof listUsersSchema>["query"];
