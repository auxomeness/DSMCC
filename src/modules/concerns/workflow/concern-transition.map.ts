import { ConcernStatus } from "@prisma/client";

export const concernTransitionMap: Record<ConcernStatus, ConcernStatus[]> = {
  [ConcernStatus.SUBMITTED]: [ConcernStatus.ACCEPTED, ConcernStatus.REJECTED],
  [ConcernStatus.ACCEPTED]: [ConcernStatus.ASSIGNED],
  [ConcernStatus.REJECTED]: [],
  [ConcernStatus.ASSIGNED]: [ConcernStatus.IN_PROGRESS],
  [ConcernStatus.IN_PROGRESS]: [ConcernStatus.RESOLVED],
  [ConcernStatus.RESOLVED]: [ConcernStatus.PENDING_TENANT_APPROVAL],
  [ConcernStatus.PENDING_TENANT_APPROVAL]: [ConcernStatus.CLOSED, ConcernStatus.REOPENED],
  [ConcernStatus.REOPENED]: [ConcernStatus.ASSIGNED],
  [ConcernStatus.CLOSED]: []
};

export const getValidNextStatuses = (status: ConcernStatus) => concernTransitionMap[status] ?? [];
