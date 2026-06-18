import type { RequestHandler } from "express";
import { successResponse } from "../../utils/response";
import { feedbackService } from "./feedback.service";

export const createFeedback: RequestHandler = async (req, res, next) => {
  try {
    await feedbackService.createFeedback(req.body);
    res.status(201).json(successResponse("Feedback submitted successfully"));
  } catch (error) {
    next(error);
  }
};

export const listFeedbacks: RequestHandler = async (req, res, next) => {
  try {
    const result = await feedbackService.listFeedbacks(req.query);
    res.status(200).json({
      ...successResponse("Feedback retrieved successfully", result.feedbacks),
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

export const getFeedbackById: RequestHandler = async (req, res, next) => {
  try {
    const feedback = await feedbackService.getFeedbackById(req.params.id);
    res.status(200).json(successResponse("Feedback retrieved successfully", { feedback }));
  } catch (error) {
    next(error);
  }
};

export const deleteFeedback: RequestHandler = async (req, res, next) => {
  try {
    await feedbackService.deleteFeedback(req.params.id);
    res.status(200).json(successResponse("Feedback deleted successfully"));
  } catch (error) {
    next(error);
  }
};
