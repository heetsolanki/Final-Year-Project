import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AlertPopup from "../components/AlertPopup";
import {
  Scale,
  MapPin,
  Languages,
  Briefcase,
  BadgeCheck,
  ArrowLeft,
} from "lucide-react";
import {
  states,
  specializations,
  indianLanguages,
  expertiseOptions,
} from "../data";

const API = "https://law-assist.onrender.com/api";

const ExpertProfile = () => {
  const navigate = useNavigate();
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    barCouncilId: "",
    specialization: "",
    otherSpecialization: "",
    experience: "",
    consultationCharges: "",
    state: "",
    city: "",
    languages: [],
    expertiseAreas: [],
    bio: "",
  });

  const [profileCompletion, setProfileCompletion] = useState(0);
  const [verificationStatus, setVerificationStatus] = useState("");

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API}/expert/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfileCompletion(res.data.profileCompletion || 0);
      setVerificationStatus(res.data.verificationStatus || "");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "state") {
      setFormData({
        ...formData,
        state: value,
        city: "",
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleMultiSelect = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${API}/expert/complete-profile`,
        {
          ...formData,
          specialization:
            formData.specialization === "Other"
              ? formData.otherSpecialization
              : formData.specialization,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setShowProfilePopup(true);
      fetchProfile();
    } catch (error) {
      console.log(error);
      alert("Error updating profile");
    }
  };

  const handleClosePopup = () => {
    setShowProfilePopup(false);
    navigate("/legal-expert-dashboard");
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 pt-28 pb-16">
        <div className="mx-auto max-w-4xl rounded-xl bg-white p-10 shadow-lg">
          <div className="mb-6">
            <button
              onClick={() => navigate("/legal-expert-dashboard")}
              className="flex items-center gap-2 text-sm font-medium text-[#1E3A8A] hover:underline"
            >
              <ArrowLeft size={16} /> Back to Dashboard
            </button>
          </div>
          <div className="mb-8 flex items-center gap-3">
            <Scale className="text-[#1E3A8A]" />
            <h1 className="text-2xl font-semibold">
              Complete Legal Expert Profile
            </h1>
          </div>

          {/* Profile Completion */}
          <div className="mb-8">
            <p className="text-sm text-gray-600">
              Profile Completion:{" "}
              <span className="font-semibold">{profileCompletion}%</span>
            </p>

            <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-[#1E3A8A]"
                style={{ width: `${profileCompletion}%` }}
              ></div>
            </div>

            <p className="mt-2 text-sm">
              Status:{" "}
              {verificationStatus === "verified" ? (
                <span className="text-green-600 font-semibold flex items-center gap-1">
                  <BadgeCheck size={16} /> Verified
                </span>
              ) : verificationStatus === "pending" ? (
                <span className="text-yellow-600 font-semibold">Pending</span>
              ) : (
                <span className="text-red-500 font-semibold">Incomplete</span>
              )}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
          >
            {/* Bar Council ID */}
            <div>
              <label className="text-sm font-medium">Bar Council ID</label>
              <input
                type="text"
                name="barCouncilId"
                pattern="^[A-Z]{2}\/[0-9]{4}\/[0-9]{4}$"
                placeholder="MH/1234/2020"
                value={formData.barCouncilId}
                onChange={handleChange}
                className="mt-1 w-full rounded border p-2"
                required
              />
            </div>

            {/* Experience */}
            <div>
              <label className="text-sm font-medium">Years of Experience</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="mt-1 w-full rounded border p-2"
                required
              />
            </div>

            {/* Specialization */}
            <div>
              <label className="text-sm font-medium">Specialization</label>

              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="mt-1 w-full rounded border p-2"
                required
              >
                <option value="">Select Specialization</option>
                {specializations.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>

              {formData.specialization === "Other" && (
                <input
                  type="text"
                  name="otherSpecialization"
                  placeholder="Enter specialization"
                  onChange={handleChange}
                  className="mt-2 w-full rounded border p-2"
                />
              )}
            </div>

            {/* State */}
            <div>
              <label className="text-sm font-medium flex gap-1">
                <MapPin size={16} /> State
              </label>

              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="mt-1 w-full rounded border p-2"
                required
              >
                <option value="">Select State</option>
                {Object.keys(states).map((state) => (
                  <option key={state}>{state}</option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="text-sm font-medium">City</label>

              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="mt-1 w-full rounded border p-2"
                required
              >
                <option value="">Select City</option>
                {states[formData.state]?.map((city) => (
                  <option key={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Consultation Charges */}
            <div>
              <label className="text-sm font-medium flex gap-1">
                <Briefcase size={16} /> Consultation Charges (₹)
              </label>

              <input
                type="number"
                name="consultationCharges"
                value={formData.consultationCharges}
                onChange={handleChange}
                className="mt-1 w-full rounded border p-2"
              />
            </div>

            {/* Languages */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium flex gap-1">
                <Languages size={16} /> Languages
              </label>

              <div className="mt-2 flex flex-wrap gap-3">
                {indianLanguages.map((lang) => (
                  <button
                    type="button"
                    key={lang}
                    onClick={() => handleMultiSelect("languages", lang)}
                    className={`rounded border px-3 py-1 text-sm ${
                      formData.languages.includes(lang)
                        ? "bg-[#1E3A8A] text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Expertise Areas */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Areas of Expertise</label>

              <div className="mt-2 flex flex-wrap gap-3">
                {expertiseOptions.map((area) => (
                  <button
                    type="button"
                    key={area}
                    onClick={() => handleMultiSelect("expertiseAreas", area)}
                    className={`rounded border px-3 py-1 text-sm ${
                      formData.expertiseAreas.includes(area)
                        ? "bg-[#1E3A8A] text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Professional Bio</label>

              <textarea
                name="bio"
                rows="4"
                value={formData.bio}
                onChange={handleChange}
                className="mt-1 w-full rounded border p-2"
              />
            </div>

            {/* Submit */}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full rounded-lg bg-[#1E3A8A] py-3 font-medium text-white hover:bg-[#b8921f]"
              >
                Save Profile
              </button>
            </div>
            <AlertPopup
              show={showProfilePopup}
              title="Profile Updated"
              message="Your profile has been updated successfully."
              onClose={handleClosePopup}
            />
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ExpertProfile;
