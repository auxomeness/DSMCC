import { ConcernStatus, Role } from "@prisma/client";
import { getStaffProfileForUser } from "../concern-access.service";
import { AppError } from "../../../utils/appError";

export type WorkflowActor = {
  id: string;
  role: Role;
  email: string;
};

export type WorkflowConcern = {
  id: string;
  status: ConcernStatus;
  tenantId: string;
  officeId: string;
  assignedStaffId: string | null;
  assignedStaff?: {
    id: string;
    userId: string;
    officeId: string;
  } | null;
};

export const assertOfficeStaffActor = async (actor: WorkflowActor, concern: WorkflowConcern) => {
  if (actor.role === Role.ADMIN) {
    return;
  }

  if (actor.role !== Role.STAFF) {
    throw new AppError("Only staff or admin can perform this concern action.", 403);
  }

  const staffProfile = await getStaffProfileForUser(actor.id);

  if (!staffProfile || staffProfile.officeId !== concern.officeId) {
    throw new AppError("Staff can only act on concerns within their assigned office.", 403);
  }
};

export const assertOfficeHeadActor = async (actor: WorkflowActor, concern: WorkflowConcern) => {
  if (actor.role === Role.ADMIN) {
    return;
  }

  if (actor.role !== Role.STAFF) {
    throw new AppError("Only an office head or admin can assign concerns.", 403);
  }

  const staffProfile = await getStaffProfileForUser(actor.id);

  if (!staffProfile || staffProfile.officeId !== concern.officeId || !staffProfile.isOfficeHead) {
    throw new AppError("Only this concern office's office head can assign staff.", 403);
  }
};

export const assertAssignedStaffActor = async (actor: WorkflowActor, concern: WorkflowConcern) => {
  if (actor.role === Role.ADMIN) {
    return;
  }

  if (actor.role !== Role.STAFF || concern.assignedStaff?.userId !== actor.id) {
    throw new AppError("Only the assigned staff member can perform this concern action.", 403);
  }
};

export const assertTenantOwnerActor = (actor: WorkflowActor, concern: WorkflowConcern) => {
  if (actor.role === Role.ADMIN) {
    return;
  }

  if (actor.role !== Role.TENANT || concern.tenantId !== actor.id) {
    throw new AppError("Only the concern owner can perform this concern action.", 403);
  }
};

export const assertActorCanTransition = async (
  actor: WorkflowActor,
  concern: WorkflowConcern,
  nextStatus: ConcernStatus
) => {
  switch (nextStatus) {
    case ConcernStatus.ACCEPTED:
    case ConcernStatus.REJECTED:
      await assertOfficeStaffActor(actor, concern);
      return;
    case ConcernStatus.ASSIGNED:
      await assertOfficeHeadActor(actor, concern);
      return;
    case ConcernStatus.IN_PROGRESS:
    case ConcernStatus.RESOLVED:
    case ConcernStatus.PENDING_TENANT_APPROVAL:
      await assertAssignedStaffActor(actor, concern);
      return;
    case ConcernStatus.CLOSED:
    case ConcernStatus.REOPENED:
      assertTenantOwnerActor(actor, concern);
      return;
    case ConcernStatus.SUBMITTED:
      throw new AppError("Cannot transition an existing concern back to submitted.", 400);
    default:
      throw new AppError("Unsupported concern transition.", 400);
  }
};
