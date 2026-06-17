import type { NextFunction, Request, Response } from "express";
import { canAccessConcern, getConcernForAccess } from "../modules/concerns/concern-access.service";
import { AppError } from "../utils/appError";

// Request-level gate only. Final concern query filtering belongs in concern-access.service.ts.
export const requireConcernVisibility = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError("Authentication is required.", 401);
    }

    const concernId = req.params.concernId ?? req.params.id;

    if (typeof concernId !== "string") {
      throw new AppError("Concern id is required.", 400);
    }

    const concern = await getConcernForAccess(concernId);
    const allowed = await canAccessConcern(req.user, concern);

    if (!allowed) {
      throw new AppError("You are not authorized to view this concern.", 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};
