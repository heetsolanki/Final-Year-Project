import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, X } from "lucide-react";

const AUTO_CLOSE_MS = 5000;

const ToastItem = ({ toast, onClose }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [remainingMs, setRemainingMs] = useState(AUTO_CLOSE_MS);

  useEffect(() => {
    if (isPaused) return undefined;

    const intervalId = setInterval(() => {
      setRemainingMs((prev) => {
        const next = Math.max(0, prev - 50);
        if (next === 0) {
          onClose(toast._id);
        }
        return next;
      });
    }, 50);

    return () => clearInterval(intervalId);
  }, [isPaused, onClose, toast._id]);

  const progress = Math.max(0, (remainingMs / AUTO_CLOSE_MS) * 100);

  return (
    <motion.div
      layout
      initial={{ x: 80, opacity: 0, scale: 0.95 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={{ y: -16, opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-[0_10px_30px_rgba(30,58,138,0.14)]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-start gap-3 p-4">
        <div className="rounded-lg bg-blue-50 p-2 text-blue-700">
          <Bell size={16} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[#1E3A8A]">{toast.title}</p>
          <p className="mt-0.5 text-sm text-gray-600 line-clamp-2">{toast.message}</p>
        </div>

        <button
          onClick={() => onClose(toast._id)}
          className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          aria-label="Close notification"
        >
          <X size={15} />
        </button>
      </div>

      <div className="h-1 w-full bg-blue-50">
        <motion.div
          className="h-full bg-[#1E3A8A]"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
};

const NotificationToast = ({ toasts = [], onClose }) => {
  const sortedToasts = useMemo(
    () => [...toasts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [toasts],
  );

  return (
    <div
      className="pointer-events-none fixed right-4 top-[6.5rem] flex w-full max-w-sm flex-col gap-3"
      style={{ zIndex: 4700 }}
    >
      <AnimatePresence mode="popLayout">
        {sortedToasts.map((toast) => (
          <div key={toast._id} className="pointer-events-auto">
            <ToastItem toast={toast} onClose={onClose} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationToast;
