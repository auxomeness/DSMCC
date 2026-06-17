import { ConcernStatus, ConcernVisibility, Prisma, Role } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/appError";
import { buildConcernAccessWhere, canAccessConcern, getConcernForAccess } from "./concern-access.service";
import { concernWorkflowService } from "./workflow/concern-workflow.service";
import type { WorkflowActor } from "./workflow/concern-actions.policy";
import type { AssignConcernInput, CreateConcernInput, ListConcernsQuery, RemarksInput } from "./concern.validation";

const concernInclude = {
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
  },
  assignedStaff: {
    select: {
      id: true,
      userId: true,
      position: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true
        }
      }
    }
  },
  _count: {
    select: {
      votes: true,
      histories: true
    }
  }
};

export class ConcernService {
  async createConcern(actor: WorkflowActor, input: CreateConcernInput) {
    if (actor.role !== Role.TENANT) {
      throw new AppError("Only tenants can create concerns.", 403);
    }

    const office = await prisma.office.findFirst({
      where: {
        id: input.officeId,
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
      throw new AppError("Cannot submit concerns to an inactive office.", 400);
    }

    return prisma.$transaction(async (tx) => {
      const concernNumber = await this.generateConcernNumber(tx);

      const concern = await tx.concern.create({
        data: {
          concernNumber,
          title: input.title,
          category: input.category,
          description: input.description,
          officeId: input.officeId,
          tenantId: actor.id,
          building: input.building,
          floor: input.floor,
          unitNumber: input.unitNumber,
          locationDescription: input.locationDescription,
          preferredSchedule: input.preferredSchedule,
          visibility: input.visibility ?? ConcernVisibility.PRIVATE,
          imageUrl: input.imageUrl,
          status: ConcernStatus.SUBMITTED
        },
        include: concernInclude
      });

      await tx.concernHistory.create({
        data: {
          concernId: concern.id,
          userId: actor.id,
          action: "CREATED",
          oldStatus: null,
          newStatus: ConcernStatus.SUBMITTED,
          remarks: "Concern created by tenant."
        }
      });

      return concern;
    });
  }

  async listConcerns(actor: WorkflowActor, query: ListConcernsQuery) {
    const accessWhere = await buildConcernAccessWhere(actor);

    return prisma.concern.findMany({
      where: {
        AND: [
          accessWhere,
          query.status ? { status: query.status } : {},
          query.visibility ? { visibility: query.visibility } : {},
          query.officeId ? { officeId: query.officeId } : {}
        ]
      },
      orderBy: { createdAt: "desc" },
      include: concernInclude
    });
  }

  async getConcernById(actor: WorkflowActor, concernId: string) {
    const accessConcern = await getConcernForAccess(concernId);
    const allowed = await canAccessConcern(actor, accessConcern);

    if (!allowed) {
      throw new AppError("You are not authorized to view this concern.", 403);
    }

    return prisma.concern.findUniqueOrThrow({
      where: { id: concernId },
      include: concernInclude
    });
  }

  async getConcernHistory(actor: WorkflowActor, concernId: string) {
    await this.getConcernById(actor, concernId);

    return prisma.concernHistory.findMany({
      where: { concernId },
      orderBy: { createdAt: "asc" },
      include: {
        actor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true
          }
        }
      }
    });
  }

  async getAllowedTransitions(actor: WorkflowActor, concernId: string) {
    await this.getConcernById(actor, concernId);
    return concernWorkflowService.getAllowedTransitions(concernId, actor);
  }

  async acceptConcern(actor: WorkflowActor, concernId: string, input: RemarksInput) {
    return concernWorkflowService.transition({
      concernId,
      newStatus: ConcernStatus.ACCEPTED,
      actor,
      remarks: input.remarks
    });
  }

  async rejectConcern(actor: WorkflowActor, concernId: string, input: RemarksInput) {
    if (!input.remarks) {
      throw new AppError("Rejection remarks are required.", 400);
    }

    return concernWorkflowService.transition({
      concernId,
      newStatus: ConcernStatus.REJECTED,
      actor,
      remarks: input.remarks
    });
  }

  async assignConcern(actor: WorkflowActor, concernId: string, input: AssignConcernInput) {
    return concernWorkflowService.assign({
      concernId,
      actor,
      assignedStaffId: input.assignedStaffId,
      remarks: input.remarks
    });
  }

  async reassignConcern(actor: WorkflowActor, concernId: string, input: AssignConcernInput) {
    return concernWorkflowService.assign({
      concernId,
      actor,
      assignedStaffId: input.assignedStaffId,
      remarks: input.remarks,
      reassign: true
    });
  }

  async startConcern(actor: WorkflowActor, concernId: string, input: RemarksInput) {
    return concernWorkflowService.transition({
      concernId,
      newStatus: ConcernStatus.IN_PROGRESS,
      actor,
      remarks: input.remarks
    });
  }

  async resolveConcern(actor: WorkflowActor, concernId: string, input: RemarksInput) {
    if (!input.remarks) {
      throw new AppError("Resolution remarks are required.", 400);
    }

    return concernWorkflowService.resolve({
      concernId,
      actor,
      remarks: input.remarks
    });
  }

  async approveResolution(actor: WorkflowActor, concernId: string, input: RemarksInput) {
    return concernWorkflowService.transition({
      concernId,
      newStatus: ConcernStatus.CLOSED,
      actor,
      remarks: input.remarks ?? "Resolution approved by tenant."
    });
  }

  async reopenConcern(actor: WorkflowActor, concernId: string, input: RemarksInput) {
    if (!input.remarks) {
      throw new AppError("Reopen remarks are required.", 400);
    }

    return concernWorkflowService.transition({
      concernId,
      newStatus: ConcernStatus.REOPENED,
      actor,
      remarks: input.remarks
    });
  }

  private async generateConcernNumber(tx: Prisma.TransactionClient) {
    const year = new Date().getFullYear();
    const startOfYear = new Date(Date.UTC(year, 0, 1));
    const startOfNextYear = new Date(Date.UTC(year + 1, 0, 1));
    const yearlyCount = await tx.concern.count({
      where: {
        createdAt: {
          gte: startOfYear,
          lt: startOfNextYear
        }
      }
    });

    return `DEC-${year}-${String(yearlyCount + 1).padStart(4, "0")}`;
  }
}

export const concernService = new ConcernService();
