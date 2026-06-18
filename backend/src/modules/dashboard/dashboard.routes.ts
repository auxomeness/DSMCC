import { Role } from "@prisma/client";
import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireAdminOrOfficeHead, requireOfficeHead } from "../../middleware/office.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { validate } from "../../middleware/validation.middleware";
import {
  getAdminOverview,
  getAppointmentsByOffice,
  getConcernsByOffice,
  getConcernsByStatus,
  getFeedbackAnalytics,
  getMonthlyAppointmentTrends,
  getMonthlyConcernTrends,
  getMostCommonConcerns,
  getOfficeHeadOverview,
  getOfficeWorkload,
  getStaffOverview,
  getStaffWorkload,
  getTenantOverview,
  getTopPublicConcerns
} from "./dashboard.controller";
import { emptyDashboardQuerySchema, topPublicConcernsSchema, trendQuerySchema } from "./dashboard.validation";

export const dashboardRoutes = Router();

dashboardRoutes.use(requireAuth);

dashboardRoutes.get(
  "/admin/overview",
  requireRole([Role.ADMIN]),
  validate(emptyDashboardQuerySchema),
  getAdminOverview
);
dashboardRoutes.get(
  "/tenant/overview",
  requireRole([Role.TENANT]),
  validate(emptyDashboardQuerySchema),
  getTenantOverview
);
dashboardRoutes.get(
  "/staff/overview",
  requireRole([Role.STAFF]),
  validate(emptyDashboardQuerySchema),
  getStaffOverview
);
dashboardRoutes.get(
  "/office-head/overview",
  requireRole([Role.STAFF]),
  requireOfficeHead,
  validate(emptyDashboardQuerySchema),
  getOfficeHeadOverview
);

dashboardRoutes.get("/concerns/common", validate(emptyDashboardQuerySchema), getMostCommonConcerns);
dashboardRoutes.get("/concerns/top-public", validate(topPublicConcernsSchema), getTopPublicConcerns);
dashboardRoutes.get(
  "/concerns/status",
  requireRole([Role.ADMIN]),
  validate(emptyDashboardQuerySchema),
  getConcernsByStatus
);
dashboardRoutes.get(
  "/concerns/offices",
  requireRole([Role.ADMIN]),
  validate(emptyDashboardQuerySchema),
  getConcernsByOffice
);
dashboardRoutes.get(
  "/appointments/offices",
  requireRole([Role.ADMIN]),
  validate(emptyDashboardQuerySchema),
  getAppointmentsByOffice
);

dashboardRoutes.get(
  "/workload/offices",
  requireRole([Role.ADMIN, Role.STAFF]),
  requireAdminOrOfficeHead,
  validate(emptyDashboardQuerySchema),
  getOfficeWorkload
);
dashboardRoutes.get(
  "/workload/staff",
  requireRole([Role.ADMIN, Role.STAFF]),
  requireAdminOrOfficeHead,
  validate(emptyDashboardQuerySchema),
  getStaffWorkload
);

dashboardRoutes.get(
  "/trends/concerns",
  requireRole([Role.ADMIN]),
  validate(trendQuerySchema),
  getMonthlyConcernTrends
);
dashboardRoutes.get(
  "/trends/appointments",
  requireRole([Role.ADMIN]),
  validate(trendQuerySchema),
  getMonthlyAppointmentTrends
);
dashboardRoutes.get("/feedback", requireRole([Role.ADMIN]), validate(emptyDashboardQuerySchema), getFeedbackAnalytics);
