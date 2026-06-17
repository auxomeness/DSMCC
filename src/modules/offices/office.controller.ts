import type { RequestHandler } from "express";
import { successResponse } from "../../utils/response";
import { officeService } from "./office.service";

export const createOffice: RequestHandler = async (req, res, next) => {
  try {
    const office = await officeService.createOffice(req.body);
    res.status(201).json(successResponse("Office created successfully", { office }));
  } catch (error) {
    next(error);
  }
};

export const listOffices: RequestHandler = async (req, res, next) => {
  try {
    const offices = await officeService.listOffices(req.query);
    res.status(200).json(successResponse("Offices retrieved successfully", { offices }));
  } catch (error) {
    next(error);
  }
};

export const getOfficeById: RequestHandler = async (req, res, next) => {
  try {
    const office = await officeService.getOfficeById(req.params.id);
    res.status(200).json(successResponse("Office retrieved successfully", { office }));
  } catch (error) {
    next(error);
  }
};

export const updateOffice: RequestHandler = async (req, res, next) => {
  try {
    const office = await officeService.updateOffice(req.params.id, req.body);
    res.status(200).json(successResponse("Office updated successfully", { office }));
  } catch (error) {
    next(error);
  }
};

export const deleteOffice: RequestHandler = async (req, res, next) => {
  try {
    const result = await officeService.deleteOffice(req.params.id);
    const message = result.deactivatedOnly
      ? "Office has dependencies and was deactivated instead of soft deleted"
      : "Office soft deleted successfully";

    res.status(200).json(successResponse(message, result));
  } catch (error) {
    next(error);
  }
};
