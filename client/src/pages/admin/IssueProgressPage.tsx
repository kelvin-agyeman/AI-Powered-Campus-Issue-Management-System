import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  User,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useIssueProgress } from "../../hooks/useAdmin";
import { format } from "date-fns";
import type { ProgressUpdate, PopulatedUser } from "../../types/issue.types";

export const IssueProgressPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useIssueProgress(id!);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-gray-500">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <p>Loading progress updates...</p>
        </div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-red-500">
        <div className="flex flex-col items-center gap-2">
          <AlertCircle className="h-8 w-8" />
          <p>Failed to load progress timeline.</p>
          <Link
            to="/admin/issues"
            className="text-sm underline hover:text-red-700"
          >
            Return to Issues
          </Link>
        </div>
      </div>
    );
  }

  const issue = data.data;
  const progressUpdates = issue.progressUpdates || [];
  const issueTitle = issue.aiRecommendation?.title || "Reported Issue";

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
        <Link
          to="/admin/issues"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Progress Timeline
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Tracking updates for:{" "}
            <span className="font-medium text-gray-700">{issueTitle}</span>
          </p>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        {progressUpdates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Clock className="mb-3 h-12 w-12 text-gray-300" />
            <p className="text-lg font-medium text-gray-900">No updates yet</p>
            <p className="text-sm">
              The assigned staff member hasn't posted any progress updates.
            </p>
          </div>
        ) : (
          <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-linear-to-b before:from-transparent before:via-gray-200 before:to-transparent md:before:mx-auto md:before:translate-x-0">
            {progressUpdates.map((update: ProgressUpdate, index: number) => {
              // <-- Explicitly cast updatedBy to PopulatedUser so TS knows it has an avatar and fullName
              const staff = update.updatedBy as PopulatedUser;

              return (
                <div
                  key={update._id || index}
                  className="group is-active relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse"
                >
                  {/* Timeline Icon */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white bg-emerald-100 text-emerald-600 shadow md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    <CheckCircle2 size={20} />
                  </div>

                  {/* Card */}
                  <div className="w-[calc(100%-4rem)] rounded-xl border border-gray-100 bg-gray-50 p-4 shadow-sm transition-shadow hover:shadow-md md:w-[calc(50%-2.5rem)]">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200">
                          {staff?.avatar ? (
                            <img
                              src={staff.avatar}
                              alt="avatar"
                              className="h-full w-full rounded-full object-cover"
                            />
                          ) : (
                            <User size={14} className="text-gray-500" />
                          )}
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {staff?.fullName || "Staff Member"}
                        </span>
                      </div>
                      <time className="text-xs font-medium text-gray-500">
                        {format(
                          new Date(update.createdAt),
                          "MMM d, yyyy • h:mm a",
                        )}
                      </time>
                    </div>
                    <div className="rounded-lg border border-gray-100 bg-white p-3 text-sm text-gray-700">
                      {update.note}
                    </div>
                    {update.status && (
                      <div className="mt-3 flex">
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset">
                          Status changed to: {update.status.replace(/_/g, " ")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
