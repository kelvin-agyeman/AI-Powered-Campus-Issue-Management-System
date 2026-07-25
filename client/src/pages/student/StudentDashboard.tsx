import { ClipboardList, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

export const StudentDashboard = () => {
  // Mock data for the statistics
  const stats = [
    {
      title: "Total Reports",
      value: "12",
      icon: ClipboardList,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "In Progress",
      value: "3",
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
    {
      title: "Resolved",
      value: "8",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Action Needed",
      value: "1",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
          <p className="mt-1 text-sm text-gray-500">
            Here is the status of your reported campus issues.
          </p>
        </div>
        <Link
          to="/student/new-report"
          className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
        >
          Report New Issue
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
                className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor} ${stat.color}`}
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

      {/* Recent Activity Section Placeholder */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Reports
          </h2>
        </div>
        <div className="p-6 text-center text-gray-500">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
            <ClipboardList size={32} className="text-gray-400" />
          </div>
          <p>No recent reports to display.</p>
          <Link
            to="/student/new-report"
            className="mt-2 inline-block text-sm font-medium text-red-600 hover:text-red-700"
          >
            Create your first report &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};
