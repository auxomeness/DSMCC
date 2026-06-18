import {
  AppointmentStatus,
  ConcernStatus,
  ConcernVisibility,
  FeedbackType,
  Role,
  UserStatus
} from "@prisma/client";
import { prisma } from "../../config/prisma";
import { feedbackService } from "../feedbacks/feedback.service";
import { getStaffProfileForUser } from "../concerns/concern-access.service";
import { AppError } from "../../utils/appError";
import type { DashboardActor } from "./dashboard.types";
import type { TopPublicConcernsQuery, TrendQuery } from "./dashboard.validation";

const openConcernStatuses = [
  ConcernStatus.SUBMITTED,
  ConcernStatus.ACCEPTED,
  ConcernStatus.ASSIGNED,
  ConcernStatus.IN_PROGRESS,
  ConcernStatus.RESOLVED,
  ConcernStatus.PENDING_TENANT_APPROVAL,
  ConcernStatus.REOPENED
];

const activeStaffConcernStatuses = [
  ConcernStatus.ASSIGNED,
  ConcernStatus.IN_PROGRESS,
  ConcernStatus.RESOLVED,
  ConcernStatus.PENDING_TENANT_APPROVAL,
  ConcernStatus.REOPENED
];

const getMonthRange = () => {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));

  return { start, end };
};

const getTodayRange = () => {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

  return { start, end };
};

const toMonthlyTrend = (dates: { createdAt: Date }[]) => {
  const monthCounts = new Map<number, number>();

  for (let month = 1; month <= 12; month += 1) {
    monthCounts.set(month, 0);
  }

  for (const item of dates) {
    const month = item.createdAt.getUTCMonth() + 1;
    monthCounts.set(month, (monthCounts.get(month) ?? 0) + 1);
  }

  return Array.from(monthCounts.entries()).map(([month, count]) => ({ month, count }));
};

export class DashboardService {
  async getAdminOverview() {
    const [
      totalTenants,
      pendingTenants,
      approvedTenants,
      rejectedTenants,
      suspendedTenants,
      totalStaff,
      officeHeads,
      totalOffices,
      activeOffices,
      inactiveOffices,
      totalConcerns,
      openConcerns,
      closedConcerns,
      publicConcerns,
      privateConcerns,
      totalAppointments,
      pendingAppointments,
      approvedAppointments,
      completedAppointments,
      feedback
    ] = await Promise.all([
      prisma.user.count({ where: { role: Role.TENANT, deletedAt: null } }),
      prisma.user.count({ where: { role: Role.TENANT, status: UserStatus.PENDING, deletedAt: null } }),
      prisma.user.count({ where: { role: Role.TENANT, status: UserStatus.APPROVED, deletedAt: null } }),
      prisma.user.count({ where: { role: Role.TENANT, status: UserStatus.REJECTED, deletedAt: null } }),
      prisma.user.count({ where: { role: Role.TENANT, status: UserStatus.SUSPENDED, deletedAt: null } }),
      prisma.staff.count({ where: { deletedAt: null } }),
      prisma.staff.count({ where: { isOfficeHead: true, deletedAt: null } }),
      prisma.office.count({ where: { deletedAt: null } }),
      prisma.office.count({ where: { isActive: true, deletedAt: null } }),
      prisma.office.count({ where: { isActive: false, deletedAt: null } }),
      prisma.concern.count(),
      prisma.concern.count({ where: { status: { in: openConcernStatuses } } }),
      prisma.concern.count({ where: { status: ConcernStatus.CLOSED } }),
      prisma.concern.count({ where: { visibility: ConcernVisibility.PUBLIC } }),
      prisma.concern.count({ where: { visibility: ConcernVisibility.PRIVATE } }),
      prisma.appointment.count({ where: { deletedAt: null } }),
      prisma.appointment.count({ where: { status: AppointmentStatus.PENDING, deletedAt: null } }),
      prisma.appointment.count({ where: { status: AppointmentStatus.APPROVED, deletedAt: null } }),
      prisma.appointment.count({ where: { status: AppointmentStatus.COMPLETED, deletedAt: null } }),
      feedbackService.getFeedbackStats()
    ]);

    return {
      users: { totalTenants, pendingTenants, approvedTenants, rejectedTenants, suspendedTenants },
      staff: { totalStaff, officeHeads },
      offices: { totalOffices, activeOffices, inactiveOffices },
      concerns: {
        total: totalConcerns,
        open: openConcerns,
        closed: closedConcerns,
        public: publicConcerns,
        private: privateConcerns
      },
      appointments: {
        total: totalAppointments,
        pending: pendingAppointments,
        approved: approvedAppointments,
        completed: completedAppointments
      },
      feedback
    };
  }

