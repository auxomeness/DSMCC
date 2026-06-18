import type { RequestHandler } from "express";
import { successResponse } from "../../utils/response";
import { userService } from "./user.service";

export const listUsers: RequestHandler = async (req, res, next) => {
  try {
    const result = await userService.listUsers(req.query);
    res.status(200).json({
      ...successResponse("Users retrieved successfully", result.users),
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById: RequestHandler = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json(successResponse("User retrieved successfully", { user }));
  } catch (error) {
    next(error);
  }
};

export const approveTenant: RequestHandler = async (req, res, next) => {
  try {
    const user = await userService.approveTenant(req.params.id);
    res.status(200).json(successResponse("Tenant approved successfully", { user }));
  } catch (error) {
    next(error);
  }
};

export const rejectTenant: RequestHandler = async (req, res, next) => {
  try {
    const user = await userService.rejectTenant(req.params.id);
    res.status(200).json(successResponse("Tenant rejected successfully", { user }));
  } catch (error) {
    next(error);
  }
};

export const suspendTenant: RequestHandler = async (req, res, next) => {
  try {
    const user = await userService.suspendTenant(req.params.id);
    res.status(200).json(successResponse("Tenant suspended successfully", { user }));
  } catch (error) {
    next(error);
  }
};

export const reactivateTenant: RequestHandler = async (req, res, next) => {
  try {
    const user = await userService.reactivateTenant(req.params.id);
    res.status(200).json(successResponse("Tenant reactivated successfully", { user }));
  } catch (error) {
    next(error);
  }
};
