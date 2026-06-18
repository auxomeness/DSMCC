import type { RequestHandler } from "express";
import { successResponse } from "../../utils/response";
import { dashboardService } from "./dashboard.service";
import type { TopPublicConcernsQuery, TrendQuery } from "./dashboard.validation";

export const getAdminOverview: RequestHandler = async (_req, res, next) => {
  try {
    const overview = await dashboardService.getAdminOverview();
    res.status(200).json(successResponse("Admin dashboard retrieved successfully", overview));
  } catch (error) {
    next(error);
  }
};

export const getTenantOverview: RequestHandler = async (req, res, next) => {
  try {
    const overview = await dashboardService.getTenantOverview(req.user!);
    res.status(200).json(successResponse("Tenant dashboard retrieved successfully", overview));
  } catch (error) {
    next(error);
  }
};

export const getStaffOverview: RequestHandler = async (req, res, next) => {
  try {
    const overview = await dashboardService.getStaffOverview(req.user!);
    res.status(200).json(successResponse("Staff dashboard retrieved successfully", overview));
  } catch (error) {
    next(error);
  }
};

export const getOfficeHeadOverview: RequestHandler = async (req, res, next) => {
  try {
    const overview = await dashboardService.getOfficeHeadOverview(req.user!);
    res.status(200).json(successResponse("Office head dashboard retrieved successfully", overview));
  } catch (error) {
    next(error);
  }
};

export const getMostCommonConcerns: RequestHandler = async (_req, res, next) => {
  try {
    const analytics = await dashboardService.getMostCommonConcerns();
    res.status(200).json(successResponse("Most common concerns retrieved successfully", analytics));
  } catch (error) {
    next(error);
  }
};

export const getTopPublicConcerns: RequestHandler = async (req, res, next) => {
  try {
    const analytics = await dashboardService.getTopPublicConcerns(req.query as unknown as TopPublicConcernsQuery);
    res.status(200).json(successResponse("Top public concerns retrieved successfully", analytics));
  } catch (error) {
    next(error);
  }
};

export const getConcernsByStatus: RequestHandler = async (_req, res, next) => {
  try {
    const analytics = await dashboardService.getConcernsByStatus();
    res.status(200).json(successResponse("Concerns by status retrieved successfully", analytics));
  } catch (error) {
    next(error);
  }
};

export const getConcernsByOffice: RequestHandler = async (_req, res, next) => {
  try {
    const analytics = await dashboardService.getConcernsByOffice();
    res.status(200).json(successResponse("Concerns by office retrieved successfully", analytics));
  } catch (error) {
    next(error);
  }
};

export const getAppointmentsByOffice: RequestHandler = async (_req, res, next) => {
  try {
    const analytics = await dashboardService.getAppointmentsByOffice();
    res.status(200).json(successResponse("Appointments by office retrieved successfully", analytics));
  } catch (error) {
    next(error);
  }
};

export const getOfficeWorkload: RequestHandler = async (req, res, next) => {
  try {
    const analytics = await dashboardService.getOfficeWorkload(req.user!);
    res.status(200).json(successResponse("Office workload retrieved successfully", analytics));
  } catch (error) {
    next(error);
  }
};

export const getStaffWorkload: RequestHandler = async (req, res, next) => {
  try {
    const analytics = await dashboardService.getStaffWorkload(req.user!);
    res.status(200).json(successResponse("Staff workload retrieved successfully", analytics));
  } catch (error) {
    next(error);
  }
};

export const getMonthlyConcernTrends: RequestHandler = async (req, res, next) => {
  try {
    const trends = await dashboardService.getMonthlyConcernTrends(req.query as unknown as TrendQuery);
    res.status(200).json(successResponse("Monthly concern trends retrieved successfully", trends));
  } catch (error) {
    next(error);
  }
};

export const getMonthlyAppointmentTrends: RequestHandler = async (req, res, next) => {
  try {
    const trends = await dashboardService.getMonthlyAppointmentTrends(req.query as unknown as TrendQuery);
    res.status(200).json(successResponse("Monthly appointment trends retrieved successfully", trends));
  } catch (error) {
    next(error);
  }
};

export const getFeedbackAnalytics: RequestHandler = async (_req, res, next) => {
  try {
    const analytics = await dashboardService.getFeedbackAnalytics();
    res.status(200).json(successResponse("Feedback analytics retrieved successfully", analytics));
  } catch (error) {
    next(error);
  }
};
