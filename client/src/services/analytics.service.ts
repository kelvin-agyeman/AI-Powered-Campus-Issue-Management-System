import customFetch from "../utils/customFetch";
import type {
  DashboardStats,
  DistributionStats,
  PerformanceStats,
  AiImpactStats,
  ApiResponse,
} from "../types/analytics.types";

export const getDashboardOverview = async (): Promise<
  ApiResponse<DashboardStats>
> => {
  const { data } = await customFetch.get("/analytics/dashboard");
  return data;
};

export const getCoreDistribution = async (): Promise<
  ApiResponse<DistributionStats>
> => {
  const { data } = await customFetch.get("/analytics/distribution");
  return data;
};

export const getPerformanceQuality = async (): Promise<
  ApiResponse<PerformanceStats>
> => {
  const { data } = await customFetch.get("/analytics/performance");
  return data;
};

export const getAiImpactOverview = async (): Promise<
  ApiResponse<AiImpactStats>
> => {
  const { data } = await customFetch.get("/analytics/ai-impact");
  return data;
};
