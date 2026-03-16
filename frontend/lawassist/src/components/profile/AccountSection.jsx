import { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import ChangePasswordModal from "./ChangePasswordModal";
import API_URL from "../../api";
import AlertPopup from "../ui/AlertPopup";
import { useConfirmModal } from "../../context/ConfirmModalContext";

const AccountSection = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [error, setError] = useState(null);
  const { openConfirmModal } = useConfirmModal();

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      let endpoint = `${API_URL}/api/users/delete-account`;

      try {
        const decoded = jwtDecode(token);
        if (decoded.role === "legalExpert") {
          endpoint = `${API_URL}/api/expert/delete-account`;
        }
      } catch {
        // Fallback to consumer endpoint when token decoding fails
      }

      await axios.delete(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem("token");
      window.location.href = "/";
    } catch {
      setError("Failed to delete account. Please try again.");
    }
  };

  const requestDeleteAccount = () => {
    openConfirmModal({
      title: "Delete Account?",
      description: "This action is permanent. All your data and queries will be removed.",
      confirmText: "Delete Permanently",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: handleDeleteAccount,
    });
  };

  return (
    <div className="mt-10 space-y-8">
      {/* ===== ACCOUNT SETTINGS CARD ===== */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
        <h3 className="text-lg font-semibold text-gray-800">
          Account Settings
        </h3>

        <p className="text-sm text-gray-500 mt-2 mb-5">
          Manage your account security and password settings.
        </p>

        <button
          onClick={() => setShowPasswordModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Change Password
        </button>

        {showPasswordModal && (
          <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
        )}
      </div>

      {/* ===== DANGER ZONE CARD ===== */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
        <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>

        <p className="text-sm text-gray-600 mt-2 max-w-2xl">
          Permanently delete your account and all associated legal queries. This action cannot be undone.
        </p>

        <button
          onClick={requestDeleteAccount}
          className="mt-5 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Delete Account
        </button>
      </div>

      <AlertPopup
        show={!!error}
        title="Error"
        message={error || ""}
        type="error"
        onClose={() => setError(null)}
      />
    </div>
  );
};

export default AccountSection;
