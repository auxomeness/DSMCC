import { ConcernCategory, ConcernStatus, ConcernVisibility } from "@prisma/client";
import { z } from "zod";

const idParamsSchema = z.object({
  id: z.string().uuid("Valid concern id is required.")
});

const remarksSchema = z.object({
  remarks: z.string().trim().min(1, "Remarks are required.")
});

export const createConcernSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, "Title is required."),
    category: z.nativeEnum(ConcernCategory),
    description: z.string().trim().min(1, "Description is required."),
    officeId: z.string().uuid("Valid office id is required."),
    floor: z.string().trim().min(1, "Floor is required."),
    unitNumber: z.string().trim().min(1, "Unit number is required."),
    locationDescription: z.string().trim().min(1, "Location description is required."),
    preferredSchedule: z.coerce.date(),
    visibility: z.nativeEnum(ConcernVisibility).optional(),
    imageUrl: z.string().trim().optional()
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const listConcernsSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    status: z.nativeEnum(ConcernStatus).optional(),
    visibility: z.nativeEnum(ConcernVisibility).optional(),
    officeId: z.string().uuid().optional()
  })
});

export const concernIdSchema = z.object({
  body: z.object({}).optional(),
  params: idParamsSchema,
  query: z.object({}).optional()
});

export const optionalRemarksSchema = z.object({
  body: z.object({
    remarks: z.string().trim().optional()
  }),
  params: idParamsSchema,
  query: z.object({}).optional()
});

export const requiredRemarksSchema = z.object({
  body: remarksSchema,
  params: idParamsSchema,
  query: z.object({}).optional()
});

export const assignConcernSchema = z.object({
  body: z.object({
    assignedStaffId: z.string().uuid("Valid assigned staff id is required."),
    remarks: z.string().trim().optional()
  }),
  params: idParamsSchema,
  query: z.object({}).optional()
});

export type CreateConcernInput = z.infer<typeof createConcernSchema>["body"];
export type ListConcernsQuery = z.infer<typeof listConcernsSchema>["query"];
export type RemarksInput = z.infer<typeof optionalRemarksSchema>["body"];
export type RequiredRemarksInput = z.infer<typeof requiredRemarksSchema>["body"];
export type AssignConcernInput = z.infer<typeof assignConcernSchema>["body"];
