import { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../../../api";
import { Bell, BellOff, Clock } from "lucide-react";

const AdminNotificationsTab = ({ refreshKey }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/admin/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [refreshKey]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-500 animate-pulse">
            Loading notifications...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 rounded-xl">
            <Bell size={20} className="text-amber-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Notifications
            </h2>
            <p className="text-xs text-gray-400">
              {notifications.filter((n) => !n.read).length} unread of{" "}
              {notifications.length} total
            </p>
          </div>
        </div>

        {/* Notifications List or Empty */}
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-gray-400">
            <BellOff size={36} className="mb-3 text-gray-300" />
            <p className="text-sm">No notifications</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n._id}
                className={`group bg-gray-50 border border-gray-100 p-4 rounded-xl hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all duration-200 ${
                  !n.read ? "border-l-4 border-l-[#C9A227]" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg shrink-0 group-hover:scale-105 transition-transform duration-200 ${
                      !n.read ? "bg-amber-50" : "bg-gray-100"
                    }`}
                  >
                    <Bell
                      size={16}
                      className={
                        !n.read ? "text-[#C9A227]" : "text-gray-400"
                      }
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800">{n.message}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex items-center gap-1">
                        <Clock size={12} className="text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {new Date(n.createdAt).toLocaleString()}
                        </span>
                      </div>
                      {!n.read && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
                          Unread
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotificationsTab;
