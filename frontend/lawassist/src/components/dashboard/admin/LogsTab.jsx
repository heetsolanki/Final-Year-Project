import { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../../../api";
import {
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  Ban,
  Unlock,
  Trash2,
  FileCheck,
  FileX,
  Search,
} from "lucide-react";

const ACTION_CONFIG = {
  "Expert verified": {
    icon: CheckCircle,
    bg: "bg-white",
    border: "border-gray-200",
    iconColor: "text-green-600",
    badge: "bg-green-100 text-green-700",
  },
  "Expert rejected": {
    icon: XCircle,
    bg: "bg-white",
    border: "border-gray-200",
    iconColor: "text-red-600",
    badge: "bg-red-100 text-red-700",
  },
  "Expert blocked": {
    icon: Ban,
    bg: "bg-white",
    border: "border-gray-200",
    iconColor: "text-gray-600",
    badge: "bg-gray-100 text-gray-700",
  },
  "Expert unblocked": {
    icon: Unlock,
    bg: "bg-white",
    border: "border-gray-200",
    iconColor: "text-emerald-600",
    badge: "bg-emerald-100 text-emerald-700",
  },
  "Query approved": {
    icon: FileCheck,
    bg: "bg-white",
    border: "border-gray-200",
    iconColor: "text-blue-600",
    badge: "bg-blue-100 text-blue-700",
  },
  "Query rejected": {
    icon: FileX,
    bg: "bg-white",
    border: "border-gray-200",
    iconColor: "text-orange-600",
    badge: "bg-orange-100 text-orange-700",
  },
  "User deleted": {
    icon: Trash2,
    bg: "bg-white",
    border: "border-gray-200",
    iconColor: "text-red-500",
    badge: "bg-red-100 text-red-600",
  },
  "User deleted (expert)": {
    icon: Trash2,
    bg: "bg-white",
    border: "border-gray-200",
    iconColor: "text-red-500",
    badge: "bg-red-100 text-red-600",
  },
};

const DEFAULT_CONFIG = {
  icon: Activity,
  bg: "bg-white",
  border: "border-gray-200",
  iconColor: "text-indigo-600",
  badge: "bg-indigo-100 text-indigo-700",
};

const getConfig = (action) => ACTION_CONFIG[action] || DEFAULT_CONFIG;

const AdminLogsTab = ({ refreshKey }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("All");

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/admin/activity`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(res.data);
    } catch (err) {
      console.error("Failed to fetch activity logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [refreshKey]);

  const actionTypes = ["All", ...Object.keys(ACTION_CONFIG)];

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.performedBy || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.targetId || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterAction === "All" || log.action === filterAction;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-500 animate-pulse">
            Loading activity logs...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 rounded-xl">
            <Activity size={20} className="text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Activity Logs
            </h2>
            <p className="text-xs text-gray-400">
              {filteredLogs.length} of {logs.length}{" "}
              {logs.length === 1 ? "entry" : "entries"}
            </p>
            </div>
          </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3.5 py-2.5 bg-gray-50 hover:bg-white hover:border-gray-300 focus-within:bg-white focus-within:border-blue-300 focus-within:shadow-sm transition-all duration-200 w-full sm:max-w-sm">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="outline-none w-full text-sm bg-transparent placeholder-gray-400"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {actionTypes.map((type) => {
            const config = type === "All" ? DEFAULT_CONFIG : getConfig(type);
            const isActive = filterAction === type;
            return (
              <button
                key={type}
                onClick={() => setFilterAction(type)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                  isActive
                    ? `${config.badge} border-current shadow-sm`
                    : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>

        {/* Logs Grid or Empty */}
        {filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-gray-400">
            <Activity size={36} className="mb-3 text-gray-300" />
            <p className="text-sm">
              {logs.length === 0
                ? "No activity logs yet"
                : "No logs match your filters"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLogs.map((log) => {
              const config = getConfig(log.action);
              const Icon = config.icon;

              return (
                <div
                  key={log._id}
                  className={`group ${config.bg} border ${config.border} rounded-xl p-4 hover:shadow-sm transition-all duration-200`}
                >
                  <div className="flex items-start gap-3">
                    {/* Action Icon */}
                    <div
                      className={`p-2 rounded-lg shrink-0 group-hover:scale-105 transition-transform duration-200 bg-white/70`}
                    >
                      <Icon size={16} className={config.iconColor} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.badge}`}
                        >
                          {log.action}
                        </span>
                        {log.targetId && (
                          <span className="text-xs text-gray-400 font-mono truncate max-w-[180px]">
                            ID: {log.targetId}
                          </span>
                        )}
                      </div>

                      {/* Details */}
                      {log.details && log.details.reason && (
                        <p className="text-xs text-gray-500 mt-1">
                          Reason: {log.details.reason}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <div className="flex items-center gap-1">
                          <Clock size={12} className="text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {new Date(log.createdAt).toLocaleString()}
                          </span>
                        </div>
                        {log.performedBy && (
                          <span className="text-xs text-gray-400">
                            by{" "}
                            <span className="font-medium text-gray-500">
                              {log.performedBy}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLogsTab;
