import type { ConcernCategory, ConcernStatus } from "@prisma/client";

export type DashboardActor = {
  id: string;
  role: "ADMIN" | "STAFF" | "TENANT";
  email: string;
};

export type CommonConcernAnalytics = {
  category: ConcernCategory;
  count: number;
};

export type ConcernStatusAnalytics = {
  status: ConcernStatus;
  count: number;
};

export type MonthlyTrend = {
  month: number;
  count: number;
};
