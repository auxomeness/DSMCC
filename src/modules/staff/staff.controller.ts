import type { RequestHandler } from "express";
import { successResponse } from "../../utils/response";
import { staffService } from "./staff.service";

export const createStaff: RequestHandler = async (req, res, next) => {
  try {
    const staff = await staffService.createStaff(req.body);
    res.status(201).json(successResponse("Staff profile created successfully", { staff }));
  } catch (error) {
    next(error);
  }
};

export const listStaff: RequestHandler = async (req, res, next) => {
  try {
    const staff = await staffService.listStaff(req.query);
    res.status(200).json(successResponse("Staff profiles retrieved successfully", { staff }));
  } catch (error) {
    next(error);
  }
};

export const getStaffById: RequestHandler = async (req, res, next) => {
  try {
    const staff = await staffService.getStaffById(req.params.id);
    res.status(200).json(successResponse("Staff profile retrieved successfully", { staff }));
  } catch (error) {
    next(error);
  }
};

export const updateStaff: RequestHandler = async (req, res, next) => {
  try {
    const staff = await staffService.updateStaff(req.params.id, req.body);
    res.status(200).json(successResponse("Staff profile updated successfully", { staff }));
  } catch (error) {
    next(error);
  }
};

export const deleteStaff: RequestHandler = async (req, res, next) => {
  try {
    const staff = await staffService.deleteStaff(req.params.id);
    res.status(200).json(successResponse("Staff profile soft deleted successfully", { staff }));
  } catch (error) {
    next(error);
  }
};
