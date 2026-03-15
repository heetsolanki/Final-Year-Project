import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import API_URL from "../../../api";
import DashboardCard from "../DashboardCard";
import ProfileHeader from "../../profile/ProfileHeader";
import ProfileForm from "../../profile/ProfileForm";
import AccountSection from "../../profile/AccountSection";
import { Scale } from "lucide-react";

const UserManageProfile = ({ setActiveTab }) => {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  const fetchProfile = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.log(err);
    }
  }, [token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (!user) return null;

  return (
    <DashboardCard title="Manage Profile">
      <ProfileHeader user={user} setActiveTab={setActiveTab} />
      <ProfileForm user={user} refresh={fetchProfile} />
      <AccountSection />

      <div className="mt-10 md:mt-12 text-xs md:text-sm text-gray-500 border-t pt-6 text-center leading-relaxed flex items-center justify-center gap-2">
        <Scale size={16} className="text-gray-400" />
        <span>LawAssist ensures that all personal information is securely stored and protected under our privacy policy.</span>
      </div>
    </DashboardCard>
  );
};

export default UserManageProfile;
