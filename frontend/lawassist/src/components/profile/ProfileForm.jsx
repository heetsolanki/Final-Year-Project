import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../../api";
import SuccessModal from "../ui/SuccessModal";

const ProfileForm = ({ user, refresh }) => {
  const [formData, setFormData] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    await axios.put(`${API_URL}/api/users/profile`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    refresh();
    setShowSuccess(true);
  };

  return (
    <div className="space-y-8">
      {/* PERSONAL INFO */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            placeholder="Full Name"
            className="profile-input"
          />

          <input
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            placeholder="Phone Number"
            className="profile-input"
          />
        </div>
      </div>

      {/* LOCATION */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Location Details</h3>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            name="city"
            value={formData.city || ""}
            onChange={handleChange}
            placeholder="City"
            className="profile-input"
          />

          <input
            name="state"
            value={formData.state || ""}
            onChange={handleChange}
            placeholder="State"
            className="profile-input"
          />
        </div>
      </div>

      {/* ACCOUNT INFO */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Account Information</h3>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            value={user.email}
            disabled
            className="profile-input bg-gray-100 cursor-not-allowed"
          />

          <input
            value={user.role === "legalExpert" ? "Legal Expert" : "Consumer"}
            disabled
            className="profile-input bg-gray-100 cursor-not-allowed"
          />
        </div>
      </div>

      {/* SAVE BUTTON */}
      <button onClick={handleUpdate} className="profile-btn">
        Save Changes
      </button>

      {showSuccess && (
        <SuccessModal
          message="Profile updated successfully."
          onClose={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
};

export default ProfileForm;
