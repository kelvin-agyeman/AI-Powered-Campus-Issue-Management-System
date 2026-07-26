import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, AlertCircle, ChevronRight, BrainCircuit } from "lucide-react";

export const PendingReviews = () => {
  // In reality, this data comes from: await api.get('/admin/issues/pending')
  const [pendingIssues] = useState([
    {
      _id: "issue_123",
      title: "Projector not working in Room 302",
      description:
        "The HDMI cable seems broken and the projector won't turn on.",
      createdAt: new Date().toISOString(),
      priority: "high",
      category: "Maintenance",
      aiRecommendation: { status: "completed", department: "ICT" },
    },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pending Reviews</h1>
        <p className="mt-1 text-sm text-gray-500">
          Issues awaiting administrative approval or modification.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <ul className="divide-y divide-gray-200">
          {pendingIssues.map((issue) => (
            <li key={issue._id} className="transition-colors hover:bg-gray-50">
              <Link
                to={`/admin/pending/${issue._id}`}
                className="flex items-center justify-between p-6"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900">
                      {issue.title}
                    </span>
                    {issue.aiRecommendation && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                        <BrainCircuit size={12} />
                        AI Processed
                      </span>
                    )}
                  </div>
                  <p className="line-clamp-1 max-w-2xl text-sm text-gray-500">
                    {issue.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />{" "}
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1 capitalize">
                      <AlertCircle size={14} /> {issue.priority} Priority
                    </span>
                  </div>
                </div>
                <div className="flex items-center text-red-600">
                  <span className="mr-2 text-sm font-medium">Review</span>
                  <ChevronRight size={20} />
                </div>
              </Link>
            </li>
          ))}
          {pendingIssues.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No pending issues to review.
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};
