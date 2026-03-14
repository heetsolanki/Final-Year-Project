import { useState } from "react";
import ChangePasswordModal from "./ChangePasswordModal";
import DeleteAccountModal from "./DeleteAccountModal";

const AccountSection = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
          onClick={() => setShowDeleteModal(true)}
          className="mt-5 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
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
