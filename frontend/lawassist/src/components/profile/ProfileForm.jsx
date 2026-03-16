import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../../api";
import AlertPopup from "../ui/AlertPopup";
import { states } from "../../data";

const ProfileForm = ({ user, refresh }) => {
  const [formData, setFormData] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const token = localStorage.getItem("token");
  const selectedState = formData.state || "";

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
    <div className="space-y-8 mt-6">
      {/* ===== PERSONAL INFORMATION ===== */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
        <h3 className="text-lg font-semibold text-gray-800 mb-5">
          Personal Information
        </h3>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Full Name
            </label>

            <input
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Phone Number
            </label>

            <input
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
        </div>
      </div>

      {/* ===== LOCATION DETAILS ===== */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
        <h3 className="text-lg font-semibold text-gray-800 mb-5">
          Location Details
        </h3>

        <div className="grid md:grid-cols-2 gap-5">
          {/* STATE */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              State
            </label>

            <select
              name="state"
              value={formData.state || ""}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  state: e.target.value,
                  city: "", // reset city when state changes
                });
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition appearance-none"
            >
              <option value="">Select State</option>

              {Object.keys(states).map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          {/* CITY */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              City
            </label>

            <select
              name="city"
              value={formData.city || ""}
              onChange={handleChange}
              disabled={!selectedState}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:bg-gray-100 appearance-none"
            >
              <option value="">Select City</option>

              {selectedState &&
                states[selectedState].map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* ===== ACCOUNT INFORMATION ===== */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
        <h3 className="text-lg font-semibold text-gray-800 mb-5">
          Account Information
        </h3>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email Address
            </label>

            <input
              value={user.email}
              disabled
              className="w-full border border-gray-200 bg-gray-100 text-gray-500 rounded-lg px-3 py-2 text-sm cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Account Type
            </label>

            <input
              value={user.role === "legalExpert" ? "Legal Expert" : "Consumer"}
              disabled
              className="w-full border border-gray-200 bg-gray-100 text-gray-500 rounded-lg px-3 py-2 text-sm cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* ===== SAVE BUTTON ===== */}
      <div className="flex justify-end">
        <button
          onClick={handleUpdate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Save Changes
        </button>
      </div>

      {showSuccess && (
        <AlertPopup
          show={showSuccess}
          type="success"
          title="Profile Updated"
          description="Profile updated successfully."
          onClose={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
};

export default ProfileForm;
