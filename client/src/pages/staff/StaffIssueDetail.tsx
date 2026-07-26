import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Camera,
  Send,
  MapPin,
  Wrench,
  X,
  FileCheck2,
  RotateCcw,
} from "lucide-react";

export const StaffIssueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mocking the issue data that would come from getAssignedIssueById
  const [issue, setIssue] = useState({
    _id: id || "issue_101",
    description:
      "The main pipe under the sink in the ground floor washroom is leaking heavily. Water is pooling on the floor.",
    category: "Plumbing",
    priority: "high",
    status: "in_progress", // 'assigned', 'in_progress', 'resolved'
    location: "Main Library, G-Floor Washroom",
    reportedBy: {
      fullName: "Jane Doe",
      email: "jane.doe@student.edu",
      institutionId: "1092384",
    },
    createdAt: "2026-10-12T09:30:00Z",
    acceptedAt: "2026-10-12T10:15:00Z",
    progressUpdates: [
      {
        id: "update_1",
        note: "Assignment accepted. Work has commenced.",
        status: "in_progress",
        updatedBy: "John Staff",
        createdAt: "2026-10-12T10:15:00Z",
        type: "system",
      },
      {
        id: "update_2",
        note: "Inspected the sink. The PVC trap is cracked and needs a complete replacement. Heading to stores to get parts.",
        status: "in_progress",
        updatedBy: "John Staff",
        createdAt: "2026-10-12T10:45:00Z",
        type: "manual",
      },
    ],
  });

  // State for adding a new progress update (Timeline)
  const [newNote, setNewNote] = useState("");

  // State for the Resolution Modal
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState("");

  // --- Handlers mapping to backend services ---

  const handleAcceptAssignment = () => {
    // API Call: acceptAssignment(issueId, staffId)
    const newUpdate = {
      id: `update_${Date.now()}`,
      note: "Assignment accepted. Work has commenced.",
      status: "in_progress",
      updatedBy: "John Staff",
      createdAt: new Date().toISOString(),
      type: "system",
    };
    setIssue({
      ...issue,
      status: "in_progress",
      progressUpdates: [...issue.progressUpdates, newUpdate],
    });
  };

  const handleUpdateProgress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    // API Call: updateProgress(issueId, staffId, { note: newNote })
    const newUpdate = {
      id: `update_${Date.now()}`,
      note: newNote,
      status: issue.status,
      updatedBy: "John Staff",
      createdAt: new Date().toISOString(),
      type: "manual",
    };

    setIssue({
      ...issue,
      progressUpdates: [...issue.progressUpdates, newUpdate],
    });
    setNewNote("");
  };

  const handleResolveIssue = () => {
    // API Call: resolveIssue(issueId, staffId, { resolutionNotes })
    const newUpdate = {
      id: `update_${Date.now()}`,
      note: `Issue resolved: ${resolutionNotes}`,
      status: "resolved",
      updatedBy: "John Staff",
      createdAt: new Date().toISOString(),
      type: "system",
    };

    setIssue({
      ...issue,
      status: "resolved",
      progressUpdates: [...issue.progressUpdates, newUpdate],
    });
    setShowResolveModal(false);
    setResolutionNotes("");
  };

  const handleReopenIssue = () => {
    // API Call: reopenIssue(issueId, staffId)
    const newUpdate = {
      id: `update_${Date.now()}`,
      note: "Issue reopened by staff.",
      status: "in_progress",
      updatedBy: "John Staff",
      createdAt: new Date().toISOString(),
      type: "system",
    };
    setIssue({
      ...issue,
      status: "in_progress",
      progressUpdates: [...issue.progressUpdates, newUpdate],
    });
  };

  // --- UI Helpers ---

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "assigned":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
            <AlertCircle size={16} /> Needs Acceptance
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
            <Clock size={16} /> In Progress
          </span>
        );
      case "resolved":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">
            <CheckCircle2 size={16} /> Resolved
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-6xl pb-12">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={16} /> Back to Tasks
        </button>
        {getStatusBadge(issue.status)}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT COLUMN: Issue Details & Actions */}
        <div className="col-span-1 space-y-6 lg:col-span-2">
          {/* Main Details Card */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-900">
                  Task {issue._id.replace("issue_", "#")}
                </h1>
                <span className="rounded border border-red-100 bg-red-50 px-2.5 py-1 text-xs font-bold tracking-wide text-red-700 uppercase">
                  {issue.priority} Priority
                </span>
              </div>

              <div className="mb-6">
                <h3 className="mb-2 text-sm font-medium tracking-wider text-gray-500 uppercase">
                  Issue Description
                </h3>
                <p className="rounded-lg border border-gray-100 bg-gray-50 p-4 whitespace-pre-wrap text-gray-800">
                  {issue.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-gray-400">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">
                      Location
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {issue.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-gray-400">
                    <Wrench size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">
                      Category
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {issue.category}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 p-4 px-6 text-sm text-gray-600">
              <div>
                Reported by <strong>{issue.reportedBy.fullName}</strong>
              </div>
              <div>{new Date(issue.createdAt).toLocaleString()}</div>
            </div>

            {/* Core Action Panel */}
            <div className="bg-white p-6">
              {issue.status === "assigned" && (
                <div className="space-y-3 text-center">
                  <p className="text-sm text-gray-600">
                    You have been assigned this task. Accept it to begin logging
                    progress.
                  </p>
                  <button
                    onClick={handleAcceptAssignment}
                    className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-red-700 sm:w-auto"
                  >
                    <FileCheck2 size={18} /> Accept Assignment
                  </button>
                </div>
              )}

              {issue.status === "in_progress" && (
                <div className="flex flex-col items-center justify-between gap-3 rounded-lg border border-blue-100 bg-blue-50/50 p-4 sm:flex-row">
                  <div className="text-sm text-blue-800">
                    <strong>Work in Progress.</strong> Keep the timeline
                    updated.
                  </div>
                  <button
                    onClick={() => setShowResolveModal(true)}
                    className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700 sm:w-auto"
                  >
                    <CheckCircle2 size={18} /> Mark as Resolved
                  </button>
                </div>
              )}

              {issue.status === "resolved" && (
                <div className="flex flex-col items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:flex-row">
                  <div className="text-sm text-gray-600">
                    This task has been resolved and closed.
                  </div>
                  <button
                    onClick={handleReopenIssue}
                    className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 sm:w-auto"
                  >
                    <RotateCcw size={16} /> Reopen Task
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Progress Timeline Feed */}
        <div className="col-span-1 flex h-[calc(100vh-8rem)] flex-col">
          <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 bg-gray-50/80 p-4">
              <h2 className="flex items-center gap-2 font-bold text-gray-900">
                <MessageSquare size={18} className="text-gray-500" />
                Updates & Timeline
              </h2>
            </div>

            {/* Timeline Feed Area */}
            <div className="flex-1 space-y-6 overflow-y-auto p-4">
              {issue.progressUpdates.map((update, index) => {
                const isLast = index === issue.progressUpdates.length - 1;
                const isSystem = update.type === "system";

                return (
                  <div key={update.id} className="relative flex gap-4">
                    {/* Vertical Line */}
                    {!isLast && (
                      <div className="absolute top-8 -bottom-6 left-4 w-0.5 bg-gray-200"></div>
                    )}

                    {/* Icon */}
                    <div
                      className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-4 ring-white ${isSystem ? "bg-gray-100 text-gray-500" : "bg-red-100 text-red-600"}`}
                    >
                      {isSystem ? (
                        update.note.includes("resolved") ? (
                          <CheckCircle2
                            size={16}
                            className="text-emerald-600"
                          />
                        ) : (
                          <Clock size={14} />
                        )
                      ) : (
                        <MessageSquare size={14} />
                      )}
                    </div>

                    {/* Content */}
                    <div className={`flex-1 ${isSystem ? "pt-1.5" : ""}`}>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-900">
                          {isSystem ? "System Status" : update.updatedBy}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(update.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div
                        className={`text-sm ${isSystem ? "text-gray-500 italic" : "rounded-lg rounded-tl-none border border-gray-100 bg-gray-50 p-3 text-gray-700"}`}
                      >
                        {update.note}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Note Input Area (Only active if in_progress) */}
            <div className="border-t border-gray-100 bg-white p-4">
              {issue.status === "in_progress" ? (
                <form onSubmit={handleUpdateProgress} className="relative">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Type an update or status note..."
                    className="w-full resize-none rounded-xl border border-gray-300 pt-3 pr-24 pb-3 pl-4 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                    rows={2}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleUpdateProgress(e);
                      }
                    }}
                  />
                  <div className="absolute right-3 bottom-3 flex items-center gap-2">
                    <button
                      type="button"
                      className="cursor-pointer rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                      title="Attach Photo"
                    >
                      <Camera size={18} />
                    </button>
                    <button
                      type="submit"
                      disabled={!newNote.trim()}
                      className="cursor-pointer rounded-full bg-red-600 p-1.5 text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="py-2 text-center text-sm text-gray-500">
                  {issue.status === "assigned"
                    ? "Accept task to add updates."
                    : "Task resolved. Timeline closed."}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Resolve Issue Modal */}
      {showResolveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="animate-in zoom-in-95 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Resolve Task</h3>
              <button
                onClick={() => setShowResolveModal(false)}
                className="cursor-pointer text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Resolution Notes <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-3 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  rows={4}
                  placeholder="Detail exactly what was fixed..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Attach Proof (Optional)
                </label>
                <div className="flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 px-6 py-4 transition-colors hover:border-gray-400 hover:bg-gray-50">
                  <div className="text-center">
                    <Camera className="mx-auto h-8 w-8 text-gray-400" />
                    <span className="mt-2 block text-sm font-semibold text-gray-900">
                      Upload Images
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowResolveModal(false)}
                  className="flex-1 cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResolveIssue}
                  disabled={!resolutionNotes.trim()}
                  className="flex-1 cursor-pointer rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Confirm Resolution
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
