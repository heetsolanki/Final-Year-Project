import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import API_URL from "../api";
import NotificationToast from "../components/ui/NotificationToast";

const NotificationCenterContext = createContext(null);

const MAX_TOASTS = 4;

export const NotificationCenterProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [latestNotifications, setLatestNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const socketRef = useRef(null);

  const token = localStorage.getItem("token");

  const authHeaders = useMemo(
    () => ({ headers: { Authorization: `Bearer ${token}` } }),
    [token],
  );

  const fetchUnreadCount = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_URL}/api/notifications/unread-count`, authHeaders);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (error) {
      console.error("Failed to fetch unread count", error);
    }
  }, [authHeaders, token]);

  const fetchLatest = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_URL}/api/notifications/latest?limit=5`, authHeaders);
      setLatestNotifications(res.data || []);
    } catch (error) {
      console.error("Failed to fetch latest notifications", error);
    }
  }, [authHeaders, token]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast._id !== id));
  }, []);

  const markNotificationAsRead = useCallback(
    async (notificationId) => {
      if (!token || !notificationId) return;
      try {
        await axios.patch(
          `${API_URL}/api/notifications/${notificationId}/read`,
          {},
          authHeaders,
        );

        setLatestNotifications((prev) =>
          prev.map((item) =>
            item._id === notificationId ? { ...item, isRead: true } : item,
          ),
        );

        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Failed to mark notification as read", error);
      }
    },
    [authHeaders, token],
  );

  const markAllAsRead = useCallback(async () => {
    if (!token) return;
    try {
      await axios.patch(`${API_URL}/api/notifications/mark-all-read`, {}, authHeaders);
      setUnreadCount(0);
      setLatestNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
    } catch (error) {
      console.error("Failed to mark all notifications as read", error);
    }
  }, [authHeaders, token]);

  useEffect(() => {
    if (!token) {
      setUnreadCount(0);
      setLatestNotifications([]);
      setToasts([]);
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    try {
      jwtDecode(token);
    } catch {
      return;
    }

    fetchUnreadCount();
    fetchLatest();

    socketRef.current = io(API_URL, {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current.on("notification:new", (notification) => {
      setLatestNotifications((prev) => [notification, ...prev].slice(0, 5));
      setUnreadCount((prev) => prev + 1);
      setToasts((prev) => [notification, ...prev].slice(0, MAX_TOASTS));
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [fetchLatest, fetchUnreadCount, token]);

  const value = useMemo(
    () => ({
      unreadCount,
      latestNotifications,
      fetchLatest,
      fetchUnreadCount,
      markNotificationAsRead,
      markAllAsRead,
    }),
    [fetchLatest, fetchUnreadCount, latestNotifications, markAllAsRead, markNotificationAsRead, unreadCount],
  );

  return (
    <NotificationCenterContext.Provider value={value}>
      {children}
      <NotificationToast toasts={toasts} onClose={removeToast} />
    </NotificationCenterContext.Provider>
  );
};

export const useNotificationCenter = () => {
  const context = useContext(NotificationCenterContext);
  if (!context) {
    throw new Error("useNotificationCenter must be used inside NotificationCenterProvider");
  }
  return context;
};
