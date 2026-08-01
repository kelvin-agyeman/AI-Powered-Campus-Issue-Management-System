import {
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  BrainCircuit,
  Copy,
  TrendingUp,
  Building2,
  Loader2,
} from "lucide-react";
import { useSuperAdminDashboardAnalytics } from "../../hooks/useSuperAdmin";
import {
  useAiImpactStats,
  usePerformanceStats,
  useDistributionStats,
} from "../../hooks/useAnalytics";

export const SuperAdminDashboard = () => {
  // Fetch data using the provided hooks
  const { data: saData, isLoading: isSaLoading } =
    useSuperAdminDashboardAnalytics();
  const { data: aiData, isLoading: isAiLoading } = useAiImpactStats();
  const { data: perfData, isLoading: isPerfLoading } = usePerformanceStats();
  const { data: distData, isLoading: isDistLoading } = useDistributionStats();

  const isLoading =
    isSaLoading || isAiLoading || isPerfLoading || isDistLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-gray-500">
          <Loader2 className="h-8 w-8 animate-spin text-[#4a0400]" />
          <p>Loading system analytics...</p>
        </div>
      </div>
    );
  }

  // Safely extract data with fallbacks
  const analytics = saData?.analytics || {
    users: { students: 0, staff: 0, admins: 0, total: 0 },
    issues: { open: 0, resolved: 0, total: 0 },
    requests: { pendingEdits: 0 },
  };

  const ai = aiData?.data || {
    aiAssistedCount: 0,
    overallAccuracy: 0,
    categoryMatchRate: 0,
    departmentMatchRate: 0,
  };

  const duplicates = perfData?.data?.duplicates || {
    totalIssues: 0,
    duplicateIssues: 0,
    duplicateRatePercentage: 0,
  };

  const categories = distData?.data?.categories || [];
  const totalCategoriesCount = categories.reduce(
    (acc, cat) => acc + cat.count,
    0,
  );

  const departments = distData?.data?.departments || [];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Global analytics, system health, and AI performance metrics.
        </p>
      </div>

      {/* Top Row: Primary Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Users Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Total Users</p>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-gray-900">
              {analytics.users.total.toLocaleString()}
            </h3>
            <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
              <span>{analytics.users.students} Students</span>
              <span>{analytics.users.staff} Staff</span>
              <span>{analytics.users.admins} Admins</span>
            </div>
          </div>
        </div>

        {/* Active Issues Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Open Issues</p>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <AlertCircle size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-gray-900">
              {analytics.issues.open}
            </h3>
            <p className="mt-2 text-xs text-gray-500">Across all departments</p>
          </div>
        </div>

        {/* Resolved Issues Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Resolved Issues</p>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-gray-900">
              {analytics.issues.resolved}
            </h3>
            <p className="mt-2 text-xs text-gray-500">Lifetime resolutions</p>
          </div>
        </div>

        {/* Pending Requests Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Pending ID Edits
            </p>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <Clock size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-gray-900">
              {analytics.requests.pendingEdits}
            </h3>
            <p className="mt-2 text-xs font-medium text-purple-600">
              Requires admin action
            </p>
          </div>
        </div>
      </div>

      {/* Middle Row: System Intelligence */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* AI Performance */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
            <BrainCircuit className="text-indigo-600" size={20} />
            <h2 className="font-semibold text-gray-900">AI Routing Accuracy</h2>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-8">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-indigo-100">
                <span className="text-2xl font-bold text-indigo-700">
                  {ai.overallAccuracy.toFixed(1)}%
                </span>
                {/* Visual ring representation */}
                <svg
                  className="absolute inset-0 h-full w-full -rotate-90 transform"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-indigo-500"
                    strokeDasharray={`${ai.overallAccuracy * 3} 300`}
                  />
                </svg>
              </div>
              <p className="mt-3 text-sm font-medium text-gray-700">
                Overall Accuracy
              </p>
              <p className="text-xs text-gray-500">
                Based on {ai.aiAssistedCount} automated tickets
              </p>
            </div>

            <div className="flex flex-col justify-center space-y-5">
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-gray-600">Category Match</span>
                  <span className="font-medium">
                    {ai.categoryMatchRate.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100">
                  <div
                    className="h-2 rounded-full bg-indigo-500"
                    style={{ width: `${ai.categoryMatchRate}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-gray-600">Department Match</span>
                  <span className="font-medium">
                    {ai.departmentMatchRate.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100">
                  <div
                    className="h-2 rounded-full bg-indigo-400"
                    style={{ width: `${ai.departmentMatchRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Duplicate Analysis */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
            <Copy className="text-rose-600" size={20} />
            <h2 className="font-semibold text-gray-900">
              Spam & Duplicate Filter
            </h2>
          </div>
          <div className="mt-6 flex h-full flex-col justify-center gap-6">
            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Duplicate Rate
                </p>
                <h4 className="text-2xl font-bold text-gray-900">
                  {duplicates.duplicateRatePercentage.toFixed(1)}%
                </h4>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-500">
                  Filtered Issues
                </p>
                <h4 className="text-2xl font-bold text-rose-600">
                  {duplicates.duplicateIssues}
                </h4>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              The AI has successfully identified and flagged{" "}
              <span className="font-semibold text-gray-900">
                {duplicates.duplicateIssues}
              </span>{" "}
              overlapping reports out of {duplicates.totalIssues} total
              submissions, streamlining staff workflows.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Row: Distributions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Category Trends */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
            <TrendingUp className="text-gray-700" size={20} />
            <h2 className="font-semibold text-gray-900">Category Trends</h2>
          </div>
          <div className="mt-5 space-y-4">
            {categories.map((cat) => {
              const percentage = totalCategoriesCount
                ? ((cat.count / totalCategoriesCount) * 100).toFixed(1)
                : 0;
              return (
                <div key={cat.category || "Unknown"}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium text-gray-700">
                      {cat.category || "Uncategorized"}
                    </span>
                    <span className="text-gray-500">{cat.count} issues</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-red-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
            {categories.length === 0 && (
              <p className="text-sm text-gray-500">
                No category data available.
              </p>
            )}
          </div>
        </div>

        {/* Department Load */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
            <Building2 className="text-gray-700" size={20} />
            <h2 className="font-semibold text-gray-900">Department Workload</h2>
          </div>
          <div className="mt-5 overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Department
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Active
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {departments.map((dept) => (
                  <tr key={dept.department || "Unknown"}>
                    <td className="px-4 py-3 text-sm font-medium whitespace-nowrap text-gray-900">
                      {dept.department || "Unassigned"}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold whitespace-nowrap text-amber-600">
                      {dept.activeIssues}
                    </td>
                    <td className="px-4 py-3 text-right text-sm whitespace-nowrap text-gray-500">
                      {dept.totalIssues}
                    </td>
                  </tr>
                ))}
                {departments.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-4 text-center text-sm text-gray-500"
                    >
                      No department data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
