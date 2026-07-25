import { PageHeader } from "../../components/ui/PageHeader";
import { Search, Filter, Eye } from "lucide-react";

export function PendingIssues() {
  // Mock data for UI development
  const pendingIssues = [
    {
      id: "60d5ecb8b392",
      title: "Water leak in main library",
      category: "Maintenance",
      priority: "High",
      aiConfidence: 94,
      date: "Oct 12, 2026",
    },
    {
      id: "60d5ecb8b393",
      title: "WiFi down in Block A",
      category: "IT Support",
      priority: "Critical",
      aiConfidence: 88,
      date: "Oct 12, 2026",
    }
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader 
        title="Pending Reviews" 
        description="Review and approve AI categorizations before assigning to staff." 
      />

      {/* Controls Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-grey-100 bg-white p-4 shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-300" size={20} />
          <input 
            type="text" 
            placeholder="Search pending issues..." 
            className="w-full rounded-xl border border-grey-200 bg-grey-50 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-red-500 focus:bg-white"
          />
        </div>
        
        <button className="flex items-center justify-center gap-2 rounded-xl border border-grey-200 px-4 py-2.5 text-sm font-medium text-grey-500 transition-colors hover:bg-grey-50">
          <Filter size={18} />
          Filters
        </button>
      </div>

      {/* Table Area */}
      <div className="overflow-hidden rounded-2xl border border-grey-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-grey-500">
            <thead className="bg-grey-50 text-xs font-semibold uppercase text-grey-400">
              <tr>
                <th className="px-6 py-4">Issue Details</th>
                <th className="px-6 py-4">AI Category</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">AI Confidence</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-grey-100">
              {pendingIssues.map((issue) => (
                <tr key={issue.id} className="transition-colors hover:bg-grey-50/50">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-grey-500">{issue.title}</p>
                    <p className="text-xs text-grey-400">{issue.date}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-grey-100 px-2.5 py-0.5 text-xs font-medium text-grey-500">
                      {issue.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-500">
                      {issue.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 overflow-hidden rounded-full bg-grey-100">
                        <div 
                          className="h-full bg-green-500" 
                          style={{ width: `${issue.aiConfidence}%` }} 
                        />
                      </div>
                      <span className="text-xs font-medium">{issue.aiConfidence}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {/* Placeholder for Link routing to issue details */}
                    <button className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-100">
                      <Eye size={16} />
                      Review
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
}