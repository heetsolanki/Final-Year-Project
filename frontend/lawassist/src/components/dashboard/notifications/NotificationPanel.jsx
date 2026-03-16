import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Bell, BellOff, CheckCheck, Clock4, Filter, Info } from "lucide-react";
import API_URL from "../../../api";
import DashboardCard from "../DashboardCard";
import { useNotificationCenter } from "../../../context/NotificationCenterContext";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "queries", label: "Queries" },
  { id: "consultations", label: "Consultations" },
  { id: "system", label: "System" },
];

const getTypeIcon = (type) => {
  if (["QUERY_POSTED", "QUERY_ACCEPTED", "QUERY_REJECTED"].includes(type)) {
    return Bell;
  }
  if (type === "CONSULTATION_BOOKED") {
    return Info;
  }
  return Clock4;
};

const getTimeLabel = (createdAt) => {
  const now = new Date();
  const value = new Date(createdAt);
  const seconds = Math.max(1, Math.floor((now - value) / 1000));

  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
};

const NotificationPanel = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const { fetchUnreadCount, fetchLatest, markAllAsRead, markNotificationAsRead } =
    useNotificationCenter();

  const fetchPage = useCallback(
    async ({ pageNumber = 1, append = false, filter = activeFilter }) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        if (!append) {
          setLoading(true);
        }

        const res = await axios.get(
          `${API_URL}/api/notifications?filter=${filter}&page=${pageNumber}&limit=10`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setItems((prev) => (append ? [...prev, ...res.data.items] : res.data.items));
        setHasMore(Boolean(res.data.hasMore));
        setPage(pageNumber);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      } finally {
        setLoading(false);
      }
    },
    [activeFilter],
  );

  useEffect(() => {
    const bootstrap = async () => {
      await markAllAsRead();
      await fetchPage({ pageNumber: 1, append: false, filter: activeFilter });
      fetchUnreadCount();
      fetchLatest();
    };

    bootstrap();
  }, [activeFilter, fetchLatest, fetchPage, fetchUnreadCount, markAllAsRead]);

  const unreadCount = useMemo(() => items.filter((item) => !item.isRead).length, [items]);

  return (
    <DashboardCard title="Notifications" icon={Bell}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Filter size={14} />
          <span>{unreadCount} unread</span>
        </div>
        <button
          onClick={async () => {
            await markAllAsRead();
            setItems((prev) => prev.map((item) => ({ ...item, isRead: true })));
          }}
          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#1E3A8A]"
        >
          <CheckCheck size={14} />
          Mark all as read
        </button>
      </div>

      <div className="mb-5 border-b border-gray-200">
        <div className="flex gap-6 overflow-x-auto whitespace-nowrap px-1 pb-2">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`relative pb-3 text-sm font-medium transition-colors duration-200 ${
                activeFilter === filter.id
                  ? "text-[#1E3A8A]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {filter.label}
              <span
                className={`absolute left-0 bottom-0 h-[2px] w-full bg-[#1E3A8A] transform transition-transform duration-300 ${
                  activeFilter === filter.id ? "scale-x-100" : "scale-x-0"
                } origin-left`}
              />
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-amber-200 border-t-amber-600" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-gray-400">
          <BellOff size={32} className="mb-2 text-gray-300" />
          <p className="text-sm">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const Icon = getTypeIcon(item.type);
            return (
              <div
                key={item._id}
                className={`flex items-start gap-3 rounded-xl border p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                  item.isRead
                    ? "border-gray-200 bg-gray-50"
                    : "border-blue-100 bg-blue-50/40"
                }`}
              >
                <div
                  className={`rounded-lg p-2 ${item.isRead ? "bg-gray-100" : "bg-blue-100"}`}
                >
                  <Icon
                    size={15}
                    className={item.isRead ? "text-gray-500" : "text-[#1E3A8A]"}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-800">{item.title}</p>
                  <p className="mt-1 text-sm text-gray-600">{item.message}</p>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="text-xs text-gray-400">{getTimeLabel(item.createdAt)}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        item.isRead
                          ? "bg-gray-200 text-gray-600"
                          : "bg-[#C9A227]/10 text-[#C9A227]"
                      }`}
                    >
                      {item.isRead ? "SEEN" : "NEW"}
                    </span>
                  </div>
                </div>

                {!item.isRead && (
                  <button
                    onClick={async () => {
                      await markNotificationAsRead(item._id);
                      setItems((prev) =>
                        prev.map((current) =>
                          current._id === item._id
                            ? { ...current, isRead: true }
                            : current,
                        ),
                      );
                    }}
                    className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#1E3A8A]"
                  >
                    Mark read
                  </button>
                )}
              </div>
            );
          })}

          {hasMore && (
            <button
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#1E3A8A]"
              onClick={() => fetchPage({ pageNumber: page + 1, append: true, filter: activeFilter })}
            >
              Load more
            </button>
          )}
        </div>
      )}
    </DashboardCard>
  );
};

export default NotificationPanel;
