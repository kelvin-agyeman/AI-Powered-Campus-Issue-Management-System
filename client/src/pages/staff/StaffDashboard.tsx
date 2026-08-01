import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  AlertCircle,
  Clock,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useAssignedIssues } from "../../hooks/useStaff";
import type { IssueStatus } from "../../types/issue.types";
import type { PopulatedUser } from "../../types/user.types";

export const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState<"all" | IssueStatus>("assigned");
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, isError } = useAssignedIssues(
    activeTab === "all" ? undefined : { status: activeTab },
  );

  const issues = data?.data?.issues || [];

  const filteredIssues = issues.filter(
    (issue) =>
      issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (issue.category &&
        issue.category.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const getStatusBadge = (status: IssueStatus) => {
    switch (status) {
      case "assigned":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-600/20 ring-inset">
            <AlertCircle size={12} /> Needs Acceptance
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset">
            <Clock size={12} /> In Progress
          </span>
        );
      case "resolved":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-600/20 ring-inset">
            <CheckCircle2 size={12} /> Resolved
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-600/20 ring-inset">
            {status.replace("_", " ")}
          </span>
        );
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case "urgent":
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-orange-600 bg-orange-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and update your assigned issues.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 border-b border-gray-200 sm:border-none">
          <button
            onClick={() => setActiveTab("assigned")}
            className={`cursor-pointer pb-2 text-sm font-medium transition-colors sm:rounded-md sm:px-3 sm:py-1.5 sm:pb-0 ${
              activeTab === "assigned"
                ? "border-b-2 border-red-600 text-red-600 sm:border-none sm:bg-red-50"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            New Assignments
          </button>
          <button
            onClick={() => setActiveTab("in_progress")}
            className={`cursor-pointer pb-2 text-sm font-medium transition-colors sm:rounded-md sm:px-3 sm:py-1.5 sm:pb-0 ${
              activeTab === "in_progress"
                ? "border-b-2 border-red-600 text-red-600 sm:border-none sm:bg-red-50"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`cursor-pointer pb-2 text-sm font-medium transition-colors sm:rounded-md sm:px-3 sm:py-1.5 sm:pb-0 ${
              activeTab === "all"
                ? "border-b-2 border-red-600 text-red-600 sm:border-none sm:bg-red-50"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            All Active
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 w-full rounded-md border border-gray-300 pr-4 pl-9 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none sm:w-64"
            />
          </div>
          <button className="flex h-9 cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-white px-3 text-gray-700 hover:bg-gray-50">
            <Filter size={16} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Loader2 className="mb-2 h-8 w-8 animate-spin text-red-600" />
            <p className="text-sm">Loading assigned tasks...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-12 text-red-500">
            <AlertCircle className="mb-2 h-8 w-8" />
            <p className="text-sm font-medium">Failed to load tasks</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredIssues.map((issue) => (
              <div
                key={issue._id}
                className="flex flex-col gap-4 p-5 transition-colors hover:bg-gray-50 sm:flex-row sm:items-center"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900">
                      #{issue._id.slice(-6)}
                    </span>
                    {getStatusBadge(issue.status)}
                    {issue.priority && (
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-medium capitalize ${getPriorityColor(
                          issue.priority,
                        )}`}
                      >
                        {issue.priority} Priority
                      </span>
                    )}
                  </div>
                  <p className="line-clamp-1 text-sm text-gray-600">
                    {issue.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>
                      Reported by:{" "}
                      {typeof issue.reportedBy === "string"
                        ? issue.reportedBy
                        : (issue.reportedBy as PopulatedUser)?.fullName ||
                          "User"}
                    </span>
                    <span>•</span>
                    <span>Category: {issue.category || "Uncategorized"}</span>
                    <span>•</span>
                    <span>
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <Link
                    to={`/staff/task/${issue._id}`}
                    className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
            {filteredIssues.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No tasks found for this view.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
