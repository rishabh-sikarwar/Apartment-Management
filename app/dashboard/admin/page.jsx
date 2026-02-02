"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Shield,
  User,
  Search,
  KeyRound,
  Loader2,
  UserCog,
  ChevronDown,
  X,
  CheckCircle2,
} from "lucide-react";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // Modal States
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [resetting, setResetting] = useState(false);

  const roles = [
    "SUPER_ADMIN",
    "SOCIETY_ADMIN",
    "SOCIETY_SECRETARY",
    "STAFF",
    "TECHNICIAN",
    "WATCHMAN",
    "HOUSE_OWNER",
    "SOCIETY_MEMBER",
    "VISITOR",
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users/all");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      const res = await fetch("/api/users/role", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newRole }),
      });

      if (!res.ok) throw new Error("Update failed");

      setUsers(
        users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
      );
      toast.success("User role updated successfully");
    } catch (err) {
      toast.error("Failed to update role");
    } finally {
      setUpdatingId(null);
    }
  };

  // 1. Open Modal instead of Prompt
  const openResetModal = (user) => {
    setSelectedUser(user);
    setNewPassword(""); // Clear previous input
    setIsResetOpen(true);
  };

  // 2. Handle actual API call from Modal
  const confirmPasswordReset = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setResetting(true);
    try {
      const res = await fetch("/api/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          newPassword: newPassword,
        }),
      });

      if (!res.ok) throw new Error("Reset failed");

      toast.success(`Password updated for ${selectedUser.name}`);
      setIsResetOpen(false); // Close modal
    } catch (err) {
      toast.error(err.message || "Failed to reset password");
    } finally {
      setResetting(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-3">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-lg text-gray-500 font-medium">Loading Users...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-10 relative">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              User Management
            </h1>
            <p className="text-base text-gray-500 pl-14">
              Manage system access, assign roles, and handle security resets.
            </p>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Users Table Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl shadow-gray-100/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200">
                  <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase tracking-wider">
                    User Identity
                  </th>
                  <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Contact Details
                  </th>
                  <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Role & Permissions
                  </th>
                  <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase tracking-wider text-right">
                    Security Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="group hover:bg-blue-50/30 transition-colors duration-200"
                    >
                      {/* User Info */}
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl shadow-inner ring-1 ring-blue-200">
                            {user.name?.[0]?.toUpperCase() || (
                              <User className="w-7 h-7" />
                            )}
                          </div>
                          <div>
                            <p className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                              {user.name || "Unknown User"}
                            </p>
                            <p className="text-sm font-mono text-gray-400 mt-1">
                              ID: {user.id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-base font-medium text-gray-700">
                            {user.email}
                          </span>
                          {user.phoneNumber ? (
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                              📞 {user.phoneNumber}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-300 italic">
                              No phone linked
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Role Dropdown */}
                      <td className="px-8 py-6">
                        <div className="relative w-full max-w-[240px]">
                          <select
                            className={`appearance-none w-full pl-4 pr-10 py-3 rounded-xl text-sm font-bold border-2 transition-all cursor-pointer outline-none focus:ring-4
                              ${
                                user.role === "SUPER_ADMIN"
                                  ? "bg-purple-50 text-purple-700 border-purple-200 focus:border-purple-400 focus:ring-purple-100 hover:border-purple-300"
                                  : user.role === "SOCIETY_ADMIN"
                                    ? "bg-blue-50 text-blue-700 border-blue-200 focus:border-blue-400 focus:ring-blue-100 hover:border-blue-300"
                                    : "bg-white text-gray-700 border-gray-200 focus:border-gray-400 focus:ring-gray-100 hover:border-gray-300 hover:bg-gray-50"
                              }`}
                            value={user.role || "VISITOR"}
                            onChange={(e) =>
                              handleRoleUpdate(user.id, e.target.value)
                            }
                            disabled={updatingId === user.id}
                          >
                            {roles.map((role) => (
                              <option key={role} value={role}>
                                {role.replace("_", " ")}
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-current opacity-60">
                            {updatingId === user.id ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="px-8 py-6 text-right">
                        <button
                          onClick={() => openResetModal(user)}
                          className="inline-flex items-center gap-2.5 px-5 py-3 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 rounded-xl transition-all active:scale-95 shadow-sm"
                        >
                          <KeyRound className="w-5 h-5" />
                          <span>Reset Password</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <div className="p-4 bg-gray-50 rounded-full mb-4">
                          <UserCog className="w-16 h-16 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          No users found
                        </h3>
                        <p className="text-base text-gray-500">
                          Try adjusting your search terms.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center text-sm text-gray-400 pb-8">
          Showing {filteredUsers.length} registered users
        </div>
      </div>

      {isResetOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
            {/* Modal Header */}
            <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-red-700 flex items-center gap-2">
                <KeyRound className="w-5 h-5" /> Reset Password
              </h3>
              <button
                onClick={() => setIsResetOpen(false)}
                className="text-red-400 hover:text-red-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={confirmPasswordReset} className="p-6 space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <UserCog className="w-8 h-8 text-red-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">
                  Reset Password for {selectedUser.name}
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  Enter a new temporary password for this user. They can change
                  it later.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  New Password
                </label>
                <input
                  type="text" // Visible text so admin knows what they typed
                  placeholder="e.g. Temp@123"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                  autoFocus
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsResetOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetting || newPassword.length < 6}
                  className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {resetting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" /> Confirm Reset
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
