import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Clock,
  ListTodo,
  LogOut,
  Menu,
  Bell,
  X,
  User,
} from "lucide-react";
import CampusDeskWhiteLogo from "../assets/icons/CampusDesk-white-logo.png";
import { useLogout } from "../hooks/useAuth";
import { useCurrentUser } from "../hooks/useUser";
import { Loading } from "../components/ui/Loading";

export const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { mutate: logout, isPending } = useLogout();
  const location = useLocation();
  const { data, isLoading } = useCurrentUser();

  const user = data?.user;

  if (isLoading) {
    return <Loading />;
  }

  const navLinks = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Pending Reviews", path: "/admin/pending", icon: Clock },
    { name: "All Issues", path: "/admin/issues", icon: ListTodo },
    { name: "Profile", path: "/admin/profile", icon: User },
  ];

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Matching the exact #4a0400 background */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 transform flex-col bg-[#4a0400] text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-6">
          <div className="flex cursor-default items-center gap-3">
            <img
              src={CampusDeskWhiteLogo}
              alt="Campus Desk White Logo"
              width={32}
            />
            <span className="text-xl font-bold">CampusDesk</span>
          </div>
          <button
            className="cursor-pointer text-gray-300 hover:text-white lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="mt-6 flex flex-1 flex-col gap-2 overflow-y-auto px-4 pb-4">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;

            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-red-500 text-white"
                    : "text-red-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={20} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-white/10 p-4">
          <button
            onClick={() => logout()}
            disabled={isPending}
            className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-200 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogOut size={20} />
            {isPending ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="cursor-pointer text-gray-500 hover:text-gray-700 lg:hidden"
          >
            <Menu size={24} />
          </button>

          <div className="flex flex-1 items-center justify-end gap-4">
            <Link
              to="/admin/notifications"
              className="relative rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none"
            >
              <Bell size={20} />
              {/* Notification Badge - You can make this conditional later based on unread count */}
              <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
            </Link>

            <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
              <div className="hidden text-right text-sm sm:block">
                <p className="font-semibold text-gray-700">
                  {user?.fullName || ""}
                </p>
                <p className="text-xs text-gray-500">System Admin</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 font-bold text-white">
                {getInitials(user?.fullName || "")}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
