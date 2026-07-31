import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Send,
  MapPin,
  Wrench,
  X,
  FileCheck2,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  Loader2,
  UploadCloud,
  Check,
} from "lucide-react";
import {
  useAssignedIssueDetail,
  useAcceptAssignment,
  useUpdateProgress,
  useResolveIssue,
  useReopenIssue,
} from "../../hooks/useStaff";
import type { IssueStatus } from "../../types/issue.types";
import type { PopulatedUser } from "../../types/user.types";

export const StaffIssueDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useAssignedIssueDetail(id!);
  const acceptMutation = useAcceptAssignment();
  const progressMutation = useUpdateProgress();
  const resolveMutation = useResolveIssue();
  const reopenMutation = useReopenIssue();

  const [newNote, setNewNote] = useState("");
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [resolutionFiles, setResolutionFiles] = useState<File[]>([]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-gray-500">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
        <p className="mt-2 text-sm">Loading task details...</p>
      </div>
    );
  }

  if (isError || !data?.data.issue) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-red-500">
        <AlertCircle className="h-10 w-10" />
        <p className="mt-2 text-lg font-medium">Task not found</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 rounded-md bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
        >
          Go Back
        </button>
      </div>
    );
  }

  const issue = data.data.issue;
  const aiRec = issue.aiRecommendation;
  const resolutionSupport = issue.resolutionSupport;

  const handleAcceptAssignment = () => acceptMutation.mutate(issue._id);

  const handleUpdateProgress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    progressMutation.mutate(
      { id: issue._id, data: { note: newNote } },
      { onSuccess: () => setNewNote("") },
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setResolutionFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setResolutionFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const resetModal = () => {
    setShowResolveModal(false);
    setResolutionNotes("");
    setResolutionFiles([]);
  };

  const handleResolveIssue = () => {
    if (!resolutionNotes.trim()) return;

    const formData = new FormData();
    formData.append("resolutionNotes", resolutionNotes.trim());
    
    resolutionFiles.forEach((file) => {
      formData.append("images", file); 
    });

    resolveMutation.mutate(
      { id: issue._id, data: formData },
      { onSuccess: () => resetModal() },
    );
  };

  const handleReopenIssue = () => reopenMutation.mutate(issue._id);

  const getStatusBadge = (status: IssueStatus) => {
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
        {/* LEFT COLUMN: Details & Actions */}
        <div className="col-span-1 space-y-6 lg:col-span-2">
          {/* Issue Details Card */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-900">
                  Task #{issue._id.slice(-6)}
                </h1>
                {issue.priority && (
                  <span className="rounded border border-red-100 bg-red-50 px-2.5 py-1 text-xs font-bold tracking-wide text-red-700 uppercase">
                    {issue.priority} Priority
                  </span>
                )}
              </div>

              <div className="mb-6">
                <h3 className="mb-2 text-sm font-medium tracking-wider text-gray-500 uppercase">
                  Issue Description
                </h3>
                <p className="rounded-lg border border-gray-100 bg-gray-50 p-4 whitespace-pre-wrap text-gray-800">
                  {issue.description}
                </p>
              </div>

              {issue.images && issue.images.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-2 text-sm font-medium tracking-wider text-gray-500 uppercase">
                    Attached Images
                  </h3>
                  <div className="flex gap-2 overflow-x-auto">
                    {issue.images.map((img) => (
                      <img
                        key={img.publicId}
                        src={img.url}
                        alt="Issue Report"
                        className="h-24 w-24 rounded-lg object-cover ring-1 ring-gray-200"
                      />
                    ))}
                  </div>
                </div>
              )}

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
                      {issue.location || "Not specified"}
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
                      {issue.category || "Uncategorized"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4 text-sm text-gray-600">
              <div>
                Reported by:{" "}
                <strong>
                  {typeof issue.reportedBy === "string"
                    ? issue.reportedBy
                    : (issue.reportedBy as PopulatedUser)?.fullName || "User"}
                </strong>
              </div>
              <div>{new Date(issue.createdAt).toLocaleString()}</div>
            </div>

            {/* Core Actions */}
            <div className="bg-white p-6">
              {issue.status === "assigned" && (
                <div className="space-y-3 text-center">
                  <p className="text-sm text-gray-600">
                    You have been assigned this task. Accept it to begin logging
                    progress.
                  </p>
                  <button
                    onClick={handleAcceptAssignment}
                    disabled={acceptMutation.isPending}
                    className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-green-700 disabled:opacity-50 sm:w-auto"
                  >
                    {acceptMutation.isPending ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <FileCheck2 size={18} />
                    )}
                    Accept Assignment
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
                    disabled={reopenMutation.isPending}
                    className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-50 sm:w-auto"
                  >
                    {reopenMutation.isPending ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <RotateCcw size={16} />
                    )}
                    Reopen Task
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* AI Resolution Guide */}
          {(aiRec?.summary || resolutionSupport) && (
            <div className="overflow-hidden rounded-xl border border-indigo-100 bg-linear-to-br from-indigo-50/40 via-white to-purple-50/30 p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between border-b border-indigo-100/60 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900">
                      AI Resolution Guide
                    </h2>
                    <p className="text-xs text-indigo-600">
                      Automated diagnostics & support
                    </p>
                  </div>
                </div>
                {resolutionSupport?.estimatedResolutionTime && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100/80 px-2.5 py-1 text-xs font-semibold text-indigo-800">
                    <Clock size={12} /> Est.{" "}
                    {resolutionSupport.estimatedResolutionTime}
                  </span>
                )}
              </div>

              {aiRec?.title && (
                <p className="mb-4 text-sm font-semibold text-gray-800">
                  {aiRec.title}
                </p>
              )}

              {aiRec?.summary && (
                <p className="mb-4 text-sm text-gray-600">{aiRec.summary}</p>
              )}

              {resolutionSupport?.recommendedAction && (
                <div className="mb-4 rounded-lg border border-indigo-100/80 bg-white/80 p-4 text-sm text-gray-700 shadow-sm">
                  <h4 className="mb-1 font-bold text-indigo-900">
                    Recommended Action:
                  </h4>
                  <p>{resolutionSupport.recommendedAction}</p>
                </div>
              )}

              {resolutionSupport?.requiredResources &&
                resolutionSupport.requiredResources.length > 0 && (
                  <div className="mb-4">
                    <h4 className="mb-1.5 flex items-center gap-1.5 text-xs font-bold tracking-wider text-indigo-900 uppercase">
                      <Wrench size={14} /> Tools / Materials Needed
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {resolutionSupport.requiredResources.map((res, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center rounded-md border border-indigo-100/80 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-2xs"
                        >
                          {res}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {resolutionSupport?.safetyNotes &&
                resolutionSupport.safetyNotes.length > 0 && (
                  <div className="rounded-lg border border-amber-200/80 bg-amber-50/60 p-3">
                    <h4 className="mb-1 flex items-center gap-1.5 text-xs font-bold tracking-wider text-amber-900 uppercase">
                      <ShieldAlert size={14} className="text-amber-600" />{" "}
                      Safety Notes
                    </h4>
                    <ul className="list-disc space-y-1 pl-4 text-xs text-amber-800">
                      {resolutionSupport.safetyNotes.map((note, idx) => (
                        <li key={idx}>{note}</li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Progress Timeline */}
        <div className="col-span-1 flex h-[calc(100vh-8rem)] flex-col">
          <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 bg-gray-50/80 p-4">
              <h2 className="flex items-center gap-2 font-bold text-gray-900">
                <MessageSquare size={18} className="text-gray-500" />
                Updates & Timeline
              </h2>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto p-4">
              {issue.progressUpdates?.map((update, index) => {
                const isLast = index === issue.progressUpdates!.length - 1;
                const isSystem =
                  typeof update.updatedBy === "string" &&
                  update.updatedBy === "system";

                let authorName = "Staff Member";
                if (!isSystem) {
                  authorName =
                    typeof update.updatedBy === "string"
                      ? update.updatedBy
                      : (update.updatedBy as PopulatedUser)?.fullName ||
                        "Staff";
                }

                return (
                  <div
                    key={update._id || index}
                    className="relative flex gap-4"
                  >
                    {!isLast && (
                      <div className="absolute top-8 -bottom-6 left-4 w-0.5 bg-gray-200"></div>
                    )}
                    <div
                      className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-4 ring-white ${
                        isSystem
                          ? "bg-gray-100 text-gray-500"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {isSystem ? (
                        update.note.toLowerCase().includes("resolved") ? (
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

                    <div className={`flex-1 ${isSystem ? "pt-1.5" : ""}`}>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-900">
                          {isSystem ? "System Status" : authorName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(update.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div
                        className={`text-sm ${
                          isSystem
                            ? "text-gray-500 italic"
                            : "rounded-lg rounded-tl-none border border-gray-100 bg-gray-50 p-3 text-gray-700"
                        }`}
                      >
                        {update.note}
                      </div>
                    </div>
                  </div>
                );
              })}
              {(!issue.progressUpdates ||
                issue.progressUpdates.length === 0) && (
                <div className="py-4 text-center text-sm text-gray-500">
                  No timeline updates yet.
                </div>
              )}
            </div>

            {/* Note Input */}
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
                      type="submit"
                      disabled={!newNote.trim() || progressMutation.isPending}
                      className="cursor-pointer rounded-full bg-red-600 p-1.5 text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {progressMutation.isPending ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Send size={18} />
                      )}
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
                onClick={resetModal}
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

              {/* Resolution Evidence Upload Area */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Resolution Evidence (Optional)
                </label>
                <div className="flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-4 transition-colors hover:border-emerald-400 hover:bg-emerald-50/50">
                  <div className="text-center">
                    <UploadCloud className="mx-auto h-8 w-8 text-gray-400" />
                    <div className="mt-2 flex justify-center text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="evidence-upload"
                        className="relative cursor-pointer rounded-md bg-transparent font-semibold text-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600 focus-within:ring-offset-2 focus-within:outline-none hover:text-emerald-500"
                      >
                        <span>Upload files</span>
                        <input
                          id="evidence-upload"
                          name="evidence-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          multiple
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>

                  {/* Selected Files Preview List */}
                  {resolutionFiles.length > 0 && (
                    <div className="mt-4 flex w-full flex-wrap gap-2 border-t border-gray-200 pt-2">
                      {resolutionFiles.map((file, idx) => (
                        <div
                          key={`${file.name}-${idx}`}
                          className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                        >
                          <Check size={12} className="text-emerald-600" />
                          <span className="max-w-36 truncate">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(idx)}
                            className="ml-1 cursor-pointer text-gray-400 hover:text-red-600"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={resetModal}
                  className="flex-1 cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResolveIssue}
                  disabled={
                    !resolutionNotes.trim() || resolveMutation.isPending
                  }
                  className="flex-1 cursor-pointer rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {resolveMutation.isPending
                    ? "Resolving..."
                    : "Confirm Resolution"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};