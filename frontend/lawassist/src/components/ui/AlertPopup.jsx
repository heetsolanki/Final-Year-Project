import { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

const typeConfig = {
  success: {
    icon: CheckCircle,
    bg: "bg-green-100",
    text: "text-green-600",
  },
  error: {
    icon: XCircle,
    bg: "bg-red-100",
    text: "text-red-600",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-yellow-100",
    text: "text-yellow-600",
  },
  info: {
    icon: Info,
    bg: "bg-blue-100",
    text: "text-blue-600",
  },
};

function AlertPopup({ show, title, message, buttonText = "OK", onClose, showButton = false, type = "success" }) {
  const [progress, setProgress] = useState(100);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!show) {
      setProgress(100);
      setCountdown(5);
      return;
    }

    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - 2;
        return newProgress < 0 ? 0 : newProgress;
      });
      setCountdown((prev) => {
        const newCountdown = prev - 0.1;
        return newCountdown < 0 ? 0 : newCountdown;
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [show, onClose]);

  if (!show) return null;

  const config = typeConfig[type] || typeConfig.success;
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 sm:p-7 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className={`${config.bg} p-3 rounded-full`}>
            <Icon className={`${config.text} w-7 h-7 sm:w-8 sm:h-8`} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
          {title}
        </h2>

        {/* Message */}
        <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed">
          {message}
        </p>

        {/* Optional Button */}
        {showButton && (
          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-[#C9A227] text-white px-6 py-2.5 rounded-lg font-medium hover:scale-105 transition-all duration-200"
          >
            {buttonText}
          </button>
        )}

        {/* Auto-close countdown and progress bar */}
        <div className="mt-6 space-y-3">
          {/* Countdown text */}
          <div className="text-center">
            <span className="text-xs text-gray-500">
              Closing in <span className="font-semibold text-[#C9A227]">{Math.ceil(countdown)}</span>s
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
            <div
              className="h-1 rounded-full bg-[#C9A227] transition-all duration-100 ease-linear"
              style={{ width: `${Math.max(progress, 0)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlertPopup;
