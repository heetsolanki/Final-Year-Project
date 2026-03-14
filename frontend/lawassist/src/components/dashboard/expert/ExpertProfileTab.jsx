import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import API_URL from "../../../api";
import DashboardCard from "../DashboardCard";
import ProfileHeader from "../../profile/ProfileHeader";
import ProfileForm from "../../profile/ProfileForm";
import AccountSection from "../../profile/AccountSection";

const ExpertManageProfile = ({
  setActiveTab,
  isActive,
  toggleExpertStatus,
  profileCompletion,
}) => {
  const [expert, setExpert] = useState(null);
  const token = localStorage.getItem("token");

  const fetchProfile = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/expert/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpert(res.data);
    } catch (err) {
      console.log(err);
    }
  }, [token]);

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
        <ProfileForm user={expert} refresh={fetchProfile} />
        <AccountSection />

        <div className="mt-10 md:mt-12 text-xs md:text-sm text-gray-500 border-t pt-6 text-center leading-relaxed">
          ⚖️ LawAssist ensures that all personal information is securely stored
          and protected under our privacy policy.
        </div>
      </DashboardCard>
    </div>
  );
};

export default ExpertManageProfile;
