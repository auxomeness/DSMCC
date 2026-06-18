import { z } from "zod";

export const registerTenantSchema = z.object({
  body: z.object({
    firstName: z.string().trim().min(1, "First name is required."),
    lastName: z.string().trim().min(1, "Last name is required."),
    email: z.string().trim().email("Valid email is required.").toLowerCase(),
    phoneNumber: z.string().trim().min(1).optional(),
    password: z.string().min(8, "Password must be at least 8 characters."),
    floor: z.string().trim().min(1, "Floor is required."),
    unitNumber: z.string().trim().min(1, "Unit number is required.")
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email("Valid email is required.").toLowerCase(),
    password: z.string().min(1, "Password is required.")
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, "Refresh token is required.")
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const logoutSchema = refreshTokenSchema;

export type RegisterTenantInput = z.infer<typeof registerTenantSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>["body"];
