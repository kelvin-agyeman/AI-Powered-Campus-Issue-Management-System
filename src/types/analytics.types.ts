export interface DepartmentAnalyticsResult {
  department: string;
  totalIssues: number;
  activeIssues: number;
  resolvedIssues: number;
}

export interface CategoryAnalyticsResult {
  category: string;
  count: number;
}

export interface PriorityAnalyticsResult {
  priority: string;
  count: number;
}

export interface ResolutionTimeResult {
  category: string;
  averageResolutionHours: number;
}

export interface StaffPerformanceResult {
  staffId: string;
  staffName: string;
  resolvedCount: number;
  activeCount: number;
  averageResolutionHours: number | null;
}

export interface DuplicateAnalyticsResult {
  totalIssues: number;
  duplicateIssues: number;
  uniqueIssues: number;
  duplicateRatePercentage: number;
}

export interface AiDecisionAnalyticsResult {
  totalIssues: number;
  aiAssistedCount: number;
  categoryMatchRate: number;
  departmentMatchRate: number;
  overallAccuracy: number;
}
