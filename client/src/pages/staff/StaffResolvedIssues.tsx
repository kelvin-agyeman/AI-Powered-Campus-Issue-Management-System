import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  CheckCircle2,
  Calendar,
  MapPin,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useAssignedIssues } from "../../hooks/useStaff";

export const StaffResolvedIssues = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, isError } = useAssignedIssues({
    status: "resolved",
  });
  const resolvedIssues = data?.data?.issues || [];

  const filteredIssues = resolvedIssues.filter(
    (issue) =>
      issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (issue.category &&
        issue.category.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resolved Issues</h1>
          <p className="mt-1 text-sm text-gray-500">
            A history of all the issues you have completed.
          </p>
        </div>
      </div>

      <div className="flex rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 w-full rounded-lg border border-gray-300 pr-4 pl-10 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Loader2 className="mb-2 h-8 w-8 animate-spin text-emerald-600" />
            <p className="text-sm">Loading resolved issues...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-12 text-red-500">
            <AlertCircle className="mb-2 h-8 w-8" />
            <p className="text-sm font-medium">
              Failed to load resolved issues
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredIssues.map((issue) => (
              <div
                key={issue._id}
                className="flex flex-col gap-4 p-5 transition-colors hover:bg-gray-50 sm:flex-row sm:items-center"
              >
                <div className="mt-1 hidden sm:block">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle2 size={20} />
                  </div>
                </div>

                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">
                      #{issue._id.slice(-6)}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                      {issue.category || "Uncategorized"}
                    </span>
                  </div>

                  <p className="line-clamp-2 text-sm text-gray-700">
                    {issue.description}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />{" "}
                      {issue.location || "Location not set"}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} /> Resolved:{" "}
                      {issue.resolvedAt
                        ? new Date(issue.resolvedAt).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center sm:justify-end">
                  <Link
                    to={`/staff/task/${issue._id}`}
                    className="inline-flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                  >
                    View Details <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}

            {filteredIssues.length === 0 && (
              <div className="flex flex-col items-center justify-center p-12 text-center text-gray-500">
                <CheckCircle2 size={48} className="mb-4 text-gray-300" />
                <p className="text-lg font-medium text-gray-900">
                  No resolved issues found
                </p>
                <p className="mt-1 text-sm">Try adjusting your search terms.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
