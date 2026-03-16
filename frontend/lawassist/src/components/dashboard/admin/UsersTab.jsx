import { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../../../api";
import { Search, Users, Filter } from "lucide-react";
import UserTable from "../../users/UserTable";
import AlertPopup from "../../ui/AlertPopup";
import { useNavigate } from "react-router-dom";
import { useConfirmModal } from "../../../context/ConfirmModalContext";

const AdminUsersTab = ({ refreshKey }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [alertPopup, setAlertPopup] = useState({ show: false, title: "", message: "", type: "success" });
  const { openConfirmModal } = useConfirmModal();

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
    if (["delete", "block", "unblock", "promote", "demote"].includes(action)) {
      setPendingAction({ action, userId, isExpert });
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

  const executeConfirmedAction = async ({ action, userId, isExpert }) => {
    if (!action || !userId) return;
    setActionLoading(`${action}-${userId}`);

    try {
      if (action === "delete") {
        await axios.delete(`${API_URL}/api/admin/users/${userId}`, { headers });
        setAlertPopup({ show: true, title: "User Deleted", message: "User account has been permanently deleted.", type: "success" });
      } else if (isExpert && ["block", "unblock", "promote", "demote"].includes(action)) {
        await axios.put(`${API_URL}/api/admin/experts/${action}/${userId}`, {}, { headers });
      } else {
        await axios.put(`${API_URL}/api/admin/${action}/${userId}`, {}, { headers });
      }

      if (action === "demote") {
        const currentUserId = getCurrentUserId();
        if (currentUserId === userId) {
          localStorage.removeItem("token");
          setAlertPopup({
            show: true,
            title: "Demoted",
            message: "You have been demoted from admin. Redirecting to homepage...",
            type: "info",
            redirectTo: "/",
          });
          setTimeout(() => navigate("/"), 2000);
          return;
        }
      }

      fetchUsers();
    } catch (err) {
      console.error(`Failed to ${action} user:`, err);
      setAlertPopup({
        show: true,
        title: "Error",
        message: err.response?.data?.message || `Failed to ${action} user.`,
        type: "error",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getActionModalConfig = () => {
    if (!pendingAction) return null;

    const noun = pendingAction.isExpert ? "expert" : "user";

    const config = {
      delete: {
        title: `Delete ${pendingAction.isExpert ? "Expert" : "User"}?`,
        description: `This will permanently delete the ${noun} account and all associated data.`,
        confirmText: "Delete",
        type: "danger",
      },
      block: {
        title: `Block ${pendingAction.isExpert ? "Expert" : "User"}?`,
        description: `The ${noun} will no longer be able to access the platform.`,
        confirmText: "Block",
        type: "block",
      },
      unblock: {
        title: `Unblock ${pendingAction.isExpert ? "Expert" : "User"}?`,
        description: `The ${noun} will regain access to the platform.`,
        confirmText: "Unblock",
        type: "success",
      },
      promote: {
        title: `Promote ${pendingAction.isExpert ? "Expert" : "User"}?`,
        description: `This ${noun} will gain administrator access.`,
        confirmText: "Promote",
        type: "info",
      },
      demote: {
        title: `Demote ${pendingAction.isExpert ? "Expert Admin" : "Admin"}?`,
        description: `Administrator privileges will be removed from this ${noun}.`,
        confirmText: "Demote",
        type: "warning",
      },
    };

    return config[pendingAction.action];
  };

  useEffect(() => {
    if (!pendingAction) return;

    const config = getActionModalConfig();
    if (!config) {
      setPendingAction(null);
      return;
    }

    const actionPayload = { ...pendingAction };
    openConfirmModal({
      title: config.title,
      description: config.description,
      confirmText: config.confirmText,
      cancelText: "Cancel",
      type: config.type,
      onConfirm: () => executeConfirmedAction(actionPayload),
    });

    setPendingAction(null);
  }, [pendingAction, openConfirmModal]);

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
