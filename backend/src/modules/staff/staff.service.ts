import { Role } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/appError";
import type { CreateStaffInput, ListStaffQuery, UpdateStaffInput } from "./staff.validation";

const staffSelect = {
  id: true,
  userId: true,
  officeId: true,
  position: true,
  specialization: true,
  isOfficeHead: true,
  deletedAt: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      status: true
    }
  },
  office: {
    select: {
      id: true,
      name: true,
      isActive: true
    }
  }
};

export class StaffService {
  private async assertStaffUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        deletedAt: true
      }
    });

    if (!user || user.deletedAt) {
      throw new AppError("User was not found.", 404);
    }

    if (user.role !== Role.STAFF) {
      throw new AppError("Staff profile can only be linked to a user with STAFF role.", 400);
    }
  }

  private async assertActiveOffice(officeId: string) {
    const office = await prisma.office.findFirst({
      where: {
        id: officeId,
        deletedAt: null
      },
      select: {
        id: true,
        isActive: true
      }
    });

    if (!office) {
      throw new AppError("Office was not found.", 404);
    }

    if (!office.isActive) {
      throw new AppError("Cannot assign staff to an inactive office.", 400);
    }
  }

  private async assertSingleOfficeHead(officeId: string, currentStaffId?: string) {
    const existingOfficeHead = await prisma.staff.findFirst({
      where: {
        officeId,
        isOfficeHead: true,
        deletedAt: null,
        ...(currentStaffId ? { id: { not: currentStaffId } } : {})
      },
      select: { id: true }
    });

    if (existingOfficeHead) {
      throw new AppError("This office already has an office head.", 409);
    }
  }

  async createStaff(input: CreateStaffInput) {
    // Phase 5 keeps this service-level. Add a transaction if creation grows beyond one Staff write.
    await this.assertStaffUser(input.userId);
    await this.assertActiveOffice(input.officeId);

    const existingStaff = await prisma.staff.findUnique({
      where: { userId: input.userId },
      select: { id: true, deletedAt: true }
    });

    if (existingStaff) {
      throw new AppError("User already has a staff profile.", 409);
    }

    if (input.isOfficeHead) {
      await this.assertSingleOfficeHead(input.officeId);
    }

    return prisma.staff.create({
      data: {
        userId: input.userId,
        officeId: input.officeId,
        position: input.position,
        specialization: input.specialization,
        isOfficeHead: input.isOfficeHead ?? false
      },
      select: staffSelect
    });
  }

  async listStaff(query: ListStaffQuery) {
    return prisma.staff.findMany({
      where: {
        ...(query.includeDeleted ? {} : { deletedAt: null }),
        ...(query.officeId ? { officeId: query.officeId } : {})
      },
      orderBy: { createdAt: "desc" },
      select: staffSelect
    });
  }

  async getStaffById(id: string) {
    const staff = await prisma.staff.findFirst({
      where: { id, deletedAt: null },
      select: staffSelect
    });

    if (!staff) {
      throw new AppError("Staff profile was not found.", 404);
    }

    return staff;
  }

  async updateStaff(id: string, input: UpdateStaffInput) {
    const existingStaff = await this.getStaffById(id);
    const targetOfficeId = input.officeId ?? existingStaff.officeId;
    const targetIsOfficeHead = input.isOfficeHead ?? existingStaff.isOfficeHead;

    if (input.officeId) {
      await this.assertActiveOffice(input.officeId);
    }

    if (targetIsOfficeHead) {
      await this.assertSingleOfficeHead(targetOfficeId, id);
    }

    return prisma.staff.update({
      where: { id },
      data: {
        officeId: input.officeId,
        position: input.position,
        specialization: input.specialization,
        isOfficeHead: input.isOfficeHead
      },
      select: staffSelect
    });
  }

  async deleteStaff(id: string) {
    await this.getStaffById(id);

    // If this staff member was the office head, the office intentionally remains without a head
    // until an admin assigns another one.
    return prisma.staff.update({
      where: { id },
      data: {
        isOfficeHead: false,
        deletedAt: new Date()
      },
      select: staffSelect
    });
  }
}

export const staffService = new StaffService();
