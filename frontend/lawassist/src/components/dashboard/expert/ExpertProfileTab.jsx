import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import API_URL from "../../../api";
import DashboardCard from "../DashboardCard";
import ProfileHeader from "../../profile/ProfileHeader";
import ExpertProfileForm from "../../profile/ExpertProfileForm";
import AccountSection from "../../profile/AccountSection";
import { Scale } from "lucide-react";

const ExpertManageProfile = ({
  setActiveTab,
  isActive,
  toggleExpertStatus,
  profileCompletion,
}) => {
  const [expert, setExpert] = useState(null);
  const [availability, setAvailability] = useState({ startTime: "09:00", endTime: "18:00" });
  const [availabilityError, setAvailabilityError] = useState("");
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [savingAvailability, setSavingAvailability] = useState(false);
  const token = localStorage.getItem("token");

  const fetchProfile = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/expert/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpert(res.data);
      setAvailability({
        startTime: res.data?.availability?.startTime || "09:00",
        endTime: res.data?.availability?.endTime || "18:00",
      });
    } catch (err) {
      console.log(err);
    }
  }, [token]);

  const saveAvailability = async () => {
    setAvailabilityError("");
    setAvailabilityMessage("");

    if (!availability.startTime || !availability.endTime || availability.startTime === availability.endTime) {
      setAvailabilityError("Please select a valid start and end time.");
      return;
    }

    try {
      setSavingAvailability(true);
      const res = await axios.patch(
        `${API_URL}/api/expert/availability`,
        availability,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setAvailabilityMessage(res.data?.message || "Availability updated successfully.");
      fetchProfile();
    } catch (error) {
      setAvailabilityError(
        error?.response?.data?.message || "Failed to update availability.",
      );
    } finally {
      setSavingAvailability(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (!expert) return null;

  return (
    <div className="space-y-6">
      {/* Profile Status Card */}
      <DashboardCard>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Profile Status
          </span>
          <button
            onClick={toggleExpertStatus}
            className={`shrink-0 px-4 py-1.5 text-xs font-semibold rounded-full transition ${
              isActive
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-red-100 text-red-700 hover:bg-red-200"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </button>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-700 mb-2">
            <strong>Profile Completion:</strong> {profileCompletion || 0}%
          </p>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-[#C9A227] transition-all duration-300"
              style={{ width: `${profileCompletion || 0}%` }}
            />
          </div>
        </div>
      </DashboardCard>

      {/* Main Profile Card */}
      <DashboardCard title="Manage Profile">
        <ProfileHeader user={expert} setActiveTab={setActiveTab} />
        <ExpertProfileForm user={expert} refresh={fetchProfile} />

        <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <h3 className="text-sm font-semibold text-gray-800">Set Availability</h3>
          <p className="mt-1 text-xs text-gray-500">
            Users can start consultations only during this time window.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="text-sm text-gray-700">
              <span className="mb-1 block text-xs font-medium text-gray-500">Start Time</span>
              <input
                type="time"
                value={availability.startTime}
                onChange={(e) => setAvailability((prev) => ({ ...prev, startTime: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
              />
            </label>

            <label className="text-sm text-gray-700">
              <span className="mb-1 block text-xs font-medium text-gray-500">End Time</span>
              <input
                type="time"
                value={availability.endTime}
                onChange={(e) => setAvailability((prev) => ({ ...prev, endTime: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
              />
            </label>
          </div>

          <button
            onClick={saveAvailability}
            disabled={savingAvailability}
            className="mt-4 rounded-lg bg-[#1E3A8A] px-4 py-2 text-sm font-medium text-white hover:bg-[#17306f] disabled:opacity-60"
          >
            {savingAvailability ? "Saving..." : "Update Availability"}
          </button>

          {availabilityError && (
            <p className="mt-2 text-xs text-red-600">{availabilityError}</p>
          )}

          {availabilityMessage && (
            <p className="mt-2 text-xs text-green-700">{availabilityMessage}</p>
          )}
        </div>

        <AccountSection />

        <div className="mt-10 md:mt-12 text-xs md:text-sm text-gray-500 border-t pt-6 text-center leading-relaxed flex items-center justify-center gap-2">
          <Scale size={16} className="text-gray-400" />
          <span>LawAssist ensures that all personal information is securely stored and protected under our privacy policy.</span>
        </div>
      </DashboardCard>
    </div>
  );
};

export default ExpertManageProfile;
