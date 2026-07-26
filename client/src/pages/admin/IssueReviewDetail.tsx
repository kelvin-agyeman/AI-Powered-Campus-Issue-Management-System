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
} from "lucide-react";

export const IssueReviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State for toggling action forms
  const [activeAction, setActiveAction] = useState<
    "none" | "modify" | "reject" | "assign"
  >("none");
  const [rejectionReason, setRejectionReason] = useState("");

  // State for the post-approval modal
  const [showAssignPrompt, setShowAssignPrompt] = useState(false);

  // Mock data representing getIssueById() and getIssueDuplicates()
  const issue = {
    _id: id,
    description: "Leaking pipe in the main library washroom.",
    reportedBy: { fullName: "Jane Doe", institutionId: "1092384" },
    aiRecommendation: {
      category: "Plumbing",
      priority: "high",
      department: "Estates",
      reasoning:
        "Mention of 'leaking pipe' strongly correlates with plumbing maintenance.",
    },
    duplicateAnalysis: {
      possibleDuplicateOf: null,
      duplicateScore: 12, // Low probability
    },
  };

  const handleApprove = () => {
    // api.post(`/admin/issues/${id}/approve`)
    console.log("Approved using AI recommendations");

    // Instead of navigating away, trigger the prompt modal
    setShowAssignPrompt(true);
  };

  const closeModal = () => {
    setActiveAction("none");
    setRejectionReason("");
  };

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
                  {issue.reportedBy.fullName} ({issue.reportedBy.institutionId})
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
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Administrator Decision
              </h2>
            </div>
            <div className="p-6">
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleApprove}
                  className="flex cursor-pointer items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
                >
                  <CheckCircle size={18} /> Approve (Use AI Suggestion)
                </button>
                <button
                  onClick={() => setActiveAction("modify")}
                  className="flex cursor-pointer items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  <Edit size={18} /> Modify
                </button>
                <button
                  onClick={() => setActiveAction("reject")}
                  className="flex cursor-pointer items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                >
                  <XCircle size={18} /> Reject
                </button>
                <button
                  onClick={() => setActiveAction("assign")}
                  className="flex cursor-pointer items-center gap-2 rounded-md bg-gray-800 px-4 py-2 text-white hover:bg-gray-900"
                >
                  <UserPlus size={18} /> Direct Assign
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Analysis */}
        <div className="space-y-6">
          {/* Recommendation Card */}
          <div className="rounded-xl border border-[#4a0400]/20 bg-linear-to-b from-[#4a0400]/5 to-transparent p-6">
            <div className="mb-4 flex items-center gap-2 text-[#4a0400]">
              <BrainCircuit size={20} />
              <h3 className="font-semibold">AI Assessment</h3>
            </div>

            <div className="space-y-4">
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

          {/* Duplicate Analysis Card */}
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
            <div className="mb-4 flex items-center gap-2 text-amber-700">
              <CopySlash size={20} />
              <h3 className="font-semibold">Duplicate Check</h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="text-sm text-amber-900">Similarity Score</div>
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
          </div>
        </div>
      </div>

      {/* Action Modals */}
      {activeAction !== "none" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="animate-in zoom-in-95 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            {/* Conditional Form: Reject */}
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
                      className="w-full rounded-md border border-gray-300 p-3 focus:border-red-500 focus:ring-red-500 sm:text-sm"
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
                    <button className="flex-1 cursor-pointer rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Conditional Form: Modify (Overrides AI) */}
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
                    <select className="w-full rounded-md border border-gray-300 p-2 text-sm">
                      <option>Select Category...</option>
                    </select>
                    <select className="w-full rounded-md border border-gray-300 p-2 text-sm">
                      <option>Select Priority...</option>
                    </select>
                    <select className="w-full rounded-md border border-gray-300 p-2 text-sm">
                      <option>Select Department...</option>
                    </select>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={closeModal}
                      className="flex-1 cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button className="flex-1 cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                      Save & Approve
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Conditional Form: Assign Staff */}
            {activeAction === "assign" && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">
                    Assign to Staff Member
                  </h3>
                  <button
                    onClick={closeModal}
                    className="cursor-pointer text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="space-y-4">
                  <select className="w-full rounded-md border border-gray-300 p-2 text-sm">
                    <option>Select Staff Member (Filtered by Dept)...</option>
                  </select>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={closeModal}
                      className="flex-1 cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button className="flex-1 cursor-pointer rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
                      Assign Issue
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Post-Approval Assignment Modal */}
      {showAssignPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
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
                <UserPlus size={16} />
                Assign Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
