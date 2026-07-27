import { CheckCircle, Clock, AlertTriangle, Info, CheckCheck } from "lucide-react";
import { useStudentNotifications, useMarkAllNotificationsRead } from "../../hooks/useStudent";

export const StudentNotificationsPage = () => {
  const { data, isLoading } = useStudentNotifications();
  const notifications = data?.data.notifications || [];
  
  const { mutate: markAllRead, isPending: isMarking } = useMarkAllNotificationsRead();

  const getIcon = (type: string) => {
    switch (type) {
      case "ISSUE_RESOLVED":
      case "ISSUE_APPROVED":
        return <CheckCircle className="text-green-500" size={20} />;
      case "ISSUE_IN_PROGRESS":
      case "ISSUE_ASSIGNED":
        return <Clock className="text-blue-500" size={20} />;
      case "ISSUE_REJECTED":
        return <AlertTriangle className="text-amber-500" size={20} />;
      default:
        return <Info className="text-gray-500" size={20} />;
    }
  };

  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-1 text-sm text-gray-500">Stay updated on your reports and campus announcements.</p>
        </div>
        <button 
          onClick={() => markAllRead()}
          disabled={!hasUnread || isMarking}
          className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
        >
          <CheckCheck size={16} />
          {isMarking ? "Marking..." : "Mark all as read"}
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading notifications...</div>
        ) : notifications.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <li
                key={notification._id}
                className={`p-4 transition-colors hover:bg-gray-50 sm:p-6 ${
                  !notification.isRead ? "bg-red-50/30" : "bg-white"
                }`}
              >
                <div className="flex gap-4">
                  <div className="mt-1 shrink-0 rounded-full bg-white p-1.5 shadow-sm ring-1 ring-gray-200">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-sm font-medium ${!notification.isRead ? "text-gray-900" : "text-gray-700"}`}>
                        {notification.title}
                      </p>
                      <span className="shrink-0 text-xs text-gray-500">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center text-gray-500">No notifications found.</div>
        )}
      </div>
    </div>
  );
};