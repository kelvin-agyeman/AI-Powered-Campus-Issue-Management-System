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
} from "lucide-react";

// Updated the shape of our report data to include the new fields
interface Report {
  id: string;
  title: string;
  description: string;
  building: string;
  roomNumber: string;
  date: string;
  status: string;
  photoFileName?: string;
}

const INITIAL_REPORTS: Report[] = [
  {
    id: "REP-001",
    title: "Broken Air Conditioner",
    description:
      "The AC unit is making a loud rattling noise and is not blowing any cold air.",
    building: "Library",
    roomNumber: "Floor 2",
    date: "Oct 24, 2026",
    status: "In Progress",
    photoFileName: "ac_unit_issue.jpg",
  },
  {
    id: "REP-002",
    title: "Flickering Lights",
    description:
      "Three fluorescent tubes are constantly flickering, causing eye strain.",
    building: "Engineering Block",
    roomNumber: "104",
    date: "Oct 22, 2026",
    status: "Resolved",
  },
  {
    id: "REP-003",
    title: "Water leak under main sink",
    description:
      "There is a pool of water forming under the sink. The pipe seems busted.",
    building: "Science Facility 1",
    roomNumber: "Lab 3B",
    date: "July 21, 2026",
    status: "Pending",
    photoFileName: "leak_photo.png",
  },
];

export const MyReportsPage = () => {
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);

  // Dropdown State
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLTableDataCellElement>(null);

  // Modal States
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form States for Update (Excluding Title)
  const [editDescription, setEditDescription] = useState("");
  const [editBuilding, setEditBuilding] = useState("");
  const [editRoomNumber, setEditRoomNumber] = useState("");
  const [editPhotoName, setEditPhotoName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Prevent background scrolling when a modal is open
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

  const handleOpenUpdate = (report: Report) => {
    setSelectedReport(report);
    setEditDescription(report.description);
    setEditBuilding(report.building);
    setEditRoomNumber(report.roomNumber);
    setEditPhotoName(report.photoFileName || "");
    setActiveMenuId(null);
    setIsUpdateModalOpen(true);
  };

  const handleOpenDelete = (report: Report) => {
    setSelectedReport(report);
    setActiveMenuId(null);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;

    setIsSubmitting(true);
    // Simulate API Call - backend would regenerate AI title based on description change here
    setTimeout(() => {
      setReports((prev) =>
        prev.map((r) =>
          r.id === selectedReport.id
            ? {
                ...r,
                description: editDescription,
                building: editBuilding,
                roomNumber: editRoomNumber,
                photoFileName: editPhotoName,
              }
            : r,
        ),
      );
      setIsSubmitting(false);
      setIsUpdateModalOpen(false);
      setSelectedReport(null);
    }, 800);
  };

  const handleDeleteConfirm = () => {
    if (!selectedReport) return;

    setIsSubmitting(true);
    // Simulate API Call
    setTimeout(() => {
      setReports((prev) => prev.filter((r) => r.id !== selectedReport.id));
      setIsSubmitting(false);
      setIsDeleteModalOpen(false);
      setSelectedReport(null);
    }, 800);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Resolved":
        return (
          <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
            Resolved
          </span>
        );
      case "In Progress":
        return (
          <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-amber-600/20 ring-inset">
            In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset">
            Pending
          </span>
        );
    }
  };

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
              className="block w-full rounded-md border border-gray-300 py-2 pr-3 pl-10 text-sm placeholder-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
              placeholder="Search reports by title or ID..."
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
                {reports.map((report) => (
                  <tr
                    key={report.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                          {report.title}
                        </span>
                        <span className="text-sm text-gray-500">
                          {report.id}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                      {report.building}
                      {report.roomNumber ? `, ${report.roomNumber}` : ""}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                      {report.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(report.status)}
                    </td>

                    {/* Actions Column with Dropdown */}
                    <td
                      className="relative px-6 py-4 text-right text-sm font-medium whitespace-nowrap"
                      ref={activeMenuId === report.id ? menuRef : null}
                    >
                      <button
                        onClick={() =>
                          setActiveMenuId(
                            activeMenuId === report.id ? null : report.id,
                          )
                        }
                        className="cursor-pointer rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:ring-2 focus:ring-red-500 focus:outline-none"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenuId === report.id && (
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
                ))}
                {reports.length === 0 && (
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
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Update Report Information
              </h3>
              <button
                onClick={() => !isSubmitting && setIsUpdateModalOpen(false)}
                className="cursor-pointer rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateSubmit} className="p-6">
              <div className="space-y-5">
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

                {/* Location & Room Number Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Location / Building
                    </label>
                    <input
                      type="text"
                      value={editBuilding}
                      onChange={(e) => setEditBuilding(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Room Number (Optional)
                    </label>
                    <input
                      type="text"
                      value={editRoomNumber}
                      onChange={(e) => setEditRoomNumber(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Photo Evidence Upload (Frontend Mock) */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Photo Evidence
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                      <Upload size={16} className="text-gray-500" />
                      Choose File
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) =>
                          setEditPhotoName(e.target.files?.[0]?.name || "")
                        }
                      />
                    </label>
                    <span className="text-sm text-gray-500">
                      {editPhotoName || "No new file chosen"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  disabled={isSubmitting}
                  className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none disabled:opacity-70"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !editDescription ||
                    !editBuilding ||
                    !editRoomNumber
                  }
                  className="cursor-pointer rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none disabled:opacity-70"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
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
                    Are you sure you want to delete{" "}
                    <span className="font-medium text-gray-900">
                      "{selectedReport.title}"
                    </span>
                    ? This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isSubmitting}
                  className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none disabled:opacity-70"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={isSubmitting}
                  className="cursor-pointer rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none disabled:opacity-70"
                >
                  {isSubmitting ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
