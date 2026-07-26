import {
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  BrainCircuit,
  Copy,
  TrendingUp,
  Building2,
} from "lucide-react";

export const SuperAdminDashboard = () => {
  // Mock data representing the combined payloads from getDashboardAnalytics,
  // getAiDecisionAnalytics, getDuplicateAnalytics, and getDashboardStats
  const analytics = {
    users: { students: 1250, staff: 45, admins: 8, total: 1303 },
    issues: { open: 142, resolved: 856, total: 998 },
    requests: { pendingEdits: 12 },
    ai: {
      aiAssistedCount: 450,
      overallAccuracy: 88.5,
      categoryMatchRate: 91.2,
      departmentMatchRate: 85.8,
    },
    duplicates: {
      totalIssues: 998,
      duplicateIssues: 45,
      duplicateRatePercentage: 4.5,
    },
    categories: [
      { category: "Plumbing", count: 340, percentage: 34 },
      { category: "Electrical", count: 280, percentage: 28 },
      { category: "Carpentry", count: 190, percentage: 19 },
      { category: "IT Support", count: 188, percentage: 19 },
    ],
    departments: [
      { department: "Maintenance", totalIssues: 810, activeIssues: 120 },
      { department: "IT Department", totalIssues: 188, activeIssues: 22 },
    ],
  };

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
                  {analytics.ai.overallAccuracy}%
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
                    strokeDasharray={`${analytics.ai.overallAccuracy * 3} 300`}
                  />
                </svg>
              </div>
              <p className="mt-3 text-sm font-medium text-gray-700">
                Overall Accuracy
              </p>
              <p className="text-xs text-gray-500">
                Based on {analytics.ai.aiAssistedCount} automated tickets
              </p>
            </div>

            <div className="flex flex-col justify-center space-y-5">
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-gray-600">Category Match</span>
                  <span className="font-medium">
                    {analytics.ai.categoryMatchRate}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100">
                  <div
                    className="h-2 rounded-full bg-indigo-500"
                    style={{ width: `${analytics.ai.categoryMatchRate}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-gray-600">Department Match</span>
                  <span className="font-medium">
                    {analytics.ai.departmentMatchRate}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100">
                  <div
                    className="h-2 rounded-full bg-indigo-400"
                    style={{ width: `${analytics.ai.departmentMatchRate}%` }}
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
                  {analytics.duplicates.duplicateRatePercentage}%
                </h4>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-500">
                  Filtered Issues
                </p>
                <h4 className="text-2xl font-bold text-rose-600">
                  {analytics.duplicates.duplicateIssues}
                </h4>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              The AI has successfully identified and flagged{" "}
              <span className="font-semibold text-gray-900">
                {analytics.duplicates.duplicateIssues}
              </span>{" "}
              overlapping reports out of {analytics.duplicates.totalIssues}{" "}
              total submissions, streamlining staff workflows.
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
            {analytics.categories.map((cat) => (
              <div key={cat.category}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium text-gray-700">
                    {cat.category}
                  </span>
                  <span className="text-gray-500">{cat.count} issues</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100">
                  <div
                    className="h-2 rounded-full bg-red-500"
                    style={{ width: `${cat.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
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
                {analytics.departments.map((dept) => (
                  <tr key={dept.department}>
                    <td className="px-4 py-3 text-sm font-medium whitespace-nowrap text-gray-900">
                      {dept.department}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold whitespace-nowrap text-amber-600">
                      {dept.activeIssues}
                    </td>
                    <td className="px-4 py-3 text-right text-sm whitespace-nowrap text-gray-500">
                      {dept.totalIssues}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
