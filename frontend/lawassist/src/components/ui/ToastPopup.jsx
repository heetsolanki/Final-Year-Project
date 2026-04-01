import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";
import ReactDOM from "react-dom";

function ToastPopup({ show, message, type = "success" }) {
  const styles = {
    success: {
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      bg: "bg-green-50",
      text: "text-green-800",
    },
    remove: {
      icon: <XCircle className="w-5 h-5 text-red-600" />,
      bg: "bg-red-50",
      text: "text-red-800",
    },
    error: {
      icon: <AlertCircle className="w-5 h-5 text-red-600" />,
      bg: "bg-red-50",
      text: "text-red-800",
    },
    info: {
      icon: <Info className="w-5 h-5 text-blue-600" />,
      bg: "bg-blue-50",
      text: "text-blue-800",
    },
  };

  const current = styles[type];

  if (!show) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/35 backdrop-blur-sm p-4"
      style={{ zIndex: "var(--modal-z)" }}
    >
      <div
        className={`flex items-center gap-3 px-5 py-3 sm:px-8 sm:py-4 rounded-xl shadow-lg backdrop-blur-md
    w-fit max-w-[85vw] sm:max-w-md mx-auto
    ${current.bg}`}
      >
        {current.icon}

        <span className={`text-sm sm:text-base font-medium ${current.text}`}>
          {message}
        </span>
      </div>
    </div>,
    document.body,
  );
}

export default ToastPopup;
