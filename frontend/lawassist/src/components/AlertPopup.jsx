import { CheckCircle } from "lucide-react";

function AlertPopup({ show, title, message, buttonText = "OK", onClose, showButton = true }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 sm:p-7 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle className="text-green-600 w-7 h-7 sm:w-8 sm:h-8" />
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
      </div>
    </div>
  );
}

export default AlertPopup;
