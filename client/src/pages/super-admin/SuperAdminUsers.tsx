import { useState } from "react";
import {
  Search,
  UserPlus,
  CheckCircle,
  XCircle,
  X,
  Loader2,
  Pencil,
} from "lucide-react";
import {
  useAllUsers,
  useRegisterUser,
  useToggleUserStatus,
  useUpdateUser,
} from "../../hooks/useSuperAdmin";
import { KNUST_DEPARTMENTS } from "../../../../src/utils/constants";

export const SuperAdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Registration Modal State
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [registerFormData, setRegisterFormData] = useState({
    fullName: "",
    email: "",
    institutionId: "",
    password: "",
    role: "staff",
    department: "",
  });

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    fullName: "",
    email: "",
    institutionId: "",
    role: "staff", // Kept in state for conditional rendering, but removed from UI
    department: "",
  });

  // Queries and Mutations
  const { data: usersData, isLoading: isLoadingUsers } = useAllUsers();

  const { mutate: registerUser, isPending: isRegistering } = useRegisterUser(
    () => {
      // Reset form and close modal on success
      setRegisterFormData({
        fullName: "",
        email: "",
        institutionId: "",
        password: "",
        role: "staff",
        department: "",
      });
      setIsRegisterModalOpen(false);
    },
  );

  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser(() => {
    setIsEditModalOpen(false);
    setEditingUserId(null);
  });

  const { mutate: toggleUserStatus } = useToggleUserStatus();

  // Safely grab the users array
  const users = usersData?.users || [];

  // Local filtering
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.institutionId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Handle Register Submit
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerUser({
      type: registerFormData.role as "admin" | "staff",
      data: registerFormData,
    });
  };

  // Open Edit Modal
  const handleOpenEditModal = (user: (typeof users)[0]) => {
    setEditingUserId(user._id);
    setEditFormData({
      fullName: user.fullName || "",
      email: user.email || "",
      institutionId: user.institutionId || "",
      role: user.role || "staff",
      department: user.department || "",
    });
    setIsEditModalOpen(true);
  };

  // Handle Edit Submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUserId) return;

    const updatePayload: Partial<typeof editFormData> = {
      fullName: editFormData.fullName,
      email: editFormData.email,
      institutionId: editFormData.institutionId,
    };

    if (editFormData.role === "staff") {
      updatePayload.department = editFormData.department;
    }

    updateUser({
      id: editingUserId,
      data: updatePayload,
    });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage students, staff, and system administrators.
          </p>
        </div>
        <button
          onClick={() => setIsRegisterModalOpen(true)}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#4a0400] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-900 focus:ring-2 focus:ring-[#4a0400] focus:ring-offset-2 focus:outline-none"
        >
          <UserPlus size={18} />
          Register Staff / Admin
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Name or Institution ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 w-full rounded-lg border border-gray-300 pr-4 pl-10 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="h-10 cursor-pointer rounded-lg border border-gray-300 px-4 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none sm:w-48"
        >
          <option value="all">All Roles</option>
          <option value="student">Students</option>
          <option value="staff">Staff</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Role & Dept
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {isLoadingUsers ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex justify-center text-gray-500">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 font-bold text-gray-600">
                          {user.fullName.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.institutionId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : user.role === "staff"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)}
                        </span>
                        {user.department && (
                          <span className="text-xs text-gray-500">
                            {user.department}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.isActive ? (
                        <span className="inline-flex items-center gap-1 text-sm text-emerald-600">
                          <CheckCircle size={16} /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-sm text-red-600">
                          <XCircle size={16} /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEditModal(user)}
                        className="mr-4 inline-flex cursor-pointer items-center gap-1 text-indigo-600 hover:text-indigo-900"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        onClick={() =>
                          toggleUserStatus({
                            id: user._id,
                            activate: !user.isActive,
                          })
                        }
                        className={
                          user.isActive
                            ? "cursor-pointer text-red-600 hover:text-red-900"
                            : "cursor-pointer text-emerald-600 hover:text-emerald-900"
                        }
                      >
                        {user.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-sm text-gray-500"
                  >
                    No users found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* -------------------- REGISTRATION MODAL -------------------- */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Register New User
              </h2>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                disabled={isRegistering}
                className="cursor-pointer rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-4 p-6">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  disabled={isRegistering}
                  value={registerFormData.fullName}
                  onChange={(e) =>
                    setRegisterFormData({
                      ...registerFormData,
                      fullName: e.target.value,
                    })
                  }
                  placeholder="e.g. John Doe"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  disabled={isRegistering}
                  value={registerFormData.email}
                  onChange={(e) =>
                    setRegisterFormData({
                      ...registerFormData,
                      email: e.target.value,
                    })
                  }
                  placeholder="e.g. jdoe@institution.edu"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Institution ID
                </label>
                <input
                  type="text"
                  required
                  disabled={isRegistering}
                  value={registerFormData.institutionId}
                  onChange={(e) =>
                    setRegisterFormData({
                      ...registerFormData,
                      institutionId: e.target.value,
                    })
                  }
                  placeholder="e.g. STF-2026-001"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none disabled:bg-gray-100"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  required
                  disabled={isRegistering}
                  value={registerFormData.password}
                  onChange={(e) =>
                    setRegisterFormData({
                      ...registerFormData,
                      password: e.target.value,
                    })
                  }
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  value={registerFormData.role}
                  onChange={(e) =>
                    setRegisterFormData({
                      ...registerFormData,
                      role: e.target.value,
                    })
                  }
                  disabled={isRegistering}
                  className="w-full cursor-pointer rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none disabled:bg-gray-100"
                >
                  <option value="staff">Staff</option>
                  <option value="admin">System Administrator</option>
                </select>
              </div>

              {/* Only show department if registering staff */}
              {registerFormData.role === "staff" && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Department
                  </label>
                  <select
                    value={registerFormData.department}
                    onChange={(e) =>
                      setRegisterFormData({
                        ...registerFormData,
                        department: e.target.value,
                      })
                    }
                    required
                    disabled={isRegistering}
                    className="w-full cursor-pointer rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none disabled:bg-gray-100"
                  >
                    <option value="" disabled>
                      Select a department...
                    </option>
                    {KNUST_DEPARTMENTS.map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  disabled={isRegistering}
                  className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRegistering}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#4a0400] px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-red-900 focus:ring-2 focus:ring-[#4a0400] focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isRegistering && (
                    <Loader2 size={16} className="animate-spin" />
                  )}
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------- EDIT USER MODAL -------------------- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Edit User Details
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                disabled={isUpdating}
                className="cursor-pointer rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 p-6">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  disabled={isUpdating}
                  value={editFormData.fullName}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      fullName: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  disabled={isUpdating}
                  value={editFormData.email}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      email: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Institution ID
                </label>
                <input
                  type="text"
                  required
                  disabled={isUpdating}
                  value={editFormData.institutionId}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      institutionId: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none disabled:bg-gray-100"
                />
              </div>

              {/* Conditionally display department only if the user's role is "staff" */}
              {editFormData.role === "staff" && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Department
                  </label>
                  <select
                    value={editFormData.department}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        department: e.target.value,
                      })
                    }
                    required
                    disabled={isUpdating}
                    className="w-full cursor-pointer rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none disabled:bg-gray-100"
                  >
                    <option value="" disabled>
                      Select a department...
                    </option>
                    {KNUST_DEPARTMENTS.map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isUpdating}
                  className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#4a0400] px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-red-900 focus:ring-2 focus:ring-[#4a0400] focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isUpdating && <Loader2 size={16} className="animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
