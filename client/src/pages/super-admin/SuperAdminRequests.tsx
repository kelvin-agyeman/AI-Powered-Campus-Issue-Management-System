import { useState } from "react";
import { Check, X, ArrowRight, ClipboardEdit } from "lucide-react";

export const SuperAdminRequests = () => {
  // Modal and Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null,
  );
  const [rejectionReason, setRejectionReason] = useState("");

  // Mock data mapping to getEditRequests response
  const requests = [
    {
      _id: "req1",
      requestedBy: {
        fullName: "Michael Barnes",
        email: "mbarnes@student.edu",
        institutionId: "OLD-1234",
      },
      newInstitutionId: "NEW-9988",
      status: "pending",
      createdAt: "2026-07-25T10:00:00Z",
    },
    {
      _id: "req2",
      requestedBy: {
        fullName: "Sarah Connor",
        email: "sconnor@student.edu",
        institutionId: "OLD-5566",
      },
      newInstitutionId: "NEW-1122",
      status: "pending",
      createdAt: "2026-07-26T08:30:00Z",
    },
  ];

  const handleOpenRejectModal = (id: string) => {
    setSelectedRequestId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequestId(null);
    setRejectionReason("");
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This will eventually map to your reject backend route
    console.log(
      `Rejecting request ${selectedRequestId} for reason:`,
      rejectionReason,
    );

    handleCloseModal();
  };

  const handleApprove = (id: string) => {
    // This will eventually map to your approve backend route
    console.log(`Approving request ${id}`);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Institution ID Edit Requests
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Review and process student requests to update their identification
          numbers.
        </p>
      </div>

      <div className="grid gap-4">
        {requests.map((request) => (
          <div
            key={request._id}
            className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-4">
              <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                <ClipboardEdit size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {request.requestedBy.fullName}
                </h3>
                <p className="text-sm text-gray-500">
                  {request.requestedBy.email}
                </p>

                <div className="mt-3 flex items-center gap-3 rounded-lg bg-gray-50 p-3 text-sm">
                  <div className="text-gray-500">
                    <span className="block text-xs font-medium text-gray-400 uppercase">
                      Current ID
                    </span>
                    <span className="font-mono line-through">
                      {request.requestedBy.institutionId}
                    </span>
                  </div>
                  <ArrowRight size={16} className="text-gray-400" />
                  <div className="text-[#4a0400]">
                    <span className="block text-xs font-medium text-gray-400 uppercase">
                      Requested ID
                    </span>
                    <span className="font-mono font-semibold">
                      {request.newInstitutionId}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 border-t border-gray-100 pt-4 sm:border-0 sm:pt-0">
              <button
                onClick={() => handleOpenRejectModal(request._id)}
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 focus:outline-none sm:flex-none"
              >
                <X size={16} className="text-red-500" /> Reject
              </button>
              <button
                onClick={() => handleApprove(request._id)}
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#4a0400] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-900 focus:ring-2 focus:ring-[#4a0400] focus:ring-offset-2 focus:outline-none sm:flex-none"
              >
                <Check size={16} /> Approve
              </button>
            </div>
          </div>
        ))}

        {requests.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-12 text-center text-gray-500 shadow-sm">
            <ClipboardEdit size={48} className="mb-4 text-gray-300" />
            <p className="text-lg font-medium text-gray-900">
              No pending requests
            </p>
            <p className="mt-1 text-sm">
              All ID edit requests have been processed.
            </p>
          </div>
        )}
      </div>

      {/* Rejection Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity">
          {/* Modal Container */}
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Reject Edit Request
              </h2>
              <button
                onClick={handleCloseModal}
                className="cursor-pointer rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleRejectSubmit} className="space-y-4 p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Reason for Rejection
                </label>
                <textarea
                  required
                  rows={4}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a detailed reason for rejecting this ID update request..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                />
                <p className="mt-1.5 text-xs text-gray-500">
                  This reason will be included in the email notification sent to
                  the student.
                </p>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cursor-pointer rounded-lg bg-red-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:outline-none"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
