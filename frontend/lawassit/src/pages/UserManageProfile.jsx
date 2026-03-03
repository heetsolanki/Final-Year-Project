import React, { useEffect, useState } from "react";
import axios from "axios";
import ProfileHeader from "../components/ProfileHeader";
import ProfileForm from "../components/ProfileForm";
import AccountSection from "../components/AccountSection";
import "../styles/manageProfile.css";

const API = "https://law-assist.onrender.com/api";

const UserManageProfile = () => {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  const fetchProfile = async () => {
    const res = await axios.get(`${API}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUser(res.data);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!user) return null;

  return (
    <>
      <div className="profile-page">
        <div className="profile-container">
          <ProfileHeader user={user} />
          <ProfileForm user={user} refresh={fetchProfile} />
          <AccountSection />

          <div className="mt-10 md:mt-12 text-xs md:text-sm text-gray-500 border-t pt-6 text-center leading-relaxed">
            ⚖️ LawAssist ensures that all personal information is securely
            stored and protected under our privacy policy.
          </div>
        </div>
      </div>
    </>
  );
};

export default UserManageProfile;
