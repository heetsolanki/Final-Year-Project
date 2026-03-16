import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 transition-opacity duration-200 ${
        exiting ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        className={`bg-white w-full max-w-[400px] rounded-2xl shadow-2xl p-6 sm:p-8 text-center transition-all duration-200 ${
          exiting ? "scale-95 opacity-0" : "scale-100 opacity-100 animate-fadeInScale"
        }`}
      >
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className={`${config.bg} p-4 rounded-full`}>
            <Icon className={`${config.text} w-8 h-8`} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
          {title}
        </h2>

        {/* Description */}
        <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-5 line-clamp-2">
          {desc}
        </p>

        {/* Countdown */}
        <p className="text-xs text-gray-400 mb-3">
          Closing in{" "}
          <span className="font-semibold text-[#C9A227]">{countdown}s</span>
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full ${config.progressBg} transition-all duration-[50ms] ease-linear`}
            style={{ width: `${Math.max(progress, 0)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default AlertPopup;
