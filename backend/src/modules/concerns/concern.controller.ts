import type { RequestHandler } from "express";
import { successResponse } from "../../utils/response";
import { concernService } from "./concern.service";

export const createConcern: RequestHandler = async (req, res, next) => {
  try {
    const concern = await concernService.createConcern(req.user!, req.body);
    res.status(201).json(successResponse("Concern created successfully", { concern }));
  } catch (error) {
    next(error);
  }
};

export const listConcerns: RequestHandler = async (req, res, next) => {
  try {
    const concerns = await concernService.listConcerns(req.user!, req.query);
    res.status(200).json(successResponse("Concerns retrieved successfully", { concerns }));
  } catch (error) {
    next(error);
  }
};

export const getConcernById: RequestHandler = async (req, res, next) => {
  try {
    const concern = await concernService.getConcernById(req.user!, req.params.id);
    res.status(200).json(successResponse("Concern retrieved successfully", { concern }));
  } catch (error) {
    next(error);
  }
};

export const getConcernHistory: RequestHandler = async (req, res, next) => {
  try {
    const history = await concernService.getConcernHistory(req.user!, req.params.id);
    res.status(200).json(successResponse("Concern history retrieved successfully", { history }));
  } catch (error) {
    next(error);
  }
};

export const getAllowedTransitions: RequestHandler = async (req, res, next) => {
  try {
    const allowedTransitions = await concernService.getAllowedTransitions(req.user!, req.params.id);
    res.status(200).json(successResponse("Allowed transitions retrieved successfully", { allowedTransitions }));
  } catch (error) {
    next(error);
  }
};

export const acceptConcern: RequestHandler = async (req, res, next) => {
  try {
    const concern = await concernService.acceptConcern(req.user!, req.params.id, req.body);
    res.status(200).json(successResponse("Concern accepted successfully", { concern }));
  } catch (error) {
    next(error);
  }
};

export const rejectConcern: RequestHandler = async (req, res, next) => {
  try {
    const concern = await concernService.rejectConcern(req.user!, req.params.id, req.body);
    res.status(200).json(successResponse("Concern rejected successfully", { concern }));
  } catch (error) {
    next(error);
  }
};

export const assignConcern: RequestHandler = async (req, res, next) => {
  try {
    const concern = await concernService.assignConcern(req.user!, req.params.id, req.body);
    res.status(200).json(successResponse("Concern assigned successfully", { concern }));
  } catch (error) {
    next(error);
  }
};

export const reassignConcern: RequestHandler = async (req, res, next) => {
  try {
    const concern = await concernService.reassignConcern(req.user!, req.params.id, req.body);
    res.status(200).json(successResponse("Concern reassigned successfully", { concern }));
  } catch (error) {
    next(error);
  }
};

export const startConcern: RequestHandler = async (req, res, next) => {
  try {
    const concern = await concernService.startConcern(req.user!, req.params.id, req.body);
    res.status(200).json(successResponse("Concern work started successfully", { concern }));
  } catch (error) {
    next(error);
  }
};

export const resolveConcern: RequestHandler = async (req, res, next) => {
  try {
    const concern = await concernService.resolveConcern(req.user!, req.params.id, req.body);
    res.status(200).json(successResponse("Concern resolved and sent for tenant approval", { concern }));
  } catch (error) {
    next(error);
  }
};

export const approveResolution: RequestHandler = async (req, res, next) => {
  try {
    const concern = await concernService.approveResolution(req.user!, req.params.id, req.body);
    res.status(200).json(successResponse("Concern resolution approved successfully", { concern }));
  } catch (error) {
    next(error);
  }
};

export const reopenConcern: RequestHandler = async (req, res, next) => {
  try {
    const concern = await concernService.reopenConcern(req.user!, req.params.id, req.body);
    res.status(200).json(successResponse("Concern reopened successfully", { concern }));
  } catch (error) {
    next(error);
  }
};
