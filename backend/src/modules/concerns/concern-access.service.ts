import { ConcernVisibility, Prisma, Role } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/appError";

/*
 * Source of truth for concern access policy.
 * Future concern list/detail services should call this module instead of
 * rebuilding PUBLIC/PRIVATE, tenant ownership, or office-scope rules inline.
 */

type AccessUser = {
  id: string;
  role: Role;
  email: string;
};

type ConcernAccessRecord = {
  tenantId: string;
  officeId: string;
  visibility: ConcernVisibility;
  assignedStaff?: {
    userId: string;
  } | null;
};

export const isConcernOwner = (userId: string, concern: Pick<ConcernAccessRecord, "tenantId">) => {
  return concern.tenantId === userId;
};

export const getStaffProfileForUser = async (userId: string) => {
  return prisma.staff.findUnique({
    where: { userId },
    select: {
      id: true,
      userId: true,
      officeId: true,
      isOfficeHead: true
    }
  });
};

export const canAccessPrivateConcern = async (user: AccessUser, concern: ConcernAccessRecord) => {
  if (user.role === Role.ADMIN) {
    return true;
  }

  if (isConcernOwner(user.id, concern)) {
    return true;
  }

  if (user.role !== Role.STAFF) {
    return false;
  }

  if (concern.assignedStaff?.userId === user.id) {
    return true;
  }

  const staffProfile = await getStaffProfileForUser(user.id);

  if (!staffProfile) {
    return false;
  }

  // Model B: staff can access all concerns in their own office.
  return staffProfile.officeId === concern.officeId;
};

export const canAccessConcern = async (user: AccessUser, concern: ConcernAccessRecord) => {
  if (concern.visibility === ConcernVisibility.PUBLIC) {
    return true;
  }

  return canAccessPrivateConcern(user, concern);
};

export const buildConcernAccessWhere = async (user: AccessUser): Promise<Prisma.ConcernWhereInput> => {
  if (user.role === Role.ADMIN) {
    return {};
  }

  if (user.role === Role.TENANT) {
    return {
      OR: [{ visibility: ConcernVisibility.PUBLIC }, { tenantId: user.id }]
    };
  }

  const staffProfile = await getStaffProfileForUser(user.id);

  if (!staffProfile) {
    return {
      visibility: ConcernVisibility.PUBLIC
    };
  }

  return {
    OR: [{ visibility: ConcernVisibility.PUBLIC }, { officeId: staffProfile.officeId }]
  };
};

export const getConcernForAccess = async (concernId: string) => {
  const concern = await prisma.concern.findUnique({
    where: { id: concernId },
    select: {
      tenantId: true,
      officeId: true,
      visibility: true,
      assignedStaff: {
        select: {
          userId: true
        }
      }
    }
  });

  if (!concern) {
    throw new AppError("Concern was not found.", 404);
  }

  return concern;
};
