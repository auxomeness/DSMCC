import { z } from "zod";

const idParamsSchema = z.object({
  id: z.string().uuid("Valid appointment id is required.")
});

export const createAppointmentSchema = z.object({
  body: z.object({
    officeId: z.string().uuid("Valid office id is required."),
    scheduledAt: z.coerce.date(),
    purpose: z.string().trim().min(1, "Purpose is required.")
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const updateAppointmentStatusSchema = z.object({
  body: z.object({
    remarks: z.string().trim().optional()
  }),
  params: idParamsSchema,
  query: z.object({}).optional()
});

export const appointmentIdSchema = z.object({
  body: z.object({}).optional(),
  params: idParamsSchema,
  query: z.object({}).optional()
});

export const listAppointmentsSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    officeId: z.string().uuid().optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
  })
});

export const availabilitySchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    officeId: z.string().uuid("Valid office id is required."),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must use YYYY-MM-DD format.")
  })
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>["body"];
export type AppointmentStatusInput = z.infer<typeof updateAppointmentStatusSchema>["body"];
export type ListAppointmentsQuery = z.infer<typeof listAppointmentsSchema>["query"];
export type AvailabilityQuery = z.infer<typeof availabilitySchema>["query"];
