import { AppointmentStatus } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/appError";
import { appointmentSlotService } from "./appointment-slot.service";

type SlotStatus = "AVAILABLE" | "BOOKED" | "PENDING_APPROVAL";

type AvailabilityInput = {
  officeId: string;
  date: string;
};

const blockingStatuses = [AppointmentStatus.PENDING, AppointmentStatus.APPROVED];

export class AppointmentAvailabilityService {
  async getAvailability(input: AvailabilityInput) {
    const office = await prisma.office.findFirst({
      where: {
        id: input.officeId,
        deletedAt: null
      },
      select: {
        id: true,
        isActive: true,
        officeStartTime: true,
        officeEndTime: true,
        slotDurationMin: true
      }
    });

    if (!office) {
      throw new AppError("Office was not found.", 404);
    }

    if (!office.isActive) {
      throw new AppError("Cannot view availability for an inactive office.", 400);
    }

    const slots = appointmentSlotService.generateSlots({
      date: input.date,
      officeStartTime: office.officeStartTime,
      officeEndTime: office.officeEndTime,
      slotDurationMin: office.slotDurationMin
    });

    if (slots.length === 0) {
      return [];
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        officeId: input.officeId,
        status: { in: blockingStatuses },
        scheduledAt: {
          gte: slots[0]?.start,
          lt: slots.at(-1)?.end
        },
        deletedAt: null
      },
      select: {
        scheduledAt: true,
        status: true
      }
    });

    const appointmentByTime = new Map(appointments.map((appointment) => [appointment.scheduledAt.getTime(), appointment]));

    return slots.map((slot) => {
      const appointment = appointmentByTime.get(slot.start.getTime());
      let status: SlotStatus = "AVAILABLE";

      if (appointment?.status === AppointmentStatus.APPROVED) {
        status = "BOOKED";
      }

      if (appointment?.status === AppointmentStatus.PENDING) {
        status = "PENDING_APPROVAL";
      }

      return {
        time: slot.time,
        scheduledAt: slot.start.toISOString(),
        status
      };
    });
  }

  async assertSlotAvailable(officeId: string, scheduledAt: Date) {
    const date = appointmentSlotService.normalizeDate(scheduledAt);
    const availability = await this.getAvailability({ officeId, date });
    const matchingSlot = availability.find((slot) => slot.scheduledAt === scheduledAt.toISOString());

    if (!matchingSlot) {
      throw new AppError("Selected appointment time is outside valid office slots.", 400);
    }

    if (matchingSlot.status !== "AVAILABLE") {
      throw new AppError("Selected appointment slot is not available.", 409);
    }
  }
}

export const appointmentAvailabilityService = new AppointmentAvailabilityService();
