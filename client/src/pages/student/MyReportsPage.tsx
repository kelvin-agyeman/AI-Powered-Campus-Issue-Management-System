import { useState, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  X,
  AlertTriangle,
  Upload,
  Check,
} from "lucide-react";
import {
  useStudentIssues,
  useUpdateIssue,
  useDeleteIssue,
  useDeleteIssueImage,
} from "../../hooks/useStudent";
import type { Issue } from "../../types/issue.types";

export const MyReportsPage = () => {
  const { data, isLoading } = useStudentIssues();
  const issues = data?.issues || [];

  // Dropdown State
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLTableDataCellElement>(null);

  // Modal States
  const [selectedReport, setSelectedReport] = useState<Issue | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");

  // Form States for Update
  const [editDescription, setEditDescription] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editFiles, setEditFiles] = useState<File[]>([]);

  // Track which existing images the user wants to keep
  const [retainedImages, setRetainedImages] = useState<
    { url: string; publicId: string }[]
  >([]);

  // React Query Mutations
  const { mutate: updateIssue, isPending: isUpdating } = useUpdateIssue(() => {
    setIsUpdateModalOpen(false);
    setSelectedReport(null);
  });

  const { mutate: deleteIssue, isPending: isDeleting } = useDeleteIssue(() => {
    setIsDeleteModalOpen(false);
    setSelectedReport(null);
  });

  // NEW: Hook to delete single images on the fly
  const { mutate: deleteIssueImage, isPending: isDeletingImage } =
    useDeleteIssueImage();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isUpdateModalOpen || isDeleteModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isUpdateModalOpen, isDeleteModalOpen]);

  const handleOpenUpdate = (report: Issue) => {
    setSelectedReport(report);
    setEditDescription(report.description);
    setEditLocation(report.location);
    setEditFiles([]);
    setRetainedImages(report.images || []);
    setActiveMenuId(null);
    setIsUpdateModalOpen(true);
  };

  const handleOpenDelete = (report: Issue) => {
    setSelectedReport(report);
    setActiveMenuId(null);
    setIsDeleteModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      setEditFiles((prev) => [...prev, ...selected]);
    }
  };

  const removeNewFile = (indexToRemove: number) => {
    setEditFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // UPDATED: Now calls the backend endpoint directly
  const removeRetainedImage = (publicId: string) => {
    if (!selectedReport) return;

    // Call the delete mutation
    deleteIssueImage(
      { issueId: selectedReport._id, publicId },
      {
        onSuccess: () => {
          // If successful, remove it from the local UI state
          setRetainedImages((prev) =>
            prev.filter((img) => img.publicId !== publicId),
          );
        },
      },
    );
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;

    const formData = new FormData();
    formData.append("description", editDescription.trim());
    formData.append("location", editLocation.trim());

    // REMOVED the append of retainedImages, since they are managed individually now

    // Append new files
    editFiles.forEach((file) => {
      formData.append("images", file);
    });

    updateIssue({ id: selectedReport._id, formData });
  };

  const handleDeleteConfirm = () => {
    if (!selectedReport) return;
    deleteIssue(selectedReport._id);
  };

  const getStatusBadge = (status: Issue["status"]) => {
    switch (status) {
      case "resolved":
      case "approved":
        return (
          <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
            {status.replace(/_/g, " ").toUpperCase()}
          </span>
        );
      case "in_progress":
      case "assigned":
        return (
          <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-amber-600/20 ring-inset">
            {status.replace(/_/g, " ").toUpperCase()}
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700 ring-1 ring-red-600/20 ring-inset">
            REJECTED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset">
            PENDING REVIEW
          </span>
        );
    }
  };

  const filteredReports = issues.filter(
    (report) =>
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.aiRecommendation?.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      report._id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Reports</h1>
            <p className="mt-1 text-sm text-gray-500">
              Track and manage all your submitted issue reports.
            </p>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          <div className="relative max-w-md flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-md border border-gray-300 py-2 pr-3 pl-10 text-sm placeholder-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
              placeholder="Search reports by title, location or ID..."
            />
          </div>
          <button className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none">
            <Filter size={16} />
            Filter
          </button>
        </div>

        {/* Desktop Table */}
        <div className="overflow-visible rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto overflow-y-visible">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                  >
                    Report Details
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                  >
                    Location
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                  >
                    Date Submitted
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                  >
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-sm text-gray-500"
                    >
                      Loading reports...
                    </td>
                  </tr>
                ) : filteredReports.length > 0 ? (
                  filteredReports.map((report) => (
                    <tr
                      key={report._id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {report.aiRecommendation?.title ||
                              report.description.substring(0, 45) + "..."}
                          </span>
                          <span className="text-xs text-gray-400">
                            ID: {report._id}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                        {report.location}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(report.status)}
                      </td>

                      {/* Actions Column */}
                      <td
                        className="relative px-6 py-4 text-right text-sm font-medium whitespace-nowrap"
                        ref={activeMenuId === report._id ? menuRef : null}
                      >
                        <button
                          onClick={() =>
                            setActiveMenuId(
                              activeMenuId === report._id ? null : report._id,
                            )
                          }
                          className="cursor-pointer rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:ring-2 focus:ring-red-500 focus:outline-none"
                        >
                          <MoreVertical size={18} />
                        </button>

                        {/* Dropdown Menu */}
                        {activeMenuId === report._id && (
                          <div className="ring-opacity-5 absolute top-10 right-8 z-10 w-40 rounded-md bg-white py-1 shadow-lg ring-1 ring-black focus:outline-none">
                            <button
                              onClick={() => handleOpenUpdate(report)}
                              className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Edit size={14} className="text-gray-500" />
                              Update Issue
                            </button>
                            <button
                              onClick={() => handleOpenDelete(report)}
                              className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={14} className="text-red-500" />
                              Delete Issue
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-sm text-gray-500"
                    >
                      No reports found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* Update Issue Modal */}
      {isUpdateModalOpen && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Update Report Information
              </h3>
              <button
                onClick={() => !isUpdating && setIsUpdateModalOpen(false)}
                className="cursor-pointer rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateSubmit} className="p-6">
              <div className="space-y-5">
                {/* Location Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Location / Building
                  </label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                    required
                  />
                </div>

                {/* Description Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Issue Description
                  </label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={4}
                    className="w-full resize-none rounded-md border border-gray-300 px-4 py-3 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                    required
                  />
                </div>

                {/* Display Existing Uploaded Images with Remove functionality */}
                {retainedImages.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Currently Attached Images
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {retainedImages.map((img, index) => (
                        <div
                          key={img.publicId || index}
                          className="group relative overflow-hidden rounded-lg border border-gray-200"
                        >
                          <img
                            src={img.url}
                            alt={`Evidence ${index + 1}`}
                            className="h-20 w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeRetainedImage(img.publicId)}
                            disabled={isDeletingImage} // UPDATED: Disable button while deleting
                            className="absolute top-1 right-1 flex cursor-pointer items-center justify-center rounded-full bg-red-100 p-1 text-red-600 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-200 disabled:opacity-50"
                            title="Remove this image"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Photo Evidence Upload for New Files */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Add New Photos (Optional)
                  </label>
                  <div className="flex flex-col gap-3">
                    <label className="flex w-fit cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                      <Upload size={16} className="text-gray-500" />
                      Choose Files
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                      />
                    </label>

                    {/* Preview Newly Selected Files */}
                    {editFiles.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {editFiles.map((file, idx) => (
                          <div
                            key={`${file.name}-${idx}`}
                            className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                          >
                            <Check size={12} className="text-green-600" />
                            <span className="max-w-35 truncate">
                              {file.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeNewFile(idx)}
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
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  disabled={isUpdating}
                  className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none disabled:opacity-70"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating || !editDescription || !editLocation}
                  className="cursor-pointer rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none disabled:opacity-70"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Issue Modal */}
      {isDeleteModalOpen && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delete Report
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Are you sure you want to delete this issue report? This
                    action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isDeleting}
                  className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none disabled:opacity-70"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="cursor-pointer rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none disabled:opacity-70"
                >
                  {isDeleting ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
