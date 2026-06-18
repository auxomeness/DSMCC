import { z } from "zod";

const currentYear = new Date().getFullYear();

export const topPublicConcernsSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    limit: z.coerce.number().int().min(1).max(50).default(10)
  })
});

export const trendQuerySchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    year: z.coerce.number().int().min(2020).max(currentYear + 1).default(currentYear)
  })
});

export const emptyDashboardQuerySchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export type TopPublicConcernsQuery = z.infer<typeof topPublicConcernsSchema>["query"];
export type TrendQuery = z.infer<typeof trendQuerySchema>["query"];
