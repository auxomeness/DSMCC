import { Role } from "@prisma/client";
import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { validate } from "../../middleware/validation.middleware";
import { createStaff, deleteStaff, getStaffById, listStaff, updateStaff } from "./staff.controller";
import { createStaffSchema, listStaffSchema, staffIdSchema, updateStaffSchema } from "./staff.validation";

export const staffRoutes = Router();

staffRoutes.use(requireAuth, requireRole([Role.ADMIN]));

staffRoutes.post("/", validate(createStaffSchema), createStaff);
staffRoutes.get("/", validate(listStaffSchema), listStaff);
staffRoutes.get("/:id", validate(staffIdSchema), getStaffById);
staffRoutes.patch("/:id", validate(updateStaffSchema), updateStaff);
staffRoutes.delete("/:id", validate(staffIdSchema), deleteStaff);
