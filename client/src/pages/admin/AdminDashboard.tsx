import {
  ClipboardList,
  Clock,
  BrainCircuit,
  CopySlash,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

export const AdminDashboard = () => {
  // Mock data representing the payload from your analyticsService
  const stats = [
    {
      title: "Pending Admin Review",
      value: "24",
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
    {
      title: "Total Issues",
      value: "156",
      icon: ClipboardList,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "AI Overall Accuracy",
      value: "92.4%",
      icon: BrainCircuit,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "Duplicate Rate",
      value: "8.5%",
      icon: CopySlash,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Overview</h1>
          <p className="mt-1 text-sm text-gray-500">
            System analytics and pending issues requiring your approval.
          </p>
        </div>
        <Link
          to="/admin/pending"
          className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
        >
          Review Pending Issues
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="flex items-center rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${stat.bgColor} ${stat.color}`}
              >
                <Icon size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  {stat.title}
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Overview Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Analytics Area - e.g., Category Trends */}
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm lg:col-span-2">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Issues by Category
            </h2>
          </div>
          <div className="flex h-64 items-center justify-center p-6 text-gray-500">
            {/* You will plug in Recharts or Chart.js here using categoryTrends from analyticsService */}
            <p className="flex h-full w-full items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-sm">
              Chart UI Placeholder (Category Trends)
            </p>
          </div>
        </div>

        {/* Staff Workload Quick View */}
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Top Staff Workload
            </h2>
          </div>
          <div className="p-0">
            {/* Mocked from staffWorkload analytics */}
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b border-gray-50 px-6 py-4 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                    <Users size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Staff Member {i}
                    </p>
                    <p className="text-xs text-gray-500">Maintenance</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    5 Active
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
