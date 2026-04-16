import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import API_URL from "../../../api";
import DashboardCard from "../DashboardCard";
import ProfileHeader from "../../profile/ProfileHeader";
import ProfileForm from "../../profile/ProfileForm";
import AccountSection from "../../profile/AccountSection";
import { MessageSquare, Scale, X } from "lucide-react";

const UserManageProfile = ({
  setActiveTab,
  pendingQuery,
  onContinuePendingQuery,
  onDismissPendingQuery,
}) => {
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
      {pendingQuery && (
        <div className="mb-5 rounded-lg border border-blue-200 bg-blue-50 p-3">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-blue-100 p-2 shrink-0">
              <MessageSquare size={16} className="text-blue-700" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-800">Saved query details found</p>
              <p className="mt-1 text-xs text-gray-600 truncate">
                {pendingQuery.title || "Untitled query"}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {pendingQuery.category || "No category"}
                {pendingQuery.subcategory ? ` > ${pendingQuery.subcategory}` : ""}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={onContinuePendingQuery}
                  className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition"
                >
                  Continue Query
                </button>
                <button
                  onClick={onDismissPendingQuery}
                  className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Dismiss
                </button>
              </div>
            </div>
            <button
              onClick={onDismissPendingQuery}
              className="rounded p-1 text-gray-400 hover:bg-white hover:text-gray-600 transition shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

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
