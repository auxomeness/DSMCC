import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/appError";
import { logger } from "../utils/logger";
import { errorResponse } from "../utils/response";

export const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json(errorResponse("Validation failed", error.flatten().fieldErrors));
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json(errorResponse(error.message));
    return;
  }

  logger.error(error);
  res.status(500).json(errorResponse("Internal server error"));
};
