import type { RequestHandler } from "express";
import { successResponse } from "../../utils/response";
import { appointmentService } from "./appointment.service";
import type { AvailabilityQuery, ListAppointmentsQuery } from "./appointment.validation";

export const createAppointment: RequestHandler = async (req, res, next) => {
  try {
    const appointment = await appointmentService.createAppointment(req.user!, req.body);
    res.status(201).json(successResponse("Appointment requested successfully", { appointment }));
  } catch (error) {
    next(error);
  }
};

export const listAppointments: RequestHandler = async (req, res, next) => {
  try {
    const appointments = await appointmentService.listAppointments(req.user!, req.query as ListAppointmentsQuery);
    res.status(200).json(successResponse("Appointments retrieved successfully", { appointments }));
  } catch (error) {
    next(error);
  }
};

export const getAppointmentById: RequestHandler = async (req, res, next) => {
  try {
    const appointment = await appointmentService.getAppointmentById(req.user!, req.params.id);
    res.status(200).json(successResponse("Appointment retrieved successfully", { appointment }));
  } catch (error) {
    next(error);
  }
};

export const getAvailability: RequestHandler = async (req, res, next) => {
  try {
    const availability = await appointmentService.getAvailability(req.user!, req.query as AvailabilityQuery);
    res.status(200).json(successResponse("Appointment availability retrieved successfully", { availability }));
  } catch (error) {
    next(error);
  }
};

export const approveAppointment: RequestHandler = async (req, res, next) => {
  try {
    const appointment = await appointmentService.approveAppointment(req.user!, req.params.id, req.body);
    res.status(200).json(successResponse("Appointment approved successfully", { appointment }));
  } catch (error) {
    next(error);
  }
};

export const declineAppointment: RequestHandler = async (req, res, next) => {
  try {
    const appointment = await appointmentService.declineAppointment(req.user!, req.params.id, req.body);
    res.status(200).json(successResponse("Appointment declined successfully", { appointment }));
  } catch (error) {
    next(error);
  }
};

export const cancelAppointment: RequestHandler = async (req, res, next) => {
  try {
    const appointment = await appointmentService.cancelAppointment(req.user!, req.params.id, req.body);
    res.status(200).json(successResponse("Appointment cancelled successfully", { appointment }));
  } catch (error) {
    next(error);
  }
};

export const completeAppointment: RequestHandler = async (req, res, next) => {
  try {
    const appointment = await appointmentService.completeAppointment(req.user!, req.params.id, req.body);
    res.status(200).json(successResponse("Appointment completed successfully", { appointment }));
  } catch (error) {
    next(error);
  }
};
