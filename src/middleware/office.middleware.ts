import { Role } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { getStaffProfileForUser } from "../modules/concerns/concern-access.service";
import { AppError } from "../utils/appError";

const resolveOfficeId = async (req: Request) => {
  if (typeof req.params.officeId === "string") {
    return req.params.officeId;
  }

  if (typeof req.body?.officeId === "string") {
    return req.body.officeId;
  }

  const concernId = req.params.concernId ?? req.params.id;

  if (typeof concernId === "string") {
    const concern = await prisma.concern.findUnique({
      where: { id: concernId },
      select: { officeId: true }
    });

    return concern?.officeId ?? null;
  }

  return null;
};

export const requireOfficeScope = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError("Authentication is required.", 401);
    }

    if (req.user.role === Role.ADMIN || req.user.role === Role.TENANT) {
      next();
      return;
    }

    const targetOfficeId = await resolveOfficeId(req);

    if (!targetOfficeId) {
      throw new AppError("Office scope could not be determined.", 400);
    }

    const staffProfile = await getStaffProfileForUser(req.user.id);

    if (!staffProfile || staffProfile.officeId !== targetOfficeId) {
      throw new AppError("You are not authorized outside your assigned office.", 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};
