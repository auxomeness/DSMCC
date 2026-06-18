import { Role } from "@prisma/client";
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { validate } from "../../middleware/validation.middleware";
import { createFeedback, deleteFeedback, getFeedbackById, listFeedbacks } from "./feedback.controller";
import { createFeedbackSchema, feedbackIdSchema, listFeedbacksSchema } from "./feedback.validation";

export const feedbackRoutes = Router();

const feedbackSubmitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many feedback submissions. Please try again later.",
    errors: []
  }
});

feedbackRoutes.post("/", feedbackSubmitLimiter, validate(createFeedbackSchema), createFeedback);

feedbackRoutes.use("/admin", requireAuth, requireRole([Role.ADMIN]));
feedbackRoutes.get("/admin", validate(listFeedbacksSchema), listFeedbacks);
feedbackRoutes.get("/admin/:id", validate(feedbackIdSchema), getFeedbackById);
feedbackRoutes.delete("/admin/:id", validate(feedbackIdSchema), deleteFeedback);
