import { ConcernStatus, Prisma } from "@prisma/client";
import { prisma } from "../../../config/prisma";
import { AppError } from "../../../utils/appError";
import { getValidNextStatuses } from "./concern-transition.map";
import { validateTransition } from "./concern-validator";
import { assertActorCanTransition, assertOfficeHeadActor, type WorkflowActor } from "./concern-actions.policy";

type TransitionInput = {
  concernId: string;
  newStatus: ConcernStatus;
  actor: WorkflowActor;
  remarks?: string;
  assignedStaffId?: string;
};

type AssignInput = {
  concernId: string;
  actor: WorkflowActor;
  assignedStaffId: string;
  remarks?: string;
  reassign?: boolean;
};

const statusActionMap: Partial<Record<ConcernStatus, string>> = {
  [ConcernStatus.ACCEPTED]: "ACCEPTED",
  [ConcernStatus.REJECTED]: "REJECTED",
  [ConcernStatus.ASSIGNED]: "ASSIGNED",
  [ConcernStatus.IN_PROGRESS]: "STARTED",
  [ConcernStatus.RESOLVED]: "RESOLVED",
  [ConcernStatus.PENDING_TENANT_APPROVAL]: "PENDING_TENANT_APPROVAL",
  [ConcernStatus.CLOSED]: "CLOSED",
  [ConcernStatus.REOPENED]: "REOPENED"
};

export class ConcernWorkflowService {
  async transition(input: TransitionInput) {
    return prisma.$transaction(async (tx) => {
      return this.transitionWithClient(tx, input);
    });
  }

  async assign(input: AssignInput) {
    return prisma.$transaction(async (tx) => {
      const concern = await this.getConcernForWorkflow(tx, input.concernId);
      await assertOfficeHeadActor(input.actor, concern);

      const isReassign = input.reassign || concern.status === ConcernStatus.ASSIGNED;

      if (!isReassign) {
        validateTransition(concern.status, ConcernStatus.ASSIGNED);
      }

      const assignedStaff = await tx.staff.findFirst({
        where: {
          id: input.assignedStaffId,
          officeId: concern.officeId,
          deletedAt: null
        },
        select: {
          id: true
        }
      });

      if (!assignedStaff) {
        throw new AppError("Assigned staff must belong to the same office as the concern.", 400);
      }

      const updatedConcern = await tx.concern.update({
        where: { id: input.concernId },
        data: {
          assignedStaffId: input.assignedStaffId,
          status: ConcernStatus.ASSIGNED,
          assignedAt: new Date()
        },
        include: this.concernInclude
      });

      await tx.concernHistory.create({
        data: {
          concernId: input.concernId,
          userId: input.actor.id,
          action: isReassign ? "REASSIGNED" : "ASSIGNED",
          oldStatus: concern.status,
          newStatus: ConcernStatus.ASSIGNED,
          remarks: input.remarks
        }
      });

      await this.onStatusChange(updatedConcern.id, concern.status, updatedConcern.status);
      return updatedConcern;
    });
  }

  async resolve(input: Omit<TransitionInput, "newStatus">) {
    return prisma.$transaction(async (tx) => {
      await this.transitionWithClient(tx, {
        ...input,
        newStatus: ConcernStatus.RESOLVED
      });

      return this.transitionWithClient(tx, {
        ...input,
        newStatus: ConcernStatus.PENDING_TENANT_APPROVAL,
        remarks: input.remarks ?? "Concern is pending tenant approval."
      });
    });
  }

  async getAllowedTransitions(concernId: string, actor: WorkflowActor) {
    const concern = await this.getConcernForWorkflow(prisma, concernId);
    const nextStatuses = getValidNextStatuses(concern.status);
    const allowed: ConcernStatus[] = [];

    for (const nextStatus of nextStatuses) {
      try {
        await assertActorCanTransition(actor, concern, nextStatus);
        allowed.push(nextStatus);
      } catch {
        // The UI only needs allowed states, not every rejected reason.
      }
    }

    return allowed;
  }

  private readonly concernInclude = {
    assignedStaff: {
      select: {
        id: true,
        userId: true,
        officeId: true
      }
    }
  } satisfies Prisma.ConcernInclude;

  private async getConcernForWorkflow(client: Prisma.TransactionClient | typeof prisma, concernId: string) {
    const concern = await client.concern.findUnique({
      where: { id: concernId },
      include: this.concernInclude
    });

    if (!concern) {
      throw new AppError("Concern was not found.", 404);
    }

    return concern;
  }

  private async transitionWithClient(client: Prisma.TransactionClient | typeof prisma, input: TransitionInput) {
    const concern = await this.getConcernForWorkflow(client, input.concernId);

    validateTransition(concern.status, input.newStatus);
    await assertActorCanTransition(input.actor, concern, input.newStatus);

    const updatedConcern = await client.concern.update({
      where: { id: input.concernId },
      data: this.buildTransitionUpdate(input.newStatus),
      include: this.concernInclude
    });

    await client.concernHistory.create({
      data: {
        concernId: input.concernId,
        userId: input.actor.id,
        action: statusActionMap[input.newStatus] ?? "STATUS_CHANGED",
        oldStatus: concern.status,
        newStatus: input.newStatus,
        remarks: input.remarks
      }
    });

    await this.onStatusChange(updatedConcern.id, concern.status, updatedConcern.status);
    return updatedConcern;
  }

  private buildTransitionUpdate(newStatus: ConcernStatus) {
    const now = new Date();

    switch (newStatus) {
      case ConcernStatus.ACCEPTED:
        return { status: newStatus, acceptedAt: now };
      case ConcernStatus.ASSIGNED:
        return { status: newStatus, assignedAt: now };
      case ConcernStatus.IN_PROGRESS:
        return { status: newStatus, startedAt: now };
      case ConcernStatus.RESOLVED:
        return { status: newStatus, resolvedAt: now };
      case ConcernStatus.CLOSED:
        return { status: newStatus, closedAt: now };
      default:
        return { status: newStatus };
    }
  }

  private async onStatusChange(_concernId: string, _oldStatus: ConcernStatus, _newStatus: ConcernStatus) {
    // Structural hook only. Notification delivery belongs to the notification phase.
  }
}

export const concernWorkflowService = new ConcernWorkflowService();
