import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../../api";
import AlertPopup from "../ui/AlertPopup";
import { states } from "../../data";
import { generateBio } from "../../services/aiService";

const ProfileForm = ({ user, refresh }) => {
  const [formData, setFormData] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [generatingBio, setGeneratingBio] = useState(false);
  const [bioError, setBioError] = useState("");
  const token = localStorage.getItem("token");
  const selectedState = formData.state || "";

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    await axios.put(`${API_URL}/api/expert/profile`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    refresh();
    setShowSuccess(true);
  };

  const handleGenerateBio = async () => {
    setBioError("");
    if (!user.specialization || !user.experience) {
      setBioError("Specialization and experience are needed to generate a bio.");
      return;
    }
    try {
      setGeneratingBio(true);
      const bio = await generateBio({
        name: user.name,
        specialization: user.specialization,
        expertiseAreas: user.expertiseAreas || [],
        languages: user.languages || [],
        experience: user.experience,
        city: formData.city || user.city || "",
        state: formData.state || user.state || "",
      });
      setFormData((prev) => ({ ...prev, bio }));
    } catch {
      setBioError("Failed to generate bio. Please try again.");
    } finally {
      setGeneratingBio(false);
    }
  };

  return (
    <div className="space-y-10 mt-6">
      {/* PROFESSIONAL INFORMATION */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">
          Professional Information
        </h3>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Specialization
            </label>
            <input
              value={user.specialization || ""}
              disabled
              className="w-full border border-gray-200 bg-gray-100 text-gray-500 rounded-lg px-3 py-2 text-sm cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Experience
            </label>
            <input
              value={`${user.experience} year(s)`}
              disabled
              className="w-full border border-gray-200 bg-gray-100 text-gray-500 rounded-lg px-3 py-2 text-sm cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Bar Council ID
            </label>
            <input
              value={user.barCouncilId || ""}
              disabled
              className="w-full border border-gray-200 bg-gray-100 text-gray-500 rounded-lg px-3 py-2 text-sm cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Verification Status
            </label>
            <input
              value={user.verificationStatus}
              disabled
              className="w-full border border-gray-200 bg-gray-100 text-gray-500 rounded-lg px-3 py-2 text-sm cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* EDITABLE INFORMATION */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">
          Editable Information
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
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Consultation Charges (₹)
            </label>
            <input
              name="consultationCharges"
              value={formData.consultationCharges || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Professional Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio || ""}
              onChange={handleChange}
              rows="3"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />

            <button
              type="button"
              onClick={handleGenerateBio}
              disabled={generatingBio}
              className="mt-2 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {generatingBio ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating bio...
                </>
              ) : (
                <>✨ Generate with AI</>
              )}
            </button>

            {bioError && (
              <p className="mt-1 text-xs text-red-500">{bioError}</p>
            )}
          </div>
        </div>
      </div>

      {/* ACCOUNT INFORMATION */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">
          Account Information
        </h3>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Full Name
            </label>
            <input
              value={user.name}
              disabled
              className="w-full border border-gray-200 bg-gray-100 text-gray-500 rounded-lg px-3 py-2 text-sm cursor-not-allowed"
            />
          </div>

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
        </div>
      </div>

      {/* SAVE BUTTON */}
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
