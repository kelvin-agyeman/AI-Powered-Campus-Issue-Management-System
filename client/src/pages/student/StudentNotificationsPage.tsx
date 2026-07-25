import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Info,
  CheckCheck,
} from "lucide-react";

export const StudentNotificationsPage = () => {
  // Mock data for notifications
  const notifications = [
    {
      id: 1,
      title: "Report Resolved",
      message:
        "Your report 'Water leak under main sink' has been marked as resolved.",
      time: "2 hours ago",
      type: "success",
      isRead: false,
    },
    {
      id: 2,
      title: "Status Update",
      message: "Your report 'Broken Air Conditioner' is now In Progress.",
      time: "Yesterday",
      type: "update",
      isRead: false,
    },
    {
      id: 3,
      title: "Action Needed",
      message:
        "Facility Manager requested more details regarding your recent report.",
      time: "Oct 22, 2026",
      type: "alert",
      isRead: true,
    },
    {
      id: 4,
      title: "System Announcement",
      message:
        "Scheduled maintenance for the library water system this weekend.",
      time: "Oct 20, 2026",
      type: "info",
      isRead: true,
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="text-green-500" size={20} />;
      case "update":
        return <Clock className="text-blue-500" size={20} />;
      case "alert":
        return <AlertTriangle className="text-amber-500" size={20} />;
      case "info":
      default:
        return <Info className="text-gray-500" size={20} />;
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-1 text-sm text-gray-500">
            Stay updated on your reports and campus announcements.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none">
          <CheckCheck size={16} />
          Mark all as read
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <ul className="divide-y divide-gray-100">
          {notifications.map((notification) => (
            <li
              key={notification.id}
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
                    <p
                      className={`text-sm font-medium ${!notification.isRead ? "text-gray-900" : "text-gray-700"}`}
                    >
                      {notification.title}
                    </p>
                    <span className="shrink-0 text-xs text-gray-500">
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {notification.message}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
