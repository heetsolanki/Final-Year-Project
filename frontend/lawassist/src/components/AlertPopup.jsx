import { CheckCircle } from "lucide-react";

function AlertPopup({ show, message, onClose, title }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white w-[380px] rounded-2xl shadow-2xl p-7 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle className="text-green-600 w-8 h-8" />
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>

        <p className="text-gray-600 mb-6 text-sm text-center">{message}</p>

        <button
          onClick={onClose}
          className="bg-[#C9A227] text-white px-6 py-2.5 rounded-lg font-medium hover:scale-105 transition"
        >
          OK
        </button>
      </div>
    </div>
  );
}

export default AlertPopup;
