import axios from "axios";

const API = "https://law-assist.onrender.com/api";

const DeleteAccountModal = ({ onClose }) => {
  const token = localStorage.getItem("token");

  const handleDelete = async () => {
    try {
      await axios.delete(`${API}/users/delete-account`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem("token");
      window.location.href = "/";
    } catch {
      alert("Failed to delete account");
    }
  };

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal-box animate-fadeIn text-center">
        <h3 className="text-lg font-semibold text-red-600">Delete Account?</h3>

        <p className="text-gray-500 mt-3">
          This action is permanent. All your queries and data will be removed.
        </p>

        <div className="flex gap-4 mt-6">
          <button
            onClick={onClose}
            className="w-full border border-gray-300 rounded-lg py-2"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg py-2"
          >
            Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
