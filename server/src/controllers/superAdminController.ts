import { Request, Response } from "express";
import * as superAdminService from "../services/superAdmin/superAdminService";
import {
  CreateAdminType,
  CreateStaffType,
  UpdateUserType,
  FilterUsersQuery,
  FilterEditRequestsQuery,
  BroadcastAnnouncementType,
} from "../types/superAdmin.types";

export const registerAdmin = async (
  req: Request<{}, {}, CreateAdminType>,
  res: Response,
) => {
  const result = await superAdminService.registerAdmin(req.body);
  res.status(result.status).json({ message: result.message, ...result.data });
};

export const registerStaff = async (
  req: Request<{}, {}, CreateStaffType>,
  res: Response,
) => {
  const result = await superAdminService.registerStaff(req.body);
  res.status(result.status).json({ message: result.message, ...result.data });
};

export const getAllUsers = async (
  req: Request<{}, {}, {}, FilterUsersQuery>,
  res: Response,
) => {
  const result = await superAdminService.getAllUsers(req.query);
  res.status(result.status).json({ message: result.message, ...result.data });
};

export const getUserById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const result = await superAdminService.getUserById(req.params.id);
  res.status(result.status).json({ message: result.message, ...result.data });
};

export const updateUser = async (
  req: Request<{ id: string }, {}, UpdateUserType>,
  res: Response,
) => {
  const result = await superAdminService.updateUser(req.params.id, req.body);
  res.status(result.status).json({ message: result.message, ...result.data });
};

export const deactivateUser = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const result = await superAdminService.toggleUserActiveStatus(
    req.params.id,
    false,
  );
  res.status(result.status).json({ message: result.message, ...result.data });
};

export const reactivateUser = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const result = await superAdminService.toggleUserActiveStatus(
    req.params.id,
    true,
  );
  res.status(result.status).json({ message: result.message, ...result.data });
};

// =======================
// EDIT DETAILS REQUESTS
// =======================

export const getEditRequests = async (
  req: Request<{}, {}, {}, FilterEditRequestsQuery>,
  res: Response,
) => {
  const result = await superAdminService.getEditRequests(req.query);
  res.status(result.status).json({ message: result.message, ...result.data });
};

export const approveEditRequest = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const result = await superAdminService.approveEditRequest(req.params.id);
  res.status(result.status).json({ message: result.message, ...result.data });
};

export const rejectEditRequest = async (
  req: Request<{ id: string; reason: string }>,
  res: Response,
) => {
  const result = await superAdminService.rejectEditRequest(
    req.params.id,
    req.body.reason,
  );
  res.status(result.status).json({ message: result.message, ...result.data });
};

export const getDashboardAnalytics = async (req: Request, res: Response) => {
  const result = await superAdminService.getDashboardAnalytics();
  res.status(result.status).json({ message: result.message, ...result.data });
};

export const sendBroadcast = async (
  req: Request<{}, {}, BroadcastAnnouncementType>,
  res: Response,
) => {
  const result = await superAdminService.sendBroadcast(req.body);
  res.status(result.status).json({ message: result.message, ...result.data });
};
