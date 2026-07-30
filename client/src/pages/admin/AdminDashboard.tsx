import { Link } from "react-router-dom";
import {
  ClipboardList,
  Clock,
  BrainCircuit,
  CopySlash,
  Loader2,
  AlertCircle,
  Timer,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import {
  useDashboardStats,
  useDistributionStats,
  usePerformanceStats,
  useAiImpactStats,
} from "../../hooks/useAnalytics";

// Shades of green for all charts
const GREEN_SHADES = [
  "#064E3B",
  "#065F46",
  "#047857",
  "#059669",
  "#10B981",
  "#34D399",
  "#6EE7B7",
];

export const AdminDashboard = () => {
  const {
    data: dashboardRes,
    isLoading: isLoadingDash,
    isError: isDashError,
  } = useDashboardStats();
  const {
    data: distRes,
    isLoading: isLoadingDist,
    isError: isDistError,
  } = useDistributionStats();
  const {
    data: perfRes,
    isLoading: isLoadingPerf,
    isError: isPerfError,
  } = usePerformanceStats();
  const {
    data: aiRes,
    isLoading: isLoadingAi,
    isError: isAiError,
  } = useAiImpactStats();

  const isLoading =
    isLoadingDash || isLoadingDist || isLoadingPerf || isLoadingAi;
  const isError = isDashError || isDistError || isPerfError || isAiError;

  const dashboardData = dashboardRes?.data;
  const distData = distRes?.data;
  const perfData = perfRes?.data;
  const aiData = aiRes?.data;

  // 1. Prepare Top Level Cards Data
  const stats = [
    {
      title: "Pending Review",
      value: dashboardData?.statusBreakdown?.["pending_admin_review"] || 0,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
    {
      title: "Total Issues",
      value: dashboardData?.totals?.issues || 0,
      icon: ClipboardList,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "AI Accuracy",
      value: `${aiData?.overallAccuracy || 0}%`,
      icon: BrainCircuit,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "Duplicate Rate",
      value: `${perfData?.duplicates?.duplicateRatePercentage || 0}%`,
      icon: CopySlash,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Avg Resolution",
      value: perfData?.resolutionTimes?.[0]?.averageResolutionHours
        ? `${perfData.resolutionTimes[0].averageResolutionHours}h`
        : "N/A",
      icon: Timer,
      color: "text-teal-600",
      bgColor: "bg-teal-100",
    },
  ];

  // 2. Prepare Chart Data Mappings (Added fill properties here)
  const categoryChartData =
    distData?.categories?.map((c, index) => ({
      name: c.category || "Uncategorized",
      issues: c.count,
      fill: GREEN_SHADES[index % GREEN_SHADES.length],
    })) || [];

  const departmentChartData =
    distData?.departments?.map((d, index) => ({
      name: d.department || "Unassigned",
      value: d.totalIssues,
      fill: GREEN_SHADES[index % GREEN_SHADES.length],
    })) || [];

  const priorityChartData =
    distData?.priorities?.map((p, index) => ({
      name: p.priority || "None",
      value: p.count,
      fill: GREEN_SHADES[(index + 2) % GREEN_SHADES.length],
    })) || [];

  const resolutionChartData =
    perfData?.resolutionTimes?.map((r, index) => ({
      name: r.category || "Uncategorized",
      hours: r.averageResolutionHours || 0,
      fill: GREEN_SHADES[(index + 3) % GREEN_SHADES.length],
    })) || [];

  // Reusable Tooltip Style
  const customTooltipStyle = {
    borderRadius: "8px",
    border: "none",
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-gray-500">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <p>Compiling full system analytics...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-red-500">
        <div className="flex flex-col items-center gap-2">
          <AlertCircle className="h-8 w-8" />
          <p>Failed to load analytics dashboard. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Admin Dashboard & Analytics
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Comprehensive system insights and distribution metrics.
          </p>
        </div>
        <Link
          to="/admin/pending"
          className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-500 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
        >
          Review Pending Issues
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="flex flex-col justify-center rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.bgColor} ${stat.color}`}
                >
                  <Icon size={20} />
                </div>
                <div>
                  <p className="line-clamp-1 text-xs font-medium text-gray-500">
                    {stat.title}
                  </p>
                  <p className="text-xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Analytics Grid - Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Category Distribution Bar Chart */}
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-base font-semibold text-gray-900">
              Issues by Category
            </h2>
          </div>
          <div className="h-72 w-full p-4">
            {categoryChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryChartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E5E7EB"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6B7280", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6B7280", fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: "#F3F4F6" }}
                    contentStyle={customTooltipStyle}
                  />
                  {/* Cleaned up Bar component */}
                  <Bar dataKey="issues" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
                No category data available.
              </div>
            )}
          </div>
        </div>

        {/* Department Distribution Pie Chart */}
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-base font-semibold text-gray-900">
              Department Workload Distribution
            </h2>
          </div>
          <div className="h-72 w-full p-4">
            {departmentChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  {/* Cleaned up Pie component */}
                  <Pie
                    data={departmentChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
                No department data available.
              </div>
            )}
          </div>
        </div>

        {/* Priority Breakdown Bar Chart */}
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-base font-semibold text-gray-900">
              Priority Levels
            </h2>
          </div>
          <div className="h-72 w-full p-4">
            {priorityChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={priorityChartData}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="#E5E7EB"
                  />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6B7280", fontSize: 12 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6B7280", fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: "#F3F4F6" }}
                    contentStyle={customTooltipStyle}
                  />
                  {/* Cleaned up Bar component */}
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
                No priority data available.
              </div>
            )}
          </div>
        </div>

        {/* Resolution Times By Category Chart */}
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-base font-semibold text-gray-900">
              Avg Resolution Time (Hours) by Category
            </h2>
          </div>
          <div className="h-72 w-full p-4">
            {resolutionChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={resolutionChartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E5E7EB"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6B7280", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6B7280", fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: "#F3F4F6" }}
                    contentStyle={customTooltipStyle}
                  />
                  {/* Cleaned up Bar component */}
                  <Bar dataKey="hours" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
                No resolution data available.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Staff Performance Bottom Section */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">
            Top Staff Workload & Performance
          </h2>
          <span className="text-sm font-medium text-emerald-600">
            Ranked by Resolved Issues
          </span>
        </div>
        <div className="flex-1 overflow-x-auto p-0">
          {perfData?.staffPerformance &&
          perfData.staffPerformance.length > 0 ? (
            <table className="w-full text-left text-sm text-gray-500">
              <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                <tr>
                  <th className="px-6 py-3 font-medium">Staff Member</th>
                  <th className="px-6 py-3 font-medium">Active Issues</th>
                  <th className="px-6 py-3 font-medium">Resolved Issues</th>
                  <th className="px-6 py-3 font-medium">
                    Avg Resolution (hrs)
                  </th>
                </tr>
              </thead>
              <tbody>
                {perfData.staffPerformance.slice(0, 5).map((staff) => (
                  <tr
                    key={staff.staffId}
                    className="border-b border-gray-50 transition-colors last:border-0 hover:bg-gray-50"
                  >
                    <td className="flex items-center gap-3 px-6 py-4 font-medium text-gray-900">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                        {staff.staffName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)
                          .toUpperCase()}
                      </div>
                      {staff.staffName}
                    </td>
                    <td className="px-6 py-4 font-semibold text-amber-600">
                      {staff.activeCount}
                    </td>
                    <td className="px-6 py-4 font-semibold text-emerald-600">
                      {staff.resolvedCount}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {staff.averageResolutionHours || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex h-32 items-center justify-center text-sm text-gray-500">
              No staff performance data available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
