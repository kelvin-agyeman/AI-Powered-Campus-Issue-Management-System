import { Search, Filter, MoreVertical } from "lucide-react";

export const MyReportsPage = () => {
  // Mock data for display
  const reports = [
    {
      id: "REP-001",
      title: "Broken Air Conditioner",
      location: "Library, Floor 2",
      date: "Oct 24, 2026",
      status: "In Progress",
    },
    {
      id: "REP-002",
      title: "Flickering Lights",
      location: "Engineering Block, Room 104",
      date: "Oct 22, 2026",
      status: "Resolved",
    },
    {
      id: "REP-003",
      title: "Water leak under main sink",
      location: "Science Facility 1",
      date: "July 21, 2026",
      status: "Pending",
    },
  ];

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

      {/* Desktop Table & Mobile Card List */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
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
                      <span className="text-sm text-gray-500">{report.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                    {report.location}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                    {report.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(report.status)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                    <button className="cursor-pointer text-gray-400 hover:text-gray-600">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
