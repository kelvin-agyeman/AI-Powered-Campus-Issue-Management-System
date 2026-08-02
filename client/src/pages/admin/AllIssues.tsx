import { useState } from "react";
import {
  Filter,
  Search,
  MoreVertical,
  X,
  UserPlus,
  Activity,
} from "lucide-react"; // <-- Added Activity
import { Link } from "react-router-dom"; // <-- Added Link
import {
  useAllIssues,
  useAssignIssue,
  useStaffByDepartment,
} from "../../hooks/useAdmin";
import type { Issue } from "../../types/issue.types";
import type { User, PopulatedUser } from "../../types/user.types";
import {
  ASSIGNABLE_DEPARTMENTS,
  PRIORITY_LEVELS,
} from "../../../../server/src/utils/constants";

export const AllIssuesPage = () => {
  const [filters, setFilters] = useState({
    status: "",
    assignedDepartment: "",
    priority: "",
    searchQuery: "",
  });

  const { data, isLoading } = useAllIssues(filters);

  const issues: Issue[] = data?.data?.issues || [];

  const [issueToAssign, setIssueToAssign] = useState<Issue | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState("");

  const { data: staffData, isLoading: isLoadingStaff } = useStaffByDepartment(
    issueToAssign?.assignedDepartment ||
      issueToAssign?.aiRecommendation?.department,
  );
  const staffMembers = staffData?.data || [];

  const { mutate: assignIssue, isPending: isAssigning } = useAssignIssue(() => {
    setIssueToAssign(null);
    setSelectedStaffId("");
  });

  const handleAssignConfirm = () => {
    if (issueToAssign && selectedStaffId) {
      assignIssue({
        id: issueToAssign._id,
        data: { staffId: selectedStaffId },
      });
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            All Issues Registry
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View and filter all reported issues across campus.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="shrink-0 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-50 flex-1">
            <Search
              className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search..."
              value={filters.searchQuery}
              onChange={(e) =>
                setFilters({ ...filters, searchQuery: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="cursor-pointer rounded-md border border-gray-300 py-2 pr-8 pl-3 text-sm outline-none focus:border-red-500"
          >
            <option value="">All Statuses</option>
            <option value="pending_admin_review">Pending</option>
            <option value="approved">Approved</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={filters.assignedDepartment}
            onChange={(e) =>
              setFilters({ ...filters, assignedDepartment: e.target.value })
            }
            className="cursor-pointer rounded-md border border-gray-300 py-2 pr-8 pl-3 text-sm outline-none focus:border-red-500"
          >
            <option value="">All Departments</option>
            {ASSIGNABLE_DEPARTMENTS.map((department) => {
              return (
                <option key={department} value={department}>
                  {department}
                </option>
              );
            })}
          </select>
          <select
            value={filters.priority}
            onChange={(e) =>
              setFilters({ ...filters, priority: e.target.value })
            }
            className="cursor-pointer rounded-md border border-gray-300 py-2 pr-8 pl-3 text-sm outline-none focus:border-red-500"
          >
            <option value="">Priority</option>
            {PRIORITY_LEVELS.map((priority) => {
              return (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              );
            })}
          </select>
          <button className="flex cursor-pointer items-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
            <Filter size={16} /> Filters
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 overflow-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="sticky top-0 z-10 bg-gray-50 shadow-sm">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Issue ID / Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Reporter
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Details
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Department
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {isLoading ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-sm text-gray-500"
                >
                  Loading issues...
                </td>
              </tr>
            ) : issues.length > 0 ? (
              issues.map((issue: Issue) => {
                const reporter = issue.reportedBy as PopulatedUser;
                return (
                  <tr key={issue._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="max-w-32 truncate text-sm font-medium text-gray-900">
                        {issue._id}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {reporter?.fullName || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {reporter?.email || ""}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {issue.aiRecommendation?.title || "Report"}
                      </div>
                      <div className="line-clamp-1 text-xs text-gray-500">
                        {issue.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 capitalize">
                      {issue.assignedDepartment ||
                        issue.aiRecommendation?.department ||
                        "Unassigned"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800">
                        {issue.status.replace(/_/g, " ").toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        {/* Assign Issue Action */}
                        {issue.status === "approved" && (
                          <button
                            onClick={() => setIssueToAssign(issue)}
                            className="cursor-pointer rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                            title="Assign Staff"
                          >
                            <MoreVertical size={20} />
                          </button>
                        )}

                        {/* NEW: View Progress Action */}
                        {["assigned", "in_progress", "resolved"].includes(
                          issue.status,
                        ) && (
                          <Link
                            to={`/admin/issues/${issue._id}/progress`}
                            className="cursor-pointer rounded-full p-2 text-emerald-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                            title="View Progress Timeline"
                          >
                            <Activity size={20} />
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-sm text-gray-500"
                >
                  No issues found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Assignment Modal (Remains the Same) */}
      {issueToAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-sm">
          <div className="animate-in zoom-in-95 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus size={20} className="text-indigo-600" />
                <h3 className="text-lg font-bold text-gray-900">
                  Assign Staff Member
                </h3>
              </div>
              <button
                onClick={() => {
                  setIssueToAssign(null);
                  setSelectedStaffId("");
                }}
                className="cursor-pointer text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="mb-3 text-sm text-gray-500">
                  Assigning issue{" "}
                  <span className="font-medium text-gray-900">
                    #{issueToAssign._id.slice(-6)}
                  </span>{" "}
                  to the{" "}
                  <span className="font-medium text-gray-900 capitalize">
                    {issueToAssign.assignedDepartment ||
                      issueToAssign.aiRecommendation?.department}
                  </span>{" "}
                  department.
                </p>
                <select
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  disabled={isLoadingStaff}
                  className="w-full rounded-md border border-gray-300 p-3 text-sm outline-none focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
                >
                  <option value="">
                    {isLoadingStaff
                      ? "Loading staff..."
                      : "Select a staff member..."}
                  </option>
                  {staffMembers.map((staff: User) => (
                    <option key={staff._id} value={staff._id}>
                      {staff.fullName} ({staff._id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setIssueToAssign(null);
                    setSelectedStaffId("");
                  }}
                  className="flex-1 cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignConfirm}
                  disabled={isAssigning || !selectedStaffId}
                  className="flex-1 cursor-pointer rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isAssigning ? "Assigning..." : "Assign Task"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
