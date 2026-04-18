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
  Menu,
  X,
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
  const [refreshKey, setRefreshKey] = useState(0);
  const [showLogoutToast] = useState(false);
  const [isMasterAdmin, setIsMasterAdmin] = useState(false);
  const [switchRoute, setSwitchRoute] = useState("/user-dashboard");
  const [switchLabel, setSwitchLabel] = useState("Back to Dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [shouldRenderMobileMenu, setShouldRenderMobileMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      setRefreshKey((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(refreshInterval);
  }, []);

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

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [activeTab]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      setShouldRenderMobileMenu(true);
      return;
    }

    const timer = setTimeout(() => {
      setShouldRenderMobileMenu(false);
    }, 280);

    return () => clearTimeout(timer);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!shouldRenderMobileMenu) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : originalOverflow;

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMobileMenuOpen, shouldRenderMobileMenu]);

  useEffect(() => {
    if (!shouldRenderMobileMenu) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [shouldRenderMobileMenu]);

  const activeTabLabel = ADMIN_TABS.find((tab) => tab.id === activeTab)?.label || "Overview";

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
      <div className="md:hidden mb-4">
        <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 shadow-sm px-4 py-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-400">Admin Menu</p>
            <p className="text-sm font-semibold text-gray-800">{activeTabLabel}</p>
          </div>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all duration-300 active:scale-95"
            aria-label={isMobileMenuOpen ? "Close admin menu" : "Open admin menu"}
            aria-expanded={isMobileMenuOpen}
          >
            <span
              className={`absolute transition-all duration-300 ${
                isMobileMenuOpen ? "opacity-0 scale-75 rotate-45" : "opacity-100 scale-100 rotate-0"
              }`}
            >
              <Menu size={18} />
            </span>
            <span
              className={`absolute transition-all duration-300 ${
                isMobileMenuOpen ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-75 -rotate-45"
              }`}
            >
              <X size={18} />
            </span>
          </button>
        </div>
      </div>

      {shouldRenderMobileMenu && (
        <div
          className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          role="dialog"
          aria-modal="true"
          aria-hidden={!isMobileMenuOpen}
        >
          <button
            type="button"
            className={`absolute inset-0 bg-black/35 backdrop-blur-[2px] transition-all duration-300 ${
              isMobileMenuOpen ? "opacity-100" : "opacity-0 backdrop-blur-0"
            }`}
            aria-label="Close admin menu overlay"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div
            className={`absolute top-0 right-0 h-full w-[84%] max-w-xs bg-white shadow-xl border-l border-gray-200 p-3 space-y-1 overflow-y-auto transition-all duration-300 ease-out ${
              isMobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-90"
            }`}
          >
            <div className="flex items-center justify-between px-2 py-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Admin Menu</p>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:bg-gray-100 transition-all duration-200 active:scale-95"
                aria-label="Close admin menu"
              >
                <X size={16} />
              </button>
            </div>

            {ADMIN_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const tabIndex = ADMIN_TABS.findIndex((t) => t.id === tab.id);

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{ transitionDelay: `${tabIndex * 28}ms` }}
                  className={`group flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-[#0A1F44] text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } ${
                    isMobileMenuOpen
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-2"
                  }`}
                >
                  <Icon
                    size={18}
                    className={`shrink-0 transition-all duration-200 ${
                      isActive ? "text-[#C9A227]" : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  />
                  {tab.label}
                </button>
              );
            })}

            <div className="px-3 py-2">
              <div className="h-px bg-gray-100" />
            </div>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate("/");
              }}
              className={`group flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 ${
                isMobileMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
              }`}
              style={{ transitionDelay: "160ms" }}
            >
              Back to Home
            </button>

            {!isMasterAdmin && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate(switchRoute);
                }}
                className={`group flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-300 ${
                  isMobileMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
                }`}
                style={{ transitionDelay: "190ms" }}
              >
                {switchLabel}
              </button>
            )}

            <button
              onClick={handleLogout}
              className={`group flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300 ${
                isMobileMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
              }`}
              style={{ transitionDelay: "220ms" }}
            >
              <LogOut
                size={18}
                className="shrink-0 text-red-400 group-hover:text-red-500 transition-all duration-200"
              />
              Logout
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col-reverse md:flex-row gap-4 md:gap-6 max-w-7xl mx-auto min-h-[calc(100vh-5rem)]">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div key={activeTab} className="animate-[fadeIn_260ms_var(--ui-smooth)]">
            {renderTab()}
          </div>
        </div>

        {/* Right Tab Menu */}
        <div className="hidden md:block w-full md:w-64 shrink-0 md:sticky md:top-10 h-fit">
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
