import { useState } from "react";
import { Megaphone, Send, Loader2 } from "lucide-react";
import { useSendBroadcast } from "../../hooks/useSuperAdmin";

export const SuperAdminBroadcasts = () => {
  const [targetAudience, setTargetAudience] = useState("all");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [priority] = useState("normal");

  const { mutate: sendBroadcast, isPending } = useSendBroadcast(() => {
    // Clear form on success
    setTitle("");
    setMessage("");
    setTargetAudience("all");
  });

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    sendBroadcast({ targetAudience, title, message, priority });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Broadcasts</h1>
        <p className="mt-1 text-sm text-gray-500">
          Send critical announcements and notifications to specific user groups.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Composition Form */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:col-span-2">
          <form onSubmit={handleSendBroadcast} className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Target Audience
              </label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                disabled={isPending}
                className="w-full cursor-pointer rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none disabled:bg-gray-100"
              >
                <option value="all">Everyone (Students, Staff, Admins)</option>
                <option value="students">All Students</option>
                <option value="staff">All Staff</option>
                <option value="admins">Administrators Only</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Broadcast Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Scheduled System Maintenance"
                required
                disabled={isPending}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Message Body
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="Type your announcement here..."
                required
                disabled={isPending}
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none disabled:bg-gray-100"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#4a0400] px-4 py-3 font-medium text-white transition-all hover:bg-red-900 focus:ring-2 focus:ring-[#4a0400] focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Sending Broadcast...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send Broadcast Now
                </>
              )}
            </button>
          </form>
        </div>

        {/* Guidelines Side Panel */}
        <div className="h-fit rounded-xl border border-blue-100 bg-blue-50/50 p-6">
          <div className="mb-4 flex items-center gap-2 text-blue-800">
            <Megaphone size={20} />
            <h3 className="font-semibold">Broadcast Guidelines</h3>
          </div>
          <ul className="space-y-3 text-sm text-blue-900">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500"></span>
              <span>
                Broadcasts bypass standard notification preferences and will
                appear on the recipients' dashboards immediately.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500"></span>
              <span>
                Double-check your target audience. Announcements cannot be
                unsent once delivered.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
