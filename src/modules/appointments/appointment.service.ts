import { AppointmentStatus, Role } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { getStaffProfileForUser } from "../concerns/concern-access.service";
import { AppError } from "../../utils/appError";
import { appointmentAvailabilityService } from "./appointment-availability.service";
import { appointmentSlotService } from "./appointment-slot.service";
import type {
  AppointmentStatusInput,
  AvailabilityQuery,
  CreateAppointmentInput,
  ListAppointmentsQuery
} from "./appointment.validation";

type AppointmentActor = {
  id: string;
  role: Role;
  email: string;
};

const appointmentInclude = {
  tenant: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true
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

export class AppointmentService {
  async createAppointment(actor: AppointmentActor, input: CreateAppointmentInput) {
    if (actor.role !== Role.TENANT) {
      throw new AppError("Only tenants can create appointments.", 403);
    }

    await appointmentAvailabilityService.assertSlotAvailable(input.officeId, input.scheduledAt);

    return prisma.$transaction(async (tx) => {
      const conflict = await tx.appointment.findFirst({
        where: {
          officeId: input.officeId,
          scheduledAt: input.scheduledAt,
          status: { in: [AppointmentStatus.PENDING, AppointmentStatus.APPROVED] },
          deletedAt: null
        },
        select: { id: true }
      });

      if (conflict) {
        throw new AppError("Selected appointment slot is not available.", 409);
      }

      const appointment = await tx.appointment.create({
        data: {
          tenantId: actor.id,
          officeId: input.officeId,
          scheduledAt: input.scheduledAt,
          purpose: input.purpose,
          status: AppointmentStatus.PENDING
        },
        include: appointmentInclude
      });

      await this.onAppointmentChange(appointment.id, "CREATED");
      return appointment;
    });
  }

  async listAppointments(actor: AppointmentActor, query: ListAppointmentsQuery) {
    const dateFilter = query.date ? this.getDateRange(query.date) : null;

    return prisma.appointment.findMany({
      where: {
        deletedAt: null,
        ...(query.officeId ? { officeId: query.officeId } : {}),
        ...(dateFilter ? { scheduledAt: dateFilter } : {}),
        ...(await this.buildAccessWhere(actor))
      },
      orderBy: { scheduledAt: "asc" },
      include: appointmentInclude
    });
  }

  async getAppointmentById(actor: AppointmentActor, id: string) {
    const appointment = await prisma.appointment.findFirst({
      where: { id, deletedAt: null },
      include: appointmentInclude
    });

    if (!appointment) {
      throw new AppError("Appointment was not found.", 404);
    }

    await this.assertCanAccessAppointment(actor, appointment);
    return appointment;
  }

  async getAvailability(_actor: AppointmentActor, query: AvailabilityQuery) {
    return appointmentAvailabilityService.getAvailability(query);
  }

  async approveAppointment(actor: AppointmentActor, id: string, input: AppointmentStatusInput) {
    const appointment = await this.getAppointmentById(actor, id);
    await this.assertStaffOrAdminForOffice(actor, appointment.officeId);

    if (appointment.status !== AppointmentStatus.PENDING) {
      throw new AppError("Only pending appointments can be approved.", 400);
    }

    const approvedConflict = await prisma.appointment.findFirst({
      where: {
        id: { not: id },
        officeId: appointment.officeId,
        scheduledAt: appointment.scheduledAt,
        status: AppointmentStatus.APPROVED,
        deletedAt: null
      },
      select: { id: true }
    });

    if (approvedConflict) {
      throw new AppError("Selected appointment slot is already booked.", 409);
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        status: AppointmentStatus.APPROVED,
        remarks: input.remarks
      },
      include: appointmentInclude
    });

    await this.onAppointmentChange(id, "APPROVED");
    return updatedAppointment;
  }

  async declineAppointment(actor: AppointmentActor, id: string, input: AppointmentStatusInput) {
    const appointment = await this.getAppointmentById(actor, id);
    await this.assertStaffOrAdminForOffice(actor, appointment.officeId);

    if (appointment.status !== AppointmentStatus.PENDING) {
      throw new AppError("Only pending appointments can be declined.", 400);
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        status: AppointmentStatus.DECLINED,
        remarks: input.remarks
      },
      include: appointmentInclude
    });

    await this.onAppointmentChange(id, "DECLINED");
    return updatedAppointment;
  }

  async cancelAppointment(actor: AppointmentActor, id: string, input: AppointmentStatusInput) {
    const appointment = await this.getAppointmentById(actor, id);

    if (actor.role !== Role.ADMIN && appointment.tenantId !== actor.id) {
      throw new AppError("Only the tenant who created this appointment or admin can cancel it.", 403);
    }

    const cancellableStatuses: AppointmentStatus[] = [AppointmentStatus.PENDING, AppointmentStatus.APPROVED];

    if (!cancellableStatuses.includes(appointment.status)) {
      throw new AppError("Only pending or approved appointments can be cancelled.", 400);
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        status: AppointmentStatus.CANCELLED,
        remarks: input.remarks
      },
      include: appointmentInclude
    });

    await this.onAppointmentChange(id, "CANCELLED");
    return updatedAppointment;
  }

  async completeAppointment(actor: AppointmentActor, id: string, input: AppointmentStatusInput) {
    const appointment = await this.getAppointmentById(actor, id);
    await this.assertStaffOrAdminForOffice(actor, appointment.officeId);

    if (appointment.status !== AppointmentStatus.APPROVED) {
      throw new AppError("Only approved appointments can be completed.", 400);
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        status: AppointmentStatus.COMPLETED,
        remarks: input.remarks
      },
      include: appointmentInclude
    });

    await this.onAppointmentChange(id, "COMPLETED");
    return updatedAppointment;
  }

  private async buildAccessWhere(actor: AppointmentActor) {
    if (actor.role === Role.ADMIN) {
      return {};
    }

    if (actor.role === Role.TENANT) {
      return { tenantId: actor.id };
    }

    const staffProfile = await getStaffProfileForUser(actor.id);

    if (!staffProfile) {
      throw new AppError("Staff profile was not found.", 403);
    }

    return { officeId: staffProfile.officeId };
  }

  private async assertCanAccessAppointment(actor: AppointmentActor, appointment: { tenantId: string; officeId: string }) {
    if (actor.role === Role.ADMIN) {
      return;
    }

    if (actor.role === Role.TENANT && appointment.tenantId === actor.id) {
      return;
    }

    if (actor.role === Role.STAFF) {
      await this.assertStaffOrAdminForOffice(actor, appointment.officeId);
      return;
    }

    throw new AppError("You are not authorized to access this appointment.", 403);
  }

  private async assertStaffOrAdminForOffice(actor: AppointmentActor, officeId: string) {
    if (actor.role === Role.ADMIN) {
      return;
    }

    if (actor.role !== Role.STAFF) {
      throw new AppError("Only staff or admin can manage appointment approval.", 403);
    }

    const staffProfile = await getStaffProfileForUser(actor.id);

    if (!staffProfile || staffProfile.officeId !== officeId) {
      throw new AppError("Staff can only manage appointments in their assigned office.", 403);
    }
  }

  private getDateRange(date: string) {
    const start = new Date(`${date}T00:00:00.000Z`);
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

    return {
      gte: start,
      lt: end
    };
  }

  private async onAppointmentChange(_appointmentId: string, _event: string) {
    // Structural hook only. Concern integration and notification delivery belong to later phases.
  }
}

export const appointmentService = new AppointmentService();
