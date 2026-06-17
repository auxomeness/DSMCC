import type { RequestHandler } from "express";
import { authService } from "./auth.service";
import { successResponse } from "../../utils/response";

export const registerTenant: RequestHandler = async (req, res, next) => {
  try {
    const user = await authService.registerTenant(req.body);
    res.status(201).json(successResponse("Registration submitted for approval", { user }));
  } catch (error) {
    next(error);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json(successResponse("Login successful", result));
  } catch (error) {
    next(error);
  }
};

export const refreshToken: RequestHandler = async (req, res, next) => {
  try {
    const result = await authService.refreshToken(req.body);
    res.status(200).json(successResponse("Access token refreshed", result));
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = async (req, res, next) => {
  try {
    await authService.logout(req.body);
    res.status(200).json(successResponse("Logout successful"));
  } catch (error) {
    next(error);
  }
};

export const getMe: RequestHandler = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user!.id);
    res.status(200).json(successResponse("Current user retrieved", { user }));
  } catch (error) {
    next(error);
  }
};
