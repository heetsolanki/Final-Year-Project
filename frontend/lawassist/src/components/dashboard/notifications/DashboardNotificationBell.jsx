import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, ChevronRight } from "lucide-react";
import { useNotificationCenter } from "../../../context/NotificationCenterContext";

const getTimeLabel = (createdAt) => {
  const now = new Date();
  const value = new Date(createdAt);
  const seconds = Math.max(1, Math.floor((now - value) / 1000));

  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const DashboardNotificationBell = ({ onOpenNotifications }) => {
  const [isOpen, setIsOpen] = useState(false);
  const bellRef = useRef(null);
  const { unreadCount, latestNotifications, fetchLatest, markNotificationAsRead } =
    useNotificationCenter();

  const previewItems = useMemo(() => latestNotifications.slice(0, 5), [latestNotifications]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchLatest();
    }
  }, [fetchLatest, isOpen]);

  return (
    <div className="relative" ref={bellRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative rounded-lg border border-gray-200 bg-white p-2 text-gray-600 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-[#1E3A8A]"
        aria-label="Open notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -right-1.5 -top-1.5 inline-flex min-w-5 items-center justify-center rounded-full bg-[#C9A227] px-1.5 py-0.5 text-[10px] font-semibold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <p className="text-sm font-semibold text-[#1E3A8A]">Notifications</p>
            <span className="text-xs text-gray-500">{unreadCount} unread</span>
          </div>

          <div className="max-h-80 overflow-auto p-2">
            {previewItems.length === 0 ? (
              <p className="rounded-xl px-3 py-6 text-center text-sm text-gray-500">
                No notifications yet.
              </p>
            ) : (
              previewItems.map((item) => (
                <button
                  key={item._id}
                  className={`mb-1 w-full rounded-xl border px-3 py-2 text-left transition ${
                    item.isRead
                      ? "border-gray-100 bg-gray-50 hover:bg-gray-100"
                      : "border-blue-100 bg-blue-50/50 hover:bg-blue-50"
                  }`}
                  onClick={() => {
                    markNotificationAsRead(item._id);
                    onOpenNotifications();
                    setIsOpen(false);
                  }}
                >
                  <p className="truncate text-sm font-medium text-gray-800">{item.title}</p>
                  <p className="truncate text-xs text-gray-500">{item.message}</p>
                  <p className="mt-1 text-[11px] text-gray-400">{getTimeLabel(item.createdAt)}</p>
                </button>
              ))
            )}
          </div>

          <button
            className="flex w-full items-center justify-center gap-1 border-t border-gray-100 px-4 py-3 text-sm font-medium text-[#1E3A8A] transition hover:bg-blue-50"
            onClick={() => {
              onOpenNotifications();
              setIsOpen(false);
            }}
          >
            Open Notifications
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardNotificationBell;
