import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/appError";
import type { CreateOfficeInput, ListOfficesQuery, UpdateOfficeInput } from "./office.validation";

const officeSelect = {
  id: true,
  name: true,
  description: true,
  officeHours: true,
  officeStartTime: true,
  officeEndTime: true,
  slotDurationMin: true,
  isActive: true,
  deletedAt: true,
  createdAt: true,
  updatedAt: true
};

export class OfficeService {
  private async canDeleteOffice(id: string) {
    const [activeStaffCount, concernCount, activeAppointmentCount] = await Promise.all([
      prisma.staff.count({
        where: {
          officeId: id,
          deletedAt: null
        }
      }),
      prisma.concern.count({
        where: { officeId: id }
      }),
      prisma.appointment.count({
        where: {
          officeId: id,
          deletedAt: null
        }
      })
    ]);

    const blockingCounts = {
      activeStaff: activeStaffCount,
      concerns: concernCount,
      activeAppointments: activeAppointmentCount
    };

    return {
      canDelete: activeStaffCount === 0 && concernCount === 0 && activeAppointmentCount === 0,
      blockingCounts
    };
  }

  async createOffice(input: CreateOfficeInput) {
    try {
      return await prisma.office.create({
        data: {
          name: input.name,
          description: input.description,
          officeHours: input.officeHours,
          officeStartTime: input.officeStartTime,
          officeEndTime: input.officeEndTime,
          slotDurationMin: input.slotDurationMin,
          isActive: input.isActive ?? true
        },
        select: officeSelect
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new AppError("Office name already exists.", 409);
      }

      throw error;
    }
  }

  async listOffices(query: ListOfficesQuery) {
    return prisma.office.findMany({
      where: {
        deletedAt: null,
        ...(query.includeInactive ? {} : { isActive: true }),
        ...(query.search
          ? {
              name: {
                contains: query.search,
                mode: Prisma.QueryMode.insensitive
              }
            }
          : {})
      },
      orderBy: { name: "asc" },
      select: officeSelect
    });
  }

  async getOfficeById(id: string) {
    const office = await prisma.office.findFirst({
      where: { id, deletedAt: null },
      select: officeSelect
    });

    if (!office) {
      throw new AppError("Office was not found.", 404);
    }

    return office;
  }

  async updateOffice(id: string, input: UpdateOfficeInput) {
    await this.getOfficeById(id);

    try {
      return await prisma.office.update({
        where: { id },
        data: {
          name: input.name,
          description: input.description,
          officeHours: input.officeHours,
          officeStartTime: input.officeStartTime,
          officeEndTime: input.officeEndTime,
          slotDurationMin: input.slotDurationMin,
          isActive: input.isActive
        },
        select: officeSelect
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new AppError("Office name already exists.", 409);
      }

      throw error;
    }
  }

  async deleteOffice(id: string) {
    await this.getOfficeById(id);
    const deleteDecision = await this.canDeleteOffice(id);

    const office = await prisma.office.update({
      where: { id },
      data: deleteDecision.canDelete
        ? {
            isActive: false,
            deletedAt: new Date()
          }
        : { isActive: false },
      select: officeSelect
    });

    return {
      office,
      softDeleted: deleteDecision.canDelete,
      deactivatedOnly: !deleteDecision.canDelete,
      blockingCounts: deleteDecision.blockingCounts
    };
  }
}

export const officeService = new OfficeService();
