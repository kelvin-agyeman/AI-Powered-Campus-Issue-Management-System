import { ClipboardList, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { Link, useOutletContext } from "react-router-dom";
import { useStudentIssues } from "../../hooks/useStudent";
import type { StudentUser } from "../../types/student.types";

export const StudentDashboard = () => {
  const { user } = useOutletContext<{ user: StudentUser }>();
  const { data, isLoading } = useStudentIssues();
  const issues = data?.issues || [];

  const stats = [
    {
      title: "Total Reports",
      value: issues.length.toString(),
      icon: ClipboardList,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "In Progress",
      value: issues
        .filter((i) =>
          ["pending_admin_review", "in_progress", "assigned"].includes(
            i.status,
          ),
        )
        .length.toString(),
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
    {
      title: "Resolved",
      value: issues.filter((i) => i.status === "resolved").length.toString(),
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Action Needed",
      value: issues.filter((i) => i.status === "rejected").length.toString(),
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  const recentIssues = issues.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user.fullName.split(" ")[0]}!
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Here is the status of your reported campus issues.
          </p>
        </div>
        <Link
          to="/student/new-report"
          className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700"
        >
          Report New Issue
        </Link>
      </div>

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
                {isLoading ? (
                  <div className="mt-1 h-8 w-12 animate-pulse rounded bg-gray-200"></div>
                ) : (
                  <p className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Reports
          </h2>
        </div>

        {isLoading ? (
          <div className="p-6 text-center text-gray-500">
            Loading recent reports...
          </div>
        ) : recentIssues.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {recentIssues.map((issue) => (
              <li
                key={issue._id}
                className="p-4 transition-colors hover:bg-gray-50 sm:p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {issue.aiRecommendation?.title ||
                        issue.description.substring(0, 50)}
                      ...
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                    {issue.status.replace(/_/g, " ").toUpperCase()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-6 text-center text-gray-500">
            <p>No recent reports to display.</p>
          </div>
        )}
      </div>
    </div>
  );
};
