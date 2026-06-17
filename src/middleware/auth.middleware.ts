import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError";
import { verifyAccessToken } from "../utils/jwt";

export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    next(new AppError("Authentication token is required.", 401));
    return;
  }

  const token = authorization.slice("Bearer ".length);

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.id,
      role: payload.role,
      email: payload.email
    };
    next();
  } catch {
    next(new AppError("Invalid or expired authentication token.", 401));
  }
};

export const requireAuth = authMiddleware;
