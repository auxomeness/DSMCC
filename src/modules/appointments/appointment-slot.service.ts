import { AppError } from "../../utils/appError";

export type TimeSlot = {
  start: Date;
  end: Date;
  time: string;
};

type GenerateSlotsInput = {
  date: string;
  officeStartTime?: string | null;
  officeEndTime?: string | null;
  slotDurationMin: number;
};

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

export const formatSlotTime = (start: Date, end: Date) => {
  const format = (value: Date) => value.toISOString().slice(11, 16);
  return `${format(start)}-${format(end)}`;
};

const parseDateStart = (date: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new AppError("Date must use YYYY-MM-DD format.", 400);
  }

  const parsed = new Date(`${date}T00:00:00.000Z`);

  if (Number.isNaN(parsed.getTime())) {
    throw new AppError("Invalid date.", 400);
  }

  return parsed;
};

const minutesFromTime = (value: string) => {
  if (!timePattern.test(value)) {
    throw new AppError("Office time must use HH:mm format.", 400);
  }

  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
};

export class AppointmentSlotService {
  generateSlots(input: GenerateSlotsInput) {
    const startTime = input.officeStartTime ?? "08:00";
    const endTime = input.officeEndTime ?? "17:00";
    const slotDurationMin = input.slotDurationMin || 60;
    const dayStart = parseDateStart(input.date);
    const startMinutes = minutesFromTime(startTime);
    const endMinutes = minutesFromTime(endTime);

    if (endMinutes <= startMinutes) {
      throw new AppError("Office end time must be after start time.", 400);
    }

    const slots: TimeSlot[] = [];

    for (let cursor = startMinutes; cursor + slotDurationMin <= endMinutes; cursor += slotDurationMin) {
      const start = new Date(dayStart.getTime() + cursor * 60 * 1000);
      const end = new Date(start.getTime() + slotDurationMin * 60 * 1000);

      slots.push({
        start,
        end,
        time: formatSlotTime(start, end)
      });
    }

    return slots;
  }

  normalizeDate(value: Date) {
    return value.toISOString().slice(0, 10);
  }
}

export const appointmentSlotService = new AppointmentSlotService();
