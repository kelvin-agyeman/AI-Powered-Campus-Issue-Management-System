export interface DashboardStats {
  totals: {
    users: number;
    issues: number;
  };
  statusBreakdown: Record<string, number>;
  categoryTrends: Array<{
    _id: string;
    count: number;
  }>;
  staffWorkload: Array<{
    _id: string;
    staffName: string;
    activeIssues: number;
    resolvedIssues: number;
  }>;
}

export interface DistributionStats {
  departments: Array<{
    department: string | null;
    totalIssues: number;
    activeIssues: number;
    resolvedIssues: number;
  }>;
  categories: Array<{
    category: string | null;
    count: number;
  }>;
  priorities: Array<{
    priority: string | null;
    count: number;
  }>;
}

export interface PerformanceStats {
  resolutionTimes: Array<{
    category: string | null;
    averageResolutionHours: number | null;
  }>;
  staffPerformance: Array<{
    staffId: string;
    staffName: string;
    resolvedCount: number;
    activeCount: number;
    averageResolutionHours: number | null;
  }>;
  duplicates: {
    totalIssues: number;
    duplicateIssues: number;
    uniqueIssues: number;
    duplicateRatePercentage: number;
  };
}

export interface AiImpactStats {
  totalIssues: number;
  aiAssistedCount: number;
  categoryMatchRate: number;
  departmentMatchRate: number;
  overallAccuracy: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
