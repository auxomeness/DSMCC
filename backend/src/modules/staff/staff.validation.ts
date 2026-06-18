import { z } from "zod";

const idParamsSchema = z.object({
  id: z.string().uuid("Valid staff id is required.")
});

export const createStaffSchema = z.object({
  body: z.object({
    userId: z.string().uuid("Valid user id is required."),
    officeId: z.string().uuid("Valid office id is required."),
    position: z.string().trim().min(1, "Position is required."),
    specialization: z.string().trim().optional(),
    isOfficeHead: z.boolean().optional()
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const updateStaffSchema = z.object({
  body: z
    .object({
      officeId: z.string().uuid("Valid office id is required.").optional(),
      position: z.string().trim().min(1).optional(),
      specialization: z.string().trim().nullable().optional(),
      isOfficeHead: z.boolean().optional()
    })
    .refine((value) => Object.keys(value).length > 0, "At least one field is required."),
  params: idParamsSchema,
  query: z.object({}).optional()
});

export const staffIdSchema = z.object({
  body: z.object({}).optional(),
  params: idParamsSchema,
  query: z.object({}).optional()
});

export const listStaffSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    officeId: z.string().uuid().optional(),
    includeDeleted: z.coerce.boolean().optional()
  })
});

export type CreateStaffInput = z.infer<typeof createStaffSchema>["body"];
export type UpdateStaffInput = z.infer<typeof updateStaffSchema>["body"];
export type ListStaffQuery = z.infer<typeof listStaffSchema>["query"];
