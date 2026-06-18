import { Role } from "@prisma/client";
import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { validate } from "../../middleware/validation.middleware";
import { createOffice, deleteOffice, getOfficeById, listOffices, updateOffice } from "./office.controller";
import { createOfficeSchema, listOfficesSchema, officeIdSchema, updateOfficeSchema } from "./office.validation";

export const officeRoutes = Router();

officeRoutes.use(requireAuth, requireRole([Role.ADMIN]));

officeRoutes.post("/", validate(createOfficeSchema), createOffice);
officeRoutes.get("/", validate(listOfficesSchema), listOffices);
officeRoutes.get("/:id", validate(officeIdSchema), getOfficeById);
officeRoutes.patch("/:id", validate(updateOfficeSchema), updateOffice);
officeRoutes.delete("/:id", validate(officeIdSchema), deleteOffice);
