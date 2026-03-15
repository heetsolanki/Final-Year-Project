import { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../../../api";
import { Bell, BellOff, Clock } from "lucide-react";
import DashboardCard from "../DashboardCard";

const ExpertNotificationsTab = ({ refreshKey }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/expert/notifications`, {
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
      <DashboardCard title="Notifications" icon={Bell}>
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Notifications" icon={Bell}>
      <p className="text-xs text-gray-400 -mt-3 mb-4">
        {notifications.filter((n) => !n.read).length} unread of{" "}
        {notifications.length} total
      </p>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-gray-400">
          <BellOff size={32} className="mb-2 text-gray-300" />
          <p className="text-sm">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`flex items-start gap-3 p-3 rounded-xl border transition ${
                !n.read
                  ? "border-l-4 border-l-[#C9A227] bg-amber-50/50 border-amber-100"
                  : "bg-gray-50 border-gray-100"
              }`}
            >
              <div
                className={`p-1.5 rounded-lg shrink-0 ${
                  !n.read ? "bg-amber-100" : "bg-gray-100"
                }`}
              >
                <Bell
                  size={14}
                  className={!n.read ? "text-[#C9A227]" : "text-gray-400"}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800">{n.message}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Clock size={11} className="text-gray-400" />
                  <span className="text-xs text-gray-400">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                  {!n.read && (
                    <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-[#C9A227]/10 text-[#C9A227]">
                      New
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
};

export default ExpertNotificationsTab;
