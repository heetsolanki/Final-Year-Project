import { useState } from "react";
import axios from "axios";
import API_URL from "../../api";
import { jwtDecode } from "jwt-decode";
import AlertPopup from "../ui/AlertPopup";

const DeleteAccountModal = ({ onClose }) => {
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      setError(null);
      const token = localStorage.getItem("token");

      // Determine the correct endpoint based on role
      let endpoint = `${API_URL}/api/users/delete-account`;
      try {
        const decoded = jwtDecode(token);
        if (decoded.role === "legalExpert") {
          endpoint = `${API_URL}/api/expert/delete-account`;
        }
      } catch {
        // If decode fails, use default consumer endpoint
      }

      await axios.delete(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem("token");
      window.location.href = "/";
    } catch {
      setDeleting(false);
      setError("Failed to delete account. Please try again.");
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 md:p-8 text-center animate-fadeIn">
          <h3 className="text-lg font-semibold text-red-600">Delete Account?</h3>

          <p className="text-gray-500 mt-3">
            This action is permanent. All your queries and data will be removed.
          </p>

          <div className="flex gap-4 mt-6">
            <button
              onClick={onClose}
              className="w-full border border-gray-300 rounded-lg py-2"
              disabled={deleting}
            >
              Cancel
            </button>

            <button
              onClick={handleDelete}
              className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg py-2 disabled:opacity-50"
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Permanently"}
            </button>
          </div>
        </div>
      </div>

      <AlertPopup
        show={!!error}
        title="Error"
        message={error || ""}
        type="error"
        onClose={() => setError(null)}
      />
    </>
  );
};

export default DeleteAccountModal;
