import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../api";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  FileSearch,
  Activity,
  ChartNoAxesCombined,
  LogOut,
} from "lucide-react";

import AdminLayout from "../components/dashboard/admin/AdminLayout";
import AdminOverviewTab from "../components/dashboard/admin/OverviewTab";
import AdminUsersTab from "../components/dashboard/admin/UsersTab";
import AdminExpertsTab from "../components/dashboard/admin/ExpertsTab";
import AdminQueriesTab from "../components/dashboard/admin/QueriesTab";
import AdminLogsTab from "../components/dashboard/admin/LogsTab";
import AdminAnalytics from "../components/admin/analytics/AdminAnalytics";
import ToastPopup from "../components/ui/ToastPopup";

const ADMIN_TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "users", label: "All Users", icon: Users },
  { id: "experts", label: "Experts", icon: ShieldCheck },
  { id: "queries", label: "Query Moderation", icon: FileSearch },
  { id: "logs", label: "Activity Logs", icon: Activity },
  { id: "analytics", label: "Analytics", icon: ChartNoAxesCombined },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshKey] = useState(0);
  const [showLogoutToast] = useState(false);
  const [isMasterAdmin, setIsMasterAdmin] = useState(false);
  const [switchRoute, setSwitchRoute] = useState("/user-dashboard");
  const [switchLabel, setSwitchLabel] = useState("Back to Dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const verifyAdminRole = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/auth/check-status`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setIsMasterAdmin(Boolean(res.data.isMasterAdmin));

        // If user was demoted, logout and redirect
        if (res.data.role && res.data.role !== "admin") {
          localStorage.removeItem("token");
          localStorage.removeItem("name");
          localStorage.removeItem("email");
          localStorage.removeItem("role");
          sessionStorage.setItem("showLogoutToast", "true");
          navigate("/");
          return;
        }

        // If user is blocked, logout
        if (res.data.status === "blocked") {
          localStorage.removeItem("token");
          localStorage.removeItem("name");
          localStorage.removeItem("email");
          localStorage.removeItem("role");
          sessionStorage.setItem("showLogoutToast", "true");
          navigate("/");
          return;
        }
      } catch (err) {
        // Token error or user deleted - logout
        if (err.response?.status === 401 || err.response?.status === 404) {
          localStorage.removeItem("token");
          localStorage.removeItem("name");
          localStorage.removeItem("email");
          localStorage.removeItem("role");
          navigate("/");
        }
      }
    };

    const interval = setInterval(() => {
      verifyAdminRole();
    }, 60000);

    // Initial verification
    verifyAdminRole();

    const resolveSwitchTarget = async () => {
      try {
        await axios.get(`${API_URL}/api/expert/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSwitchRoute("/legal-expert-dashboard");
        setSwitchLabel("Back to Dashboard");
      } catch {
        setSwitchRoute("/user-dashboard");
        setSwitchLabel("Back to Dashboard");
      }
    };

    resolveSwitchTarget();

    return () => clearInterval(interval);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    sessionStorage.setItem("showLogoutToast", "true");
    navigate("/");
  };

  const renderTab = () => {
    switch (activeTab) {
      case "overview":
        return <AdminOverviewTab refreshKey={refreshKey} />;
      case "users":
        return <AdminUsersTab refreshKey={refreshKey} />;
      case "experts":
        return <AdminExpertsTab refreshKey={refreshKey} />;
      case "queries":
        return <AdminQueriesTab refreshKey={refreshKey} />;
      case "logs":
        return <AdminLogsTab refreshKey={refreshKey} />;
      case "analytics":
        return <AdminAnalytics refreshKey={refreshKey} />;
      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col-reverse md:flex-row gap-6 max-w-7xl mx-auto min-h-[calc(100vh-5rem)]">
        {/* Main Content */}
        <div className="flex-1 min-w-0">{renderTab()}</div>

        {/* Right Tab Menu */}
        <div className="w-full md:w-64 shrink-0 md:sticky md:top-10 h-fit">
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-3 space-y-1">
            {/* Menu Heading */}
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 pt-2 pb-3">
              Admin Menu
            </p>

            {ADMIN_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#0A1F44] text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-0.5"
                  }`}
                >
                  <Icon
                    size={18}
                    className={`shrink-0 transition-all duration-200 ${
                      isActive
                        ? "text-[#C9A227]"
                        : "text-gray-400 group-hover:text-gray-600 group-hover:scale-110"
                    }`}
                  />
                  {tab.label}
                </button>
              );
            })}

            {/* Divider */}
            <div className="px-3 py-2">
              <div className="h-px bg-gray-100" />
            </div>

            {/* Logout Button */}
            <button
              onClick={() => navigate("/")}
              className="group flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:translate-x-0.5 transition-all duration-200"
            >
              Back to Home
            </button>

            {!isMasterAdmin && (
              <button
                onClick={() => navigate(switchRoute)}
                className="group flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 hover:translate-x-0.5 transition-all duration-200"
              >
                {switchLabel}
              </button>
            )}

            <button
              onClick={handleLogout}
              className="group flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 hover:translate-x-0.5 transition-all duration-200"
            >
              <LogOut
                size={18}
                className="shrink-0 text-red-400 group-hover:text-red-500 group-hover:scale-110 transition-all duration-200"
              />
              Logout
            </button>
          </div>
        </div>
      </div>
      <ToastPopup show={showLogoutToast} message="Logout Successful" type="success" />
    </AdminLayout>
  );
};

export default AdminDashboard;
