import { Router } from "express";
import rateLimit from "express-rate-limit";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validation.middleware";
import { getMe, login, logout, refreshToken, registerTenant } from "./auth.controller";
import { loginSchema, logoutSchema, refreshTokenSchema, registerTenantSchema } from "./auth.validation";

export const authRoutes = Router();

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false
});

const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false
});

authRoutes.post("/register", registerLimiter, validate(registerTenantSchema), registerTenant);
authRoutes.post("/login", loginLimiter, validate(loginSchema), login);
authRoutes.post("/refresh", refreshLimiter, validate(refreshTokenSchema), refreshToken);
authRoutes.post("/logout", validate(logoutSchema), logout);
authRoutes.get("/me", authMiddleware, getMe);