  async getTenantOverview(actor: DashboardActor) {
    const [myConcerns, openConcerns, closedConcerns, myAppointments, pendingAppointments, publicConcerns] =
      await Promise.all([
        prisma.concern.count({ where: { tenantId: actor.id } }),
        prisma.concern.count({ where: { tenantId: actor.id, status: { in: openConcernStatuses } } }),
        prisma.concern.count({ where: { tenantId: actor.id, status: ConcernStatus.CLOSED } }),
        prisma.appointment.count({ where: { tenantId: actor.id, deletedAt: null } }),
        prisma.appointment.count({
          where: { tenantId: actor.id, status: AppointmentStatus.PENDING, deletedAt: null }
        }),
        prisma.concern.count({ where: { visibility: ConcernVisibility.PUBLIC } })
      ]);

    return { myConcerns, openConcerns, closedConcerns, myAppointments, pendingAppointments, publicConcerns };
  }

  async getStaffOverview(actor: DashboardActor) {
    const staffProfile = await this.getRequiredStaffProfile(actor.id);
    const { start, end } = getMonthRange();
    const today = getTodayRange();

    const [assignedConcerns, inProgressConcerns, resolvedThisMonth, appointmentsToday] = await Promise.all([
      prisma.concern.count({ where: { assignedStaffId: staffProfile.id } }),
      prisma.concern.count({ where: { assignedStaffId: staffProfile.id, status: ConcernStatus.IN_PROGRESS } }),
      prisma.concern.count({
        where: {
          assignedStaffId: staffProfile.id,
          resolvedAt: { gte: start, lt: end }
        }
      }),
      prisma.appointment.count({
        where: {
          officeId: staffProfile.officeId,
          scheduledAt: { gte: today.start, lt: today.end },
          deletedAt: null
        }
      })
    ]);

    return { assignedConcerns, inProgressConcerns, resolvedThisMonth, appointmentsToday };
  }

  async getOfficeHeadOverview(actor: DashboardActor) {
    const staffProfile = await this.getRequiredOfficeHeadProfile(actor.id);

    const [totalConcerns, openConcerns, closedConcerns, appointments, totalStaff] = await Promise.all([
      prisma.concern.count({ where: { officeId: staffProfile.officeId } }),
      prisma.concern.count({ where: { officeId: staffProfile.officeId, status: { in: openConcernStatuses } } }),
      prisma.concern.count({ where: { officeId: staffProfile.officeId, status: ConcernStatus.CLOSED } }),
      prisma.appointment.count({ where: { officeId: staffProfile.officeId, deletedAt: null } }),
      prisma.staff.count({ where: { officeId: staffProfile.officeId, deletedAt: null } })
    ]);

    return {
      office: { totalConcerns, openConcerns, closedConcerns, appointments },
      staff: { totalStaff }
    };
  }

  async getMostCommonConcerns() {
    const groups = await prisma.concern.groupBy({
      by: ["category"],
      _count: { _all: true },
      orderBy: { _count: { category: "desc" } }
    });

    return groups.map((group) => ({
      category: group.category,
      count: group._count._all
    }));
  }

  async getTopPublicConcerns(query: TopPublicConcernsQuery) {
    const concerns = await prisma.concern.findMany({
      where: { visibility: ConcernVisibility.PUBLIC },
      orderBy: [{ votes: { _count: "desc" } }, { createdAt: "desc" }],
      take: query.limit,
      select: {
        id: true,
        concernNumber: true,
        title: true,
        status: true,
        _count: {
          select: { votes: true }
        }
      }
    });

    return concerns.map((concern) => ({
      id: concern.id,
      concernNumber: concern.concernNumber,
      title: concern.title,
      voteCount: concern._count.votes,
      status: concern.status
    }));
  }

  async getConcernsByStatus() {
    const groups = await prisma.concern.groupBy({
      by: ["status"],
      _count: { _all: true },
      orderBy: { _count: { status: "desc" } }
    });

    return groups.map((group) => ({
      status: group.status,
      count: group._count._all
    }));
  }

