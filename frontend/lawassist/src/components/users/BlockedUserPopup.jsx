import { useEffect, useState } from "react";
import { ShieldOff, Trash2 } from "lucide-react";

const BlockedUserPopup = ({ onClose, reason = "blocked" }) => {
  const [countdown, setCountdown] = useState(5);

  const isDeleted = reason === "deleted";

  useEffect(() => {
    if (countdown <= 0) {
      // Force a full page reload so Navbar and all auth state reset cleanly
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
      window.location.href = "/login";
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  const Icon = isDeleted ? Trash2 : ShieldOff;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-8 shadow-xl max-w-md w-full mx-4 text-center space-y-5">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
          <Icon size={32} className="text-red-500" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800">
          {isDeleted ? "Account Deleted" : "Account Blocked"}
        </h2>

        {/* Message */}
        <p className="text-sm text-gray-500 leading-relaxed">
          {isDeleted
            ? "Your account has been deleted by the administrator. You will be redirected to the login page."
            : "Your account has been blocked by the administrator. Please contact support for assistance."}
        </p>

        {/* Countdown timer */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full border-2 border-red-200 flex items-center justify-center">
            <span className="text-lg font-bold text-red-500">{countdown}</span>
          </div>
          <p className="text-xs text-gray-400">
            Closing in {countdown} second{countdown !== 1 ? "s" : ""}...
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlockedUserPopup;
