import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../api";
import SuccessModal from "./SuccessModal";

// const API = "https://law-assist.onrender.com/api";

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
    <div className="profile-section">
      <h3 className="profile-section-title">Personal Information</h3>

      <div className="profile-grid">
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

      <button onClick={handleUpdate} className="profile-btn mt-6">
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
