import { FeedbackType } from "@prisma/client";
import { z } from "zod";

const idParamsSchema = z.object({
  id: z.string().uuid("Valid feedback id is required.")
});

const optionalTrimmedString = (max: number, message: string) =>
  z.preprocess(
    (value) => {
      if (typeof value !== "string") {
        return value;
      }

      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : undefined;
    },
    z.string().max(max, message).optional()
  );

export const createFeedbackSchema = z.object({
  body: z.object({
    name: optionalTrimmedString(100, "Name must not exceed 100 characters."),
    email: z.preprocess(
      (value) => {
        if (typeof value !== "string") {
          return value;
        }

        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : undefined;
      },
      z.string().email("Valid email is required.").optional()
    ),
    type: z.nativeEnum(FeedbackType, {
      errorMap: () => ({ message: "Type must be FEEDBACK or SUGGESTION." })
    }),
    message: z
      .string()
      .trim()
      .min(5, "Message must be at least 5 characters.")
      .max(2000, "Message must not exceed 2000 characters.")
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const listFeedbacksSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    type: z.nativeEnum(FeedbackType).optional(),
    search: optionalTrimmedString(100, "Search must not exceed 100 characters.")
  })
});

export const feedbackIdSchema = z.object({
  body: z.object({}).optional(),
  params: idParamsSchema,
  query: z.object({}).optional()
});

export type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>["body"];
export type ListFeedbacksQuery = z.infer<typeof listFeedbacksSchema>["query"];
