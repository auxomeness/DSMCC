import { Role } from "@prisma/client";
import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { validate } from "../../middleware/validation.middleware";
import {
  approveTenant,
  getUserById,
  listUsers,
  reactivateTenant,
  rejectTenant,
  suspendTenant
} from "./user.controller";
import { listUsersSchema, userIdSchema } from "./user.validation";

export const userRoutes = Router();

userRoutes.use(requireAuth, requireRole([Role.ADMIN]));

userRoutes.get("/", validate(listUsersSchema), listUsers);
userRoutes.get("/:id", validate(userIdSchema), getUserById);
userRoutes.patch("/:id/approve", validate(userIdSchema), approveTenant);
userRoutes.patch("/:id/reject", validate(userIdSchema), rejectTenant);
userRoutes.patch("/:id/suspend", validate(userIdSchema), suspendTenant);
userRoutes.patch("/:id/reactivate", validate(userIdSchema), reactivateTenant);
