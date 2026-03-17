import { useEffect } from "react";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";
import { AlertTriangle, Ban, CheckCircle2, ShieldAlert, Trash2 } from "lucide-react";

const typeConfig = {
  danger: {
    iconBg: "bg-red-100",
    iconText: "text-red-600",
    confirmButton: "bg-red-600 text-white hover:bg-red-700",
    defaultIcon: Trash2,
  },
  warning: {
    iconBg: "bg-amber-100",
    iconText: "text-amber-600",
    confirmButton: "bg-amber-500 text-white hover:bg-amber-600",
    defaultIcon: AlertTriangle,
  },
  info: {
    iconBg: "bg-blue-100",
    iconText: "text-blue-600",
    confirmButton: "bg-blue-600 text-white hover:bg-blue-700",
    defaultIcon: ShieldAlert,
  },
  success: {
    iconBg: "bg-green-100",
    iconText: "text-green-600",
    confirmButton: "bg-green-600 text-white hover:bg-green-700",
    defaultIcon: CheckCircle2,
  },
  block: {
    iconBg: "bg-red-100",
    iconText: "text-red-600",
    confirmButton: "bg-red-600 text-white hover:bg-red-700",
    defaultIcon: Ban,
  },
};

const ConfirmModal = ({
  title,
  description,
  icon: Icon,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  type = "danger",
  children = null,
  confirmDisabled = false,
  isLoading = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onCancel?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  const config = typeConfig[type] || typeConfig.danger;
  const ModalIcon = Icon || config.defaultIcon;

  return ReactDOM.createPortal(
    <div
      className="global-modal-overlay"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="global-modal-panel w-full max-w-md p-6 text-center"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="text-center">
          <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${config.iconBg} ${config.iconText}`}>
            <ModalIcon size={24} />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-gray-900">{title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">{description}</p>

          {children ? <div className="mt-4 text-left">{children}</div> : null}

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              disabled={isLoading}
            >
              {cancelText}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={confirmDisabled || isLoading}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${config.confirmButton}`}
            >
              {isLoading ? "Please wait..." : confirmText}
            </button>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

export default ConfirmModal;
