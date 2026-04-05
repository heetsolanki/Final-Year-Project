import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";
import ReactDOM from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

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

  return ReactDOM.createPortal(
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.98 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="pointer-events-none fixed inset-x-0 top-[8.5rem] flex justify-center px-4"
          style={{ zIndex: "var(--toast-z)" }}
        >
          <div
            className={`pointer-events-auto flex items-center gap-3 px-5 py-3 sm:px-8 sm:py-4 rounded-xl shadow-lg
      w-fit max-w-[85vw] sm:max-w-md
      ${current.bg}`}
          >
            {current.icon}

            <span className={`text-sm sm:text-base font-medium ${current.text}`}>
              {message}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export default ToastPopup;
