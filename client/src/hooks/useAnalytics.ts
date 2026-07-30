import { useQuery } from "@tanstack/react-query";
import {
  getDashboardOverview,
  getCoreDistribution,
  getPerformanceQuality,
  getAiImpactOverview,
} from "../services/analytics.service";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: getDashboardOverview,
    staleTime: 5 * 60 * 1000,
  });
};

export const useDistributionStats = () => {
  return useQuery({
    queryKey: ["distributionStats"],
    queryFn: getCoreDistribution,
    staleTime: 5 * 60 * 1000,
  });
};

export const usePerformanceStats = () => {
  return useQuery({
    queryKey: ["performanceStats"],
    queryFn: getPerformanceQuality,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAiImpactStats = () => {
  return useQuery({
    queryKey: ["aiImpactStats"],
    queryFn: getAiImpactOverview,
    staleTime: 5 * 60 * 1000,
  });
};
