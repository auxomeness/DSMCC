import { z } from "zod";

const idParamsSchema = z.object({
  id: z.string().uuid("Valid office id is required.")
});

export const createOfficeSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Office name is required."),
    description: z.string().trim().optional(),
    officeHours: z.string().trim().optional(),
    officeStartTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Start time must use HH:mm format.").optional(),
    officeEndTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "End time must use HH:mm format.").optional(),
    slotDurationMin: z.number().int().positive().optional(),
    isActive: z.boolean().optional()
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const updateOfficeSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(1).optional(),
      description: z.string().trim().nullable().optional(),
      officeHours: z.string().trim().nullable().optional(),
      officeStartTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).nullable().optional(),
      officeEndTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).nullable().optional(),
      slotDurationMin: z.number().int().positive().optional(),
      isActive: z.boolean().optional()
    })
    .refine((value) => Object.keys(value).length > 0, "At least one field is required."),
  params: idParamsSchema,
  query: z.object({}).optional()
});

export const officeIdSchema = z.object({
  body: z.object({}).optional(),
  params: idParamsSchema,
  query: z.object({}).optional()
});

export const listOfficesSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    search: z.string().trim().optional(),
    includeInactive: z.coerce.boolean().optional()
  })
});

export type CreateOfficeInput = z.infer<typeof createOfficeSchema>["body"];
export type UpdateOfficeInput = z.infer<typeof updateOfficeSchema>["body"];
export type ListOfficesQuery = z.infer<typeof listOfficesSchema>["query"];
