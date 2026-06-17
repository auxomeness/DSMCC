import type { ConcernStatus } from "@prisma/client";
import { AppError } from "../../../utils/appError";
import { getValidNextStatuses } from "./concern-transition.map";

export const validateTransition = (currentStatus: ConcernStatus, nextStatus: ConcernStatus) => {
  const validNextStatuses = getValidNextStatuses(currentStatus);

  if (!validNextStatuses.includes(nextStatus)) {
    throw new AppError(`Invalid concern transition: ${currentStatus} -> ${nextStatus}.`, 400);
  }
};
