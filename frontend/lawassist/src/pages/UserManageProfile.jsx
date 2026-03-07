import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import ProfileHeader from "../components/ProfileHeader";
import ProfileForm from "../components/ProfileForm";
import AccountSection from "../components/AccountSection";

const API = "https://law-assist.onrender.com/api";

const UserManageProfile = () => {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  const fetchProfile = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/users/profile`, {
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
    <>
      <div className="min-h-screen bg-gray-50 pt-24 md:pt-32 px-4 md:px-6 pb-16">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm p-5 md:p-8 transition-all duration-300 hover:shadow-xl">
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