import { useState } from "react";
import ChangePasswordModal from "./ChangePasswordModal";
import DeleteAccountModal from "./DeleteAccountModal";

const AccountSection = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div className="profile-section">
      {/* ===== ACCOUNT SETTINGS ===== */}
      <h3 className="profile-section-title">Account Settings</h3>

      <button
        onClick={() => setShowPasswordModal(true)}
        className="profile-btn"
      >
        Change Password
      </button>

      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}

      {/* ===== DANGER ZONE ===== */}
      <div className="mt-10 md:mt-12 border-t pt-6 md:pt-8">
        <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>

        <p className="text-xs md:text-sm text-gray-500 mt-2">
          Permanently delete your account and all associated legal queries. This
          action cannot be undone.
        </p>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="mt-6 bg-red-600 hover:bg-red-700 text-white px-5 md:px-6 py-2 text-sm md:text-base rounded-lg transition"
        >
          Delete Account
        </button>

        {showDeleteModal && (
          <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />
        )}
      </div>
    </div>
  );
};

export default AccountSection;
