import { useState } from "react";
import axios from "axios";
import API_URL from "../api";
import AuthInput from "./AuthInput";
import AlertPopup from "./AlertPopup";
import { EyeOff, Eye } from "lucide-react";

const ChangePasswordModal = ({ onClose }) => {
  const token = localStorage.getItem("token");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({});
  };

  const validate = () => {
    let tempErrors = {};

    if (!formData.currentPassword)
      tempErrors.currentPassword = "Current password is required";

    if (!formData.newPassword)
      tempErrors.newPassword = "New password is required";

    if (formData.currentPassword === formData.newPassword)
      tempErrors.newPassword =
        "New password must be different from current password";

    if (formData.newPassword !== formData.confirmPassword)
      tempErrors.confirmPassword = "Passwords do not match";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      await axios.put(
        `${API_URL}/api/users/change-password`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setLoading(false);
      setShowSuccessPopup(true);
    } catch (err) {
      setLoading(false);
      setErrors({
        currentPassword:
          err.response?.data?.message || "Incorrect current password",
      });
    }
  };

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal-box animate-fadeIn">
        {/* Close */}
        <button onClick={onClose} className="profile-modal-close">
          ✕
        </button>

        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Change Password
        </h3>

        <div className="space-y-5">
          {/* Current Password */}
          <AuthInput
            label="Current Password"
            type={showCurrentPassword ? "text" : "password"}
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            placeholder="Enter current password"
            error={errors.currentPassword}
          >
            <button
              type="button"
              className="eye-icon"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </AuthInput>

          {/* New Password */}
          <AuthInput
            label="New Password"
            type={showNewPassword ? "text" : "password"}
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Enter new password"
            error={errors.newPassword}
          >
            <button
              type="button"
              className="eye-icon"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </AuthInput>

          {/* Confirm Password */}
          <AuthInput
            label="Confirm New Password"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
            error={errors.confirmPassword}
          >
            <button
              type="button"
              className="eye-icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </AuthInput>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="profile-btn w-full mt-8 disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
      <AlertPopup
        show={showSuccessPopup}
        title="Password Updated"
        message="Your password has been changed successfully."
        onClose={() => {
          setShowSuccessPopup(false);
          onClose();
        }}
      />
    </div>
  );
};

export default ChangePasswordModal;
