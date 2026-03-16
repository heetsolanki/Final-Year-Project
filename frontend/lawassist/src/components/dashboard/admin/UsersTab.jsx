import { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../../../api";
import { Search, Users, Filter, Trash2 } from "lucide-react";
import UserTable from "../../users/UserTable";
import AlertPopup from "../../ui/AlertPopup";
import { useNavigate } from "react-router-dom";

const AdminUsersTab = ({ refreshKey }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [alertPopup, setAlertPopup] = useState({ show: false, title: "", message: "", type: "success" });

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  // Helper function to decode JWT and get userId
  const getCurrentUserId = () => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.userId;
    } catch (err) {
      console.error("Failed to decode token:", err);
      return null;
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/users`, { headers });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [refreshKey]);

  const handleAction = async (action, userId, isExpert) => {
    // Intercept delete to show confirmation
    if (action === "delete") {
      setDeleteConfirm({ userId, isExpert });
      return;
    }

    setActionLoading(`${action}-${userId}`);
    try {
      // Route expert block/unblock/promote/demote to expert-specific endpoints
      if (isExpert && (action === "block" || action === "unblock" || action === "promote" || action === "demote")) {
        await axios.put(
          `${API_URL}/api/admin/experts/${action}/${userId}`,
          {},
          { headers }
        );
      } else {
        await axios.put(
          `${API_URL}/api/admin/${action}/${userId}`,
          {},
          { headers }
        );
      }

      // If current user is demoted, logout and redirect
      if (action === "demote") {
        const currentUserId = getCurrentUserId();
        if (currentUserId === userId) {
          localStorage.removeItem("token");
          setAlertPopup({
            show: true,
            title: "Demoted",
            message: "You have been demoted from admin. Redirecting to homepage...",
            type: "info",
            redirectTo: "/"
          });
          setTimeout(() => navigate("/"), 2000);
          return;
        }
      }

      fetchUsers();
    } catch (err) {
      console.error(`Failed to ${action} user:`, err);
      if ((action === "promote" || action === "demote") && isExpert) {
        setAlertPopup({ show: true, title: "Error", message: err.response?.data?.message || `Failed to ${action} expert.`, type: "error" });
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteConfirm) return;
    setActionLoading(`delete-${deleteConfirm.userId}`);
    try {
      await axios.delete(
        `${API_URL}/api/admin/users/${deleteConfirm.userId}`,
        { headers },
      );
      setDeleteConfirm(null);
      setAlertPopup({ show: true, title: "User Deleted", message: "User account has been permanently deleted.", type: "success" });
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user:", err);
      setDeleteConfirm(null);
      setAlertPopup({ show: true, title: "Error", message: err.response?.data?.message || "Failed to delete user.", type: "error" });
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "All" || user.role === roleFilter;

    // For experts, derive status from verificationStatus
    const effectiveStatus = user._isExpert
      ? user.verificationStatus === "blocked"
        ? "blocked"
        : "active"
      : user.status;
    const matchesStatus =
      statusFilter === "All" || effectiveStatus === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-500 animate-pulse">
            Loading users...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-100">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                User Management
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {filteredUsers.length} of {users.length} users
              </p>
            </div>
          </div>
          {/* Summary Pills */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              {users.filter((u) =>
                u._isExpert
                  ? u.verificationStatus !== "blocked"
                  : u.status === "active"
              ).length} Active
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              {users.filter((u) =>
                u._isExpert
                  ? u.verificationStatus === "blocked"
                  : u.status === "blocked"
              ).length} Blocked
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100" />

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3.5 py-2.5 bg-gray-50/50 hover:bg-white hover:border-gray-300 focus-within:bg-white focus-within:border-blue-300 focus-within:shadow-sm transition-all duration-200 w-full sm:max-w-sm">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="outline-none w-full text-sm bg-transparent placeholder-gray-400"
            />
          </div>

          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3.5 py-2.5 bg-gray-50/50 hover:bg-white hover:border-gray-300 transition-all duration-200">
            <Filter size={14} className="text-gray-400 shrink-0" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="outline-none text-sm bg-transparent cursor-pointer text-gray-600"
            >
              <option value="All">All Roles</option>
              <option value="consumer">Consumer</option>
              <option value="admin">Admin</option>
              <option value="legalExpert">Legal Expert</option>
            </select>
          </div>

          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3.5 py-2.5 bg-gray-50/50 hover:bg-white hover:border-gray-300 transition-all duration-200">
            <Filter size={14} className="text-gray-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="outline-none text-sm bg-transparent cursor-pointer text-gray-600"
            >
              <option value="All">All Status</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>

        {/* User Table */}
        <UserTable
          users={filteredUsers}
          onAction={handleAction}
          actionLoading={actionLoading}
        />
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <Trash2 className="text-red-600 w-7 h-7" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete User?</h3>
            <p className="text-gray-500 text-sm mb-6">
              This will permanently delete this user account and all their associated data. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-gray-300 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg py-2.5 text-sm font-medium transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Popup */}
      <AlertPopup
        show={alertPopup.show}
        title={alertPopup.title}
        message={alertPopup.message}
        type={alertPopup.type}
        onClose={() => setAlertPopup({ show: false, title: "", message: "", type: "success" })}
      />
    </div>
  );
};

export default AdminUsersTab;
