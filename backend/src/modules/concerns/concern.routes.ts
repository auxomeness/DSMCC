import { Role } from "@prisma/client";
import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { validate } from "../../middleware/validation.middleware";
import {
  acceptConcern,
  approveResolution,
  assignConcern,
  createConcern,
  getAllowedTransitions,
  getConcernById,
  getConcernHistory,
  getConcernVoteCount,
  listConcerns,
  reassignConcern,
  rejectConcern,
  reopenConcern,
  resolveConcern,
  startConcern,
  toggleConcernVote
} from "./concern.controller";
import {
  assignConcernSchema,
  concernIdSchema,
  createConcernSchema,
  listConcernsSchema,
  optionalRemarksSchema,
  requiredRemarksSchema
} from "./concern.validation";

export const concernRoutes = Router();

concernRoutes.use(requireAuth);

concernRoutes.post("/", requireRole([Role.TENANT]), validate(createConcernSchema), createConcern);
concernRoutes.get("/", validate(listConcernsSchema), listConcerns);
concernRoutes.get("/:id", validate(concernIdSchema), getConcernById);
concernRoutes.get("/:id/history", validate(concernIdSchema), getConcernHistory);
concernRoutes.get("/:id/allowed-transitions", validate(concernIdSchema), getAllowedTransitions);
concernRoutes.post("/:id/vote", requireRole([Role.TENANT]), validate(concernIdSchema), toggleConcernVote);
concernRoutes.get("/:id/votes", validate(concernIdSchema), getConcernVoteCount);
concernRoutes.patch("/:id/accept", validate(optionalRemarksSchema), acceptConcern);
concernRoutes.patch("/:id/reject", validate(requiredRemarksSchema), rejectConcern);
concernRoutes.patch("/:id/assign", validate(assignConcernSchema), assignConcern);
concernRoutes.patch("/:id/reassign", validate(assignConcernSchema), reassignConcern);
concernRoutes.patch("/:id/start", validate(optionalRemarksSchema), startConcern);
concernRoutes.patch("/:id/resolve", validate(requiredRemarksSchema), resolveConcern);
concernRoutes.patch("/:id/approve", validate(optionalRemarksSchema), approveResolution);
concernRoutes.patch("/:id/reopen", validate(requiredRemarksSchema), reopenConcern);
