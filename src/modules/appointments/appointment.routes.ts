import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validation.middleware";
import {
  approveAppointment,
  cancelAppointment,
  completeAppointment,
  createAppointment,
  declineAppointment,
  getAppointmentById,
  getAvailability,
  listAppointments
} from "./appointment.controller";
import {
  appointmentIdSchema,
  availabilitySchema,
  createAppointmentSchema,
  listAppointmentsSchema,
  updateAppointmentStatusSchema
} from "./appointment.validation";

export const appointmentRoutes = Router();

appointmentRoutes.use(requireAuth);

appointmentRoutes.get("/availability", validate(availabilitySchema), getAvailability);
appointmentRoutes.post("/", validate(createAppointmentSchema), createAppointment);
appointmentRoutes.get("/", validate(listAppointmentsSchema), listAppointments);
appointmentRoutes.get("/:id", validate(appointmentIdSchema), getAppointmentById);
appointmentRoutes.patch("/:id/approve", validate(updateAppointmentStatusSchema), approveAppointment);
appointmentRoutes.patch("/:id/decline", validate(updateAppointmentStatusSchema), declineAppointment);
appointmentRoutes.patch("/:id/cancel", validate(updateAppointmentStatusSchema), cancelAppointment);
appointmentRoutes.patch("/:id/complete", validate(updateAppointmentStatusSchema), completeAppointment);
