import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

const typeConfig = {
  success: {
    icon: CheckCircle,
    bg: "bg-green-100",
    text: "text-green-600",
    progressBg: "bg-green-500",
  },
  error: {
    icon: XCircle,
    bg: "bg-red-100",
    text: "text-red-600",
    progressBg: "bg-red-500",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-100",
    text: "text-amber-600",
    progressBg: "bg-amber-500",
  },
  info: {
    icon: Info,
    bg: "bg-blue-100",
    text: "text-blue-600",
    progressBg: "bg-blue-500",
  },
};

function AlertPopup({
  type = "success",
  title,
  description,
  redirectTo,
  duration = 3,
  onClose,

  // Legacy prop support (backward-compatible)
  show,
  message,
}) {
  const navigate = useNavigate();
  const desc = description || message || "";
  const [countdown, setCountdown] = useState(duration);
  const [progress, setProgress] = useState(100);
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  const handleClose = useCallback(() => {
    setExiting(true);
    setTimeout(() => {
      setVisible(false);
      if (redirectTo) {
        navigate(redirectTo);
      }
      if (onClose) {
        onClose();
      }
    }, 200);
  }, [redirectTo, navigate, onClose]);

  // Countdown timer — ticks every second
  useEffect(() => {
    if (!visible || exiting) return;

    if (countdown <= 0) {
      handleClose();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, visible, exiting, handleClose]);

  // Smooth progress bar — updates every 50ms
  useEffect(() => {
    if (!visible || exiting) return;

    const totalMs = duration * 1000;
    const intervalMs = 50;
    const step = (intervalMs / totalMs) * 100;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev - step;
        return next < 0 ? 0 : next;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [duration, visible, exiting]);

  // Reset state when `show` toggles (legacy usage)
  useEffect(() => {
    if (show === false) {
      setVisible(false);
      return;
    }
    if (show === true) {
      setCountdown(duration);
      setProgress(100);
      setExiting(false);
      setVisible(true);
    }
  }, [show, duration]);

  if (!visible) return null;

  const config = typeConfig[type] || typeConfig.success;
  const Icon = config.icon;

  return (
    ReactDOM.createPortal(
      <div
        className={`fixed left-1/2 top-24 -translate-x-1/2 w-[92vw] max-w-md transition-all duration-200 ${
          exiting ? "opacity-0 -translate-y-2" : "opacity-100 translate-y-0"
        }`}
        style={{ zIndex: "var(--toast-z)" }}
      >
        <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_16px_34px_rgba(15,23,42,0.14)] p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className={`${config.bg} p-2.5 rounded-full shrink-0`}>
              <Icon className={`${config.text} w-5 h-5`} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm sm:text-base font-semibold text-gray-800 truncate">{title}</h2>
              <p className="text-gray-500 text-sm leading-relaxed mt-0.5 line-clamp-2">{desc}</p>
              <p className="text-xs text-gray-400 mt-2">
                Closing in <span className="font-semibold text-[#C9A227]">{countdown}s</span>
              </p>
            </div>
          </div>

          <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full ${config.progressBg} transition-all duration-[50ms] ease-linear`}
              style={{ width: `${Math.max(progress, 0)}%` }}
            />
          </div>
        </div>
      </div>,
      document.body
    )
  );
}

export default AlertPopup;
