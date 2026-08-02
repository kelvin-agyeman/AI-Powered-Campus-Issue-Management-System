import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as analyticsService from "../services/analytics/analyticsService";

export const getAdminDashboard = async (req: Request, res: Response) => {
  try {
    const data = await analyticsService.getDashboardStats();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Dashboard statistics retrieved successfully",
      data,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to retrieve dashboard statistics",
    });
  }
};

export const getCoreDistributionAnalytics = async (
  req: Request,
  res: Response,
) => {
  try {
    const [departments, categories, priorities] = await Promise.all([
      analyticsService.getDepartmentAnalytics(),
      analyticsService.getCategoryAnalytics(),
      analyticsService.getPriorityAnalytics(),
    ]);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Core distribution analytics retrieved successfully",
      data: {
        departments,
        categories,
        priorities,
      },
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to compile distribution metrics",
    });
  }
};

export const getPerformanceAndQualityAnalytics = async (
  req: Request,
  res: Response,
) => {
  try {
    const [resolutionTimes, staffPerformance, duplicates] = await Promise.all([
      analyticsService.getResolutionTimeAnalytics(),
      analyticsService.getStaffPerformanceAnalytics(),
      analyticsService.getDuplicateAnalytics(),
    ]);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Performance and quality analytics retrieved successfully",
      data: {
        resolutionTimes,
        staffPerformance,
        duplicates,
      },
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to compile performance metrics",
    });
  }
};

export const getAiImpactAnalytics = async (req: Request, res: Response) => {
  try {
    const aiAnalytics = await analyticsService.getAiDecisionAnalytics();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "AI decision analytics retrieved successfully",
      data: aiAnalytics,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to compile AI analytics",
    });
  }
};
