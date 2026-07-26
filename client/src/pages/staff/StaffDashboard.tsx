import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  AlertCircle,
  Clock,
  CheckCircle2,
  MoreVertical,
} from "lucide-react";

export const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState<
    "all" | "assigned" | "in_progress"
  >("assigned");

  // Mock data mapping to getAssignedIssues endpoint
  const issues = [
    {
      _id: "issue_101",
      description: "Leaking pipe in the main library washroom.",
      category: "Plumbing",
      priority: "high",
      status: "assigned", // Needs to be accepted
      reportedBy: { fullName: "Jane Doe" },
      createdAt: "2026-10-12T09:30:00Z",
    },
    {
      _id: "issue_102",
      description: "Projector not connecting to HDMI in Room 302.",
      category: "IT Support",
      priority: "medium",
      status: "in_progress", // Accepted and working on it
      reportedBy: { fullName: "Prof. Smith" },
      createdAt: "2026-10-11T14:15:00Z",
    },
  ];

  const filteredIssues = issues.filter((issue) =>
    activeTab === "all" ? true : issue.status === activeTab,
  );

  const getStatusBadge = (status: string) => {
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
        return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

      {/* Controls: Search, Filter, Tabs */}
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 border-b border-gray-200 sm:border-none">
          <button
            onClick={() => setActiveTab("assigned")}
            className={`pb-2 text-sm font-medium transition-colors sm:rounded-md sm:px-3 sm:py-1.5 sm:pb-0 ${
              activeTab === "assigned"
                ? "border-b-2 border-red-600 text-red-600 sm:border-none sm:bg-red-50"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            New Assignments
          </button>
          <button
            onClick={() => setActiveTab("in_progress")}
            className={`pb-2 text-sm font-medium transition-colors sm:rounded-md sm:px-3 sm:py-1.5 sm:pb-0 ${
              activeTab === "in_progress"
                ? "border-b-2 border-red-600 text-red-600 sm:border-none sm:bg-red-50"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`pb-2 text-sm font-medium transition-colors sm:rounded-md sm:px-3 sm:py-1.5 sm:pb-0 ${
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
              className="h-9 w-full rounded-md border border-gray-300 pr-4 pl-9 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none sm:w-64"
            />
          </div>
          <button className="flex h-9 cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-white px-3 text-gray-700 hover:bg-gray-50">
            <Filter size={16} />
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="divide-y divide-gray-200">
          {filteredIssues.map((issue) => (
            <div
              key={issue._id}
              className="flex flex-col gap-4 p-5 transition-colors hover:bg-gray-50 sm:flex-row sm:items-center"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-900">
                    {issue._id.replace("issue_", "#")}
                  </span>
                  {getStatusBadge(issue.status)}
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-medium capitalize ${getPriorityColor(issue.priority)}`}
                  >
                    {issue.priority} Priority
                  </span>
                </div>
                <p className="line-clamp-1 text-sm text-gray-600">
                  {issue.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Reported by: {issue.reportedBy.fullName}</span>
                  <span>•</span>
                  <span>Category: {issue.category}</span>
                  <span>•</span>
                  <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <Link
                  to={`/staff/task/${issue._id}`}
                  className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
                >
                  View Details
                </Link>
                <button className="cursor-pointer text-gray-400 hover:text-gray-600">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>
          ))}
          {filteredIssues.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No tasks found for this view.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
