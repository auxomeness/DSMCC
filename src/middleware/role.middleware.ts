import type { NextFunction, Request, Response } from "express";
import type { Role } from "@prisma/client";
import { AppError } from "../utils/appError";

export const requireRole =
  (roles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      next(new AppError("Authentication is required.", 401));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new AppError("You are not authorized to access this resource.", 403));
      return;
    }

    next();
  };

export const authorize = (...roles: Role[]) => requireRole(roles);
