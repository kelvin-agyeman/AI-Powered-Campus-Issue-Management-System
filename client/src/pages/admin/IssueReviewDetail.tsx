import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  BrainCircuit,
  AlertTriangle,
  CheckCircle,
  Edit,
  XCircle,
  UserPlus,
  CopySlash,
  X,
  Eye,
  Loader2,
} from "lucide-react";
import {
  useIssueDetails,
  useApproveIssue,
  useRejectIssue,
  useModifyIssue,
  useAssignIssue,
  useStaffByDepartment,
  useIssueDuplicates,
} from "../../hooks/useAdmin";
import type { PopulatedUser } from "../../types/issue.types";
import type { User } from "../../types/user.types";
import {
  ASSIGNABLE_DEPARTMENTS,
  ISSUE_CATEGORIES,
  PRIORITY_LEVELS,
} from "../../../../src/utils/constants";

export const IssueReviewDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useIssueDetails(id!);
  const issue = data?.data?.issue;

  // Form states
  const [activeAction, setActiveAction] = useState<
    "none" | "modify" | "reject" | "assign" | "view_duplicate"
  >("none");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showAssignPrompt, setShowAssignPrompt] = useState(false);

  // Assign state
  const [selectedStaffId, setSelectedStaffId] = useState("");

  // Modify form states
  const [modCategory, setModCategory] = useState("");
  const [modPriority, setModPriority] = useState("");
  const [modDepartment, setModDepartment] = useState("");

  const closeModal = () => {
    setActiveAction("none");
    setRejectionReason("");
    setSelectedStaffId("");
  };

  // --- Queries & Mutations ---
  const { mutate: approveIssue, isPending: isApproving } = useApproveIssue(() =>
    setShowAssignPrompt(true),
  );
  const { mutate: rejectIssue, isPending: isRejecting } = useRejectIssue(() => {
    closeModal();
    navigate("/admin/pending");
  });
  const { mutate: modifyIssue, isPending: isModifying } = useModifyIssue(() => {
    closeModal();
    setShowAssignPrompt(true);
  });
  const { mutate: assignIssue, isPending: isAssigning } = useAssignIssue(() => {
    closeModal();
    setShowAssignPrompt(false);
    navigate("/admin/pending");
  });

  // Fetch Staff for Assignment Modal
  const { data: staffData, isLoading: isLoadingStaff } = useStaffByDepartment(
    issue?.aiRecommendation?.department || modDepartment,
  );
  const staffMembers = staffData?.data || [];

  // Fetch Duplicates
  const {
    data: duplicateData,
    refetch: fetchDuplicates,
    isFetching: isFetchingDuplicates,
  } = useIssueDuplicates(id);

  const issueDuplicates = duplicateData?.data.duplicates;

  // --- Handlers ---
  const handleApprove = () => {
    if (id) approveIssue(id);
  };

  const handleRejectConfirm = () => {
    if (id && rejectionReason.trim()) {
      rejectIssue({ id, data: { reason: rejectionReason } });
    }
  };

  const handleModifyConfirm = () => {
    if (id && modCategory && modPriority && modDepartment) {
      modifyIssue({
        id,
        data: {
          category: modCategory,
          priority: modPriority,
          department: modDepartment,
        },
      });
    }
  };

  const handleAssignConfirm = () => {
    if (id && selectedStaffId) {
      assignIssue({ id, data: { staffId: selectedStaffId } });
    }
  };

  const handleViewDuplicate = async () => {
    setActiveAction("view_duplicate");
    await fetchDuplicates();
  };

  const openModifyModal = () => {
    if (issue?.aiRecommendation) {
      setModCategory(issue.aiRecommendation.category || "");
      setModPriority(issue.aiRecommendation.priority || "");
      setModDepartment(issue.aiRecommendation.department || "");
    }
    setActiveAction("modify");
  };

  if (isLoading)
    return <div className="p-8 text-center">Loading issue details...</div>;
  if (!issue)
    return <div className="p-8 text-center text-red-500">Issue not found.</div>;

  const reporter = issue.reportedBy as PopulatedUser;

  // Safe extract duplicate target
  const duplicateTarget = issueDuplicates?.possibleDuplicateOf;
  const duplicateId =
    typeof duplicateTarget === "object"
      ? duplicateTarget?._id
      : duplicateTarget;

  return (
    <div className="relative mx-auto max-w-5xl space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Review Issue</h1>
        <button
          onClick={() => navigate(-1)}
          className="cursor-pointer text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          Back to List
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Student Report */}
        <div className="col-span-2 space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 border-b border-gray-100 pb-4 text-lg font-semibold text-gray-900">
              Original Report
            </h2>
            <div className="space-y-4">
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase">
                  Reported By
                </span>
                <p className="font-medium text-gray-900">
                  {reporter?.fullName || "Unknown"} (
                  {reporter?.institutionId || "N/A"})
                </p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase">
                  Description
                </span>
                <p className="mt-1 rounded-lg border border-gray-100 bg-gray-50 p-4 whitespace-pre-wrap text-gray-700">
                  {issue.description}
                </p>
              </div>
            </div>
          </div>

          {/* Action Panel */}
          {issue.status === "pending_admin_review" && (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Administrator Decision
                </h2>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleApprove}
                    disabled={isApproving}
                    className="flex cursor-pointer items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    <CheckCircle size={18} />{" "}
                    {isApproving
                      ? "Approving..."
                      : "Approve (Use AI Suggestion)"}
                  </button>
                  <button
                    onClick={openModifyModal}
                    className="flex cursor-pointer items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    <Edit size={18} /> Modify
                  </button>
                  <button
                    onClick={() => setActiveAction("assign")}
                    className="flex cursor-pointer items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                  >
                    <UserPlus size={18} /> Direct Assign
                  </button>
                  <button
                    onClick={() => setActiveAction("reject")}
                    className="flex cursor-pointer items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                  >
                    <XCircle size={18} /> Reject
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: AI Analysis */}
        <div className="space-y-6">
          {issue.aiRecommendation && (
            <div className="rounded-xl border border-[#4a0400]/20 bg-linear-to-b from-[#4a0400]/5 to-transparent p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#4a0400]">
                  <BrainCircuit size={20} />
                  <h3 className="font-semibold">AI Assessment</h3>
                </div>
                {issue.aiRecommendation.confidenceScore && (
                  <span className="rounded-full bg-[#4a0400]/10 px-2 py-1 text-xs font-bold text-[#4a0400]">
                    {issue.aiRecommendation.confidenceScore}% Confident
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {/* --- DISPLAY AI SUMMARY HERE --- */}
                {issue.aiRecommendation.summary && (
                  <div className="rounded-lg border border-[#4a0400]/15 bg-white p-3 shadow-xs">
                    <span className="mb-1 block text-xs font-semibold text-gray-500 uppercase">
                      Summary
                    </span>
                    <p className="text-sm leading-relaxed font-medium text-gray-900">
                      {issue.aiRecommendation.summary}
                    </p>
                  </div>
                )}

                <div className="flex justify-between border-b border-[#4a0400]/10 pb-2">
                  <span className="text-sm text-gray-600">Category</span>
                  <span className="font-medium text-gray-900">
                    {issue.aiRecommendation.category}
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#4a0400]/10 pb-2">
                  <span className="text-sm text-gray-600">Priority</span>
                  <span className="font-medium text-red-600 capitalize">
                    {issue.aiRecommendation.priority}
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#4a0400]/10 pb-2">
                  <span className="text-sm text-gray-600">Department</span>
                  <span className="font-medium text-gray-900">
                    {issue.aiRecommendation.department}
                  </span>
                </div>
                <div>
                  <span className="mb-1 block text-xs text-gray-500 uppercase">
                    Reasoning
                  </span>
                  <p className="rounded border border-[#4a0400]/10 bg-white p-3 text-sm text-gray-700 italic">
                    "{issue.aiRecommendation.reasoning}"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Duplicate Analysis Section */}
          {issue.duplicateAnalysis && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
              <div className="mb-4 flex items-center gap-2 text-amber-700">
                <CopySlash size={20} />
                <h3 className="font-semibold">Duplicate Check</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-amber-900">
                      Similarity Score
                    </div>
                    <div className="text-2xl font-bold text-amber-700">
                      {issue.duplicateAnalysis.duplicateScore}%
                    </div>
                  </div>
                  {issue.duplicateAnalysis.duplicateScore > 75 && (
                    <div className="flex items-center gap-1 rounded bg-amber-200 px-3 py-1 text-xs font-bold text-amber-900">
                      <AlertTriangle size={14} /> High Match
                    </div>
                  )}
                </div>

                {issue.duplicateAnalysis.isDuplicate && (
                  <button
                    onClick={handleViewDuplicate}
                    disabled={isFetchingDuplicates}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50"
                  >
                    {isFetchingDuplicates ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Eye size={16} />
                    )}
                    {isFetchingDuplicates
                      ? "Loading..."
                      : "View Duplicate Details"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- Action Modals --- */}
      {activeAction !== "none" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-sm">
          <div className="animate-in zoom-in-95 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            {/* Reject Modal */}
            {activeAction === "reject" && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">
                    Reject Issue
                  </h3>
                  <button
                    onClick={closeModal}
                    className="cursor-pointer text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Reason for Rejection
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="w-full rounded-md border border-gray-300 p-3 outline-none focus:border-red-500 focus:ring-red-500 sm:text-sm"
                      rows={4}
                      placeholder="Provide a reason for the student..."
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={closeModal}
                      className="flex-1 cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRejectConfirm}
                      disabled={isRejecting || !rejectionReason}
                      className="flex-1 cursor-pointer rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      {isRejecting ? "Rejecting..." : "Confirm Rejection"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modify Modal */}
            {activeAction === "modify" && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">
                    Override AI Recommendations
                  </h3>
                  <button
                    onClick={closeModal}
                    className="cursor-pointer text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <select
                      value={modCategory}
                      onChange={(e) => setModCategory(e.target.value)}
                      className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-red-500"
                    >
                      {ISSUE_CATEGORIES.map((category) => {
                        return <option value={category}>{category}</option>;
                      })}
                    </select>
                    <select
                      value={modPriority}
                      onChange={(e) => setModPriority(e.target.value)}
                      className="w-full rounded-md border border-gray-300 p-2 text-sm capitalize outline-none focus:border-red-500"
                    >
                      {PRIORITY_LEVELS.map((priority) => {
                        return <option value={priority}>{priority}</option>;
                      })}
                    </select>
                    <select
                      value={modDepartment}
                      onChange={(e) => setModDepartment(e.target.value)}
                      className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-red-500"
                    >
                      {ASSIGNABLE_DEPARTMENTS.map((department) => {
                        return <option value={department}>{department}</option>;
                      })}
                    </select>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={closeModal}
                      disabled={isModifying}
                      className="flex-1 cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleModifyConfirm}
                      disabled={
                        isModifying ||
                        !modCategory ||
                        !modPriority ||
                        !modDepartment
                      }
                      className="flex-1 cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isModifying ? "Saving..." : "Save & Approve"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Assign Staff Modal */}
            {activeAction === "assign" && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">
                    Assign to Staff
                  </h3>
                  <button
                    onClick={closeModal}
                    className="cursor-pointer text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Select{" "}
                      <span className="font-bold">
                        {issue.aiRecommendation?.department || "Department"}
                      </span>{" "}
                      Staff
                    </label>
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
                      onClick={closeModal}
                      className="flex-1 cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAssignConfirm}
                      disabled={isAssigning || !selectedStaffId}
                      className="flex-1 cursor-pointer rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {isAssigning ? "Assigning..." : "Confirm Assignment"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* View Duplicate Modal */}
            {activeAction === "view_duplicate" && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">
                    Duplicate Details
                  </h3>
                  <button
                    onClick={closeModal}
                    className="cursor-pointer text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>

                {isFetchingDuplicates ? (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                    <Loader2
                      size={24}
                      className="mb-2 animate-spin text-amber-600"
                    />
                    <span className="text-sm">
                      Fetching duplicate details...
                    </span>
                  </div>
                ) : !issueDuplicates ? (
                  <div className="py-6 text-center text-sm text-gray-500">
                    No duplicate details available.
                  </div>
                ) : (
                  <div className="space-y-3 rounded-lg bg-gray-50 p-4">
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-sm font-medium text-gray-500">
                        Duplicate of ID:
                      </span>
                      <span className="font-mono text-sm text-gray-900">
                        {duplicateId || "N/A"}
                      </span>
                    </div>

                    {typeof duplicateTarget === "object" &&
                      duplicateTarget?.status && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-sm font-medium text-gray-500">
                            Status:
                          </span>
                          <span className="text-sm font-semibold text-blue-600 capitalize">
                            {duplicateTarget.status.replace(/_/g, " ")}
                          </span>
                        </div>
                      )}

                    {typeof duplicateTarget === "object" &&
                      duplicateTarget?.description && (
                        <div className="border-b border-gray-200 pt-1 pb-2">
                          <span className="mb-1 block text-sm font-medium text-gray-500">
                            {issue.aiRecommendation?.summary
                              ? "AI Summary of Original Issue:"
                              : "Original Description:"}
                          </span>
                          <p className="text-sm text-gray-700">
                            {issue.aiRecommendation?.summary
                              ? issue.aiRecommendation?.summary
                              : duplicateTarget.description}
                          </p>
                        </div>
                      )}

                    <div className="pt-1">
                      <span className="mb-1 block text-sm font-medium text-gray-500">
                        AI Reasoning:
                      </span>
                      <p className="text-sm text-gray-600 italic">
                        {issueDuplicates.reasoning || "No reasoning provided."}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={closeModal}
                    className="cursor-pointer rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Post-Approval Assignment Modal */}
      {showAssignPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-sm">
          <div className="animate-in zoom-in-95 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Issue Approved!
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                This issue has been successfully verified. Would you like to
                assign it to a staff member right now?
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAssignPrompt(false);
                  navigate("/admin/pending");
                }}
                className="flex-1 cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Do it later
              </button>
              <button
                onClick={() => {
                  setShowAssignPrompt(false);
                  setActiveAction("assign");
                }}
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                <UserPlus size={16} /> Assign Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
