import { Filter, Search, Download } from "lucide-react";

export const AllIssuesPage = () => {
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
        <button className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
          <Download size={16} /> Export CSV
        </button>
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
              placeholder="Search by Reporter or ID..."
              className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
            />
          </div>

          {/* Filter Dropdowns mapped to adminService.ts query params */}
          <select className="rounded-md border border-gray-300 py-2 pr-8 pl-3 text-sm outline-none focus:border-red-500">
            <option value="">All Statuses</option>
            <option value="pending_admin_review">Pending</option>
            <option value="approved">Approved</option>
            <option value="assigned">Assigned</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select className="rounded-md border border-gray-300 py-2 pr-8 pl-3 text-sm outline-none focus:border-red-500">
            <option value="">All Departments</option>
            <option value="ESTATES">Estates</option>
            <option value="ICT">ICT</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>

          <select className="rounded-md border border-gray-300 py-2 pr-8 pl-3 text-sm outline-none focus:border-red-500">
            <option value="">Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <button className="flex items-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
            <Filter size={16} /> More Filters
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
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {/* Map over getAllIssues() response here */}
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  #ISS-8923
                </div>
                <div className="text-sm text-gray-500">Today, 10:23 AM</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  Jane Doe
                </div>
                <div className="text-sm text-gray-500">
                  jane@st.knust.edu.gh
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">Broken Chair in LT1</div>
                <div className="line-clamp-1 text-xs text-gray-500">
                  The front row seat is completely detached.
                </div>
              </td>
              <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                Estates
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex rounded-full bg-blue-100 px-2 text-xs leading-5 font-semibold text-blue-800">
                  Assigned
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
