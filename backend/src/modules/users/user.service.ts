import { NotificationType, Prisma, Role, UserStatus } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { notificationEventService } from "../../services/notification-event.service";
import { AppError } from "../../utils/appError";
import { getPagination } from "../../utils/pagination";
import type { ListUsersQuery } from "./user.validation";

const MAX_APPROVED_TENANTS_PER_UNIT = 3;

const userListSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phoneNumber: true,
  role: true,
  status: true,
  building: true,
  floor: true,
  unitNumber: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true
};

const userDetailSelect = {
  ...userListSelect,
  _count: {
    select: {
      concerns: true,
      appointments: true
    }
  }
};

export class UserService {
  async listUsers(query: ListUsersQuery) {
    const pagination = getPagination({
      page: query.page,
      limit: query.limit ?? 20
    });

    const search = query.search?.trim();
    const where: Prisma.UserWhereInput = {
      deletedAt: null,
      role: Role.TENANT,
      ...(query.status ? { status: query.status } : {}),
      ...(search
        ? {
            OR: [
              { firstName: { contains: search, mode: Prisma.QueryMode.insensitive } },
              { lastName: { contains: search, mode: Prisma.QueryMode.insensitive } },
              { email: { contains: search, mode: Prisma.QueryMode.insensitive } },
              { phoneNumber: { contains: search, mode: Prisma.QueryMode.insensitive } },
              { building: { contains: search, mode: Prisma.QueryMode.insensitive } },
              { floor: { contains: search, mode: Prisma.QueryMode.insensitive } },
              { unitNumber: { contains: search, mode: Prisma.QueryMode.insensitive } }
            ]
          }
        : {})
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: pagination.skip,
        take: pagination.take,
        select: userListSelect
      }),
      prisma.user.count({ where })
    ]);

    return {
      users,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit)
      }
    };
  }

  async getUserById(id: string) {
    const user = await prisma.user.findFirst({
      where: {
        id,
        role: Role.TENANT,
        deletedAt: null
      },
      select: userDetailSelect
    });

    if (!user) {
      throw new AppError("User was not found.", 404);
    }

    return user;
  }

  async approveTenant(id: string) {
    const result = await prisma.$transaction(async (tx) => {
      const user = await this.getTenantForStatusChange(tx, id);
      const isReactivation = user.status === UserStatus.SUSPENDED;

      if (user.status !== UserStatus.PENDING && user.status !== UserStatus.SUSPENDED) {
        throw new AppError("Only pending or suspended tenants can be approved.", 400);
      }

      await this.assertUnitApprovalCapacity(tx, user);

      const updatedUser = await tx.user.update({
        where: { id },
        data: { status: UserStatus.APPROVED },
        select: userDetailSelect
      });
      return { updatedUser, isReactivation };
    });

    await notificationEventService.emitAccountEvent(
      id,
      result.isReactivation ? NotificationType.ACCOUNT_REACTIVATED : NotificationType.ACCOUNT_APPROVAL
    );

    return result.updatedUser;
  }

  async rejectTenant(id: string) {
    const updatedUser = await prisma.$transaction(async (tx) => {
      const user = await this.getTenantForStatusChange(tx, id);

      if (user.status !== UserStatus.PENDING) {
        throw new AppError("Only pending tenants can be rejected.", 400);
      }

      return tx.user.update({
        where: { id },
        data: { status: UserStatus.REJECTED },
        select: userDetailSelect
      });
    });

    await notificationEventService.emitAccountEvent(id, NotificationType.ACCOUNT_REJECTED);
    return updatedUser;
  }

  async suspendTenant(id: string) {
    const updatedUser = await prisma.$transaction(async (tx) => {
      const user = await this.getTenantForStatusChange(tx, id);

      if (user.status !== UserStatus.APPROVED) {
        throw new AppError("Only approved tenants can be suspended.", 400);
      }

      return tx.user.update({
        where: { id },
        data: { status: UserStatus.SUSPENDED },
        select: userDetailSelect
      });
    });

    await notificationEventService.emitAccountEvent(id, NotificationType.ACCOUNT_SUSPENDED);
    return updatedUser;
  }

  async reactivateTenant(id: string) {
    return this.approveTenant(id);
  }

  private async getTenantForStatusChange(client: Prisma.TransactionClient, id: string) {
    const user = await client.user.findFirst({
      where: {
        id,
        deletedAt: null
      },
      select: {
        id: true,
        role: true,
        status: true,
        building: true,
        floor: true,
        unitNumber: true
      }
    });

    if (!user) {
      throw new AppError("User was not found.", 404);
    }

    if (user.role !== Role.TENANT) {
      throw new AppError("Only tenant accounts can be managed through this action.", 400);
    }

    return user;
  }

  private async assertUnitApprovalCapacity(
    client: Prisma.TransactionClient,
    user: {
      id: string;
      building: string | null;
      floor: string | null;
      unitNumber: string | null;
    }
  ) {
    if (!user.building || !user.floor || !user.unitNumber) {
      throw new AppError("Tenant unit information is incomplete.", 400);
    }

    const approvedTenantCount = await client.user.count({
      where: {
        id: { not: user.id },
        role: Role.TENANT,
        status: UserStatus.APPROVED,
        building: user.building,
        floor: user.floor,
        unitNumber: user.unitNumber,
        deletedAt: null
      }
    });

    if (approvedTenantCount >= MAX_APPROVED_TENANTS_PER_UNIT) {
      throw new AppError("Maximum approved tenants for this unit has been reached.", 400);
    }
  }
}

export const userService = new UserService();