  async getConcernsByOffice() {
    const offices = await prisma.office.findMany({
      where: { deletedAt: null },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        _count: {
          select: { concerns: true }
        }
      }
    });

    return offices.map((office) => ({
      officeId: office.id,
      officeName: office.name,
      count: office._count.concerns
    }));
  }

  async getAppointmentsByOffice() {
    const offices = await prisma.office.findMany({
      where: { deletedAt: null },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        _count: {
          select: { appointments: true }
        }
      }
    });

    return offices.map((office) => ({
      officeId: office.id,
      officeName: office.name,
      count: office._count.appointments
    }));
  }

  async getOfficeWorkload(actor: DashboardActor) {
    const officeFilter = await this.getOfficeFilterForWorkload(actor);

    const offices = await prisma.office.findMany({
      where: {
        deletedAt: null,
        ...officeFilter
      },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            concerns: true
          }
        }
      }
    });

    const workload = await Promise.all(
      offices.map(async (office) => {
        const [openConcerns, closedConcerns] = await Promise.all([
          prisma.concern.count({ where: { officeId: office.id, status: { in: openConcernStatuses } } }),
          prisma.concern.count({ where: { officeId: office.id, status: ConcernStatus.CLOSED } })
        ]);

        return {
          officeId: office.id,
          officeName: office.name,
          totalConcerns: office._count.concerns,
          openConcerns,
          closedConcerns
        };
      })
    );

    return workload;
  }

  async getStaffWorkload(actor: DashboardActor) {
    const officeFilter = await this.getOfficeFilterForWorkload(actor);
    const { start, end } = getMonthRange();

    const staff = await prisma.staff.findMany({
      where: {
        deletedAt: null,
        ...officeFilter
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        user: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    return Promise.all(
      staff.map(async (staffMember) => {
        const [activeConcerns, inProgressConcerns, resolvedThisMonth] = await Promise.all([
          prisma.concern.count({
            where: {
              assignedStaffId: staffMember.id,
              status: { in: activeStaffConcernStatuses }
            }
          }),
          prisma.concern.count({ where: { assignedStaffId: staffMember.id, status: ConcernStatus.IN_PROGRESS } }),
          prisma.concern.count({
            where: {
              assignedStaffId: staffMember.id,
              resolvedAt: { gte: start, lt: end }
            }
          })
        ]);

        return {
          staffId: staffMember.id,
          staffName: `${staffMember.user.firstName} ${staffMember.user.lastName}`,
          activeConcerns,
          inProgressConcerns,
          resolvedThisMonth
        };
      })
    );
  }

  async getMonthlyConcernTrends(query: TrendQuery) {
    const dates = await prisma.concern.findMany({
      where: {
        createdAt: this.getYearRange(query.year)
      },
      select: { createdAt: true }
    });

    return toMonthlyTrend(dates);
  }

  async getMonthlyAppointmentTrends(query: TrendQuery) {
    const dates = await prisma.appointment.findMany({
      where: {
        createdAt: this.getYearRange(query.year),
        deletedAt: null
      },
      select: { createdAt: true }
    });

    return toMonthlyTrend(dates);
  }

  async getFeedbackAnalytics() {
    return feedbackService.getFeedbackStats();
  }

  private async getRequiredStaffProfile(userId: string) {
    const staffProfile = await getStaffProfileForUser(userId);

    if (!staffProfile) {
      throw new AppError("Staff profile was not found.", 403);
    }

    return staffProfile;
  }

  private async getRequiredOfficeHeadProfile(userId: string) {
    const staffProfile = await this.getRequiredStaffProfile(userId);

    if (!staffProfile.isOfficeHead) {
      throw new AppError("Only office heads can access this dashboard.", 403);
    }

    return staffProfile;
  }

  private async getOfficeFilterForWorkload(actor: DashboardActor) {
    if (actor.role === Role.ADMIN) {
      return {};
    }

    if (actor.role !== Role.STAFF) {
      throw new AppError("You are not authorized to access workload analytics.", 403);
    }

    const staffProfile = await this.getRequiredOfficeHeadProfile(actor.id);
    return { id: staffProfile.officeId };
  }

  private getYearRange(year: number) {
    return {
      gte: new Date(Date.UTC(year, 0, 1)),
      lt: new Date(Date.UTC(year + 1, 0, 1))
    };
  }
}

export const dashboardService = new DashboardService();
