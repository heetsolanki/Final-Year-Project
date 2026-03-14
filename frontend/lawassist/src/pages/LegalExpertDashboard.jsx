import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import API_URL from "../api";
import { BadgeCheck } from "lucide-react";
import DashboardTopCard from "../components/dashboard/DashboardTopCard";
import ExpertOverviewTab from "../components/dashboard/expert/OverviewTab";
import ExpertQueriesTab from "../components/dashboard/expert/QueriesTab";
import ExpertConsultationsTab from "../components/dashboard/expert/Consultations";
import ExpertManageProfile from "../components/dashboard/expert/ExpertProfileTab";
import QueryDetailsModal from "../components/queries/QueryDetailsModal";
import BackToTopButton from "../components/layout/BackToTopButton";

// Expert-specific tabs (no "Saved Topics")
const EXPERT_TABS = [
  { id: "overview", label: "Overview" },
  { id: "queries", label: "Assigned Queries" },
  { id: "consultations", label: "Consultations" },
];

const LegalExpertDashboard = () => {
  const [expert, setExpert] = useState({});
  const [stats, setStats] = useState({});
  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [isActive, setIsActive] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Queries tab state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const fetchExpertProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);

      const res = await axios.get(`${API_URL}/api/expert/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setExpert({
        ...res.data,
        userId: decoded.userId,
        verificationStatus: res.data.verificationStatus,
        profileCompletion: res.data.profileCompletion,
      });

      setIsActive(res.data.isActive);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/expert/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchQueries = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/expert/queries`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQueries(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleExpertStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `${API_URL}/api/expert/toggle-status`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setIsActive(res.data.isActive);
    } catch (error) {
      console.log("Toggle status error:", error);
    }
  };

  useEffect(() => {
    fetchExpertProfile();
    fetchStats();
    fetchQueries();

    const interval = setInterval(() => {
      fetchStats();
      fetchQueries();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Status badge rendered inline under the name in the top card
  const statusBadge = isActive !== null && (
    <span
      className={`inline-flex items-center gap-1 mt-1 text-xs font-medium px-2 py-0.5 rounded-full
      ${isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-green-500" : "bg-red-500"}`}
      />
      {isActive ? "Active" : "Inactive"}
    </span>
  );

  return (
    <>
      <div className="user-dashboard-wrapper bg-slate-50 min-h-screen">
        <div className="user-dashboard-container max-w-7xl mx-auto px-4 md:px-6">
          {/* Verification / Inactive Banners — unchanged logic */}
          {expert.verificationStatus !== "verified" && (
            <div className="mb-6 rounded-lg border border-yellow-300 bg-yellow-50 p-4 shadow-sm">
              {expert.verificationStatus === "incomplete" && (
                <>
                  <p className="text-sm font-medium text-yellow-800">
                    ⚠ Complete your expert profile to start accepting and
                    answering cases.
                  </p>
                  <p className="mt-1 text-sm text-gray-700">
                    Profile Completion:{" "}
                    <span className="font-semibold">
                      {expert.profileCompletion || 0}%
                    </span>
                  </p>
                  <button
                    className="mt-3 rounded-md bg-[#C9A227] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#b8921f]"
                    onClick={() => (window.location.href = "/expert-profile")}
                  >
                    Complete Profile
                  </button>
                </>
              )}

              {expert.verificationStatus === "pending" && (
                <>
                  <p className="text-sm font-medium text-yellow-800">
                    ⏳ Your expert profile is currently under verification.
                  </p>
                  <p className="mt-1 text-sm text-gray-700">
                    Profile Completion:{" "}
                    <span className="font-semibold">
                      {expert.profileCompletion || 0}%
                    </span>
                  </p>
                </>
              )}
            </div>
          )}

          {isActive === false && (
            <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 shadow-sm">
              <p className="text-sm font-medium text-red-700">
                🔴 Your profile is currently inactive.
              </p>
              <p className="mt-1 text-sm text-gray-700">
                Activate your profile to accept or respond to consumer queries.
              </p>
            </div>
          )}

          {/* Shared DashboardTopCard — BadgeCheck icon, expert tabs, status badge */}
          <DashboardTopCard
            userName={expert.name || "Advocate"}
            email={expert.email || ""}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabs={EXPERT_TABS}
            avatarIcon={BadgeCheck}
            headerExtra={statusBadge}
          />

          {/* Tab Content */}
          {activeTab === "overview" && (
            <ExpertOverviewTab
              queries={queries}
              stats={stats}
              expert={expert}
              isActive={isActive}
              setSelectedQuery={setSelectedQuery}
              setShowViewModal={setShowViewModal}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === "queries" && (
            <ExpertQueriesTab
              queries={queries}
              expert={expert}
              isActive={isActive}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              setSelectedQuery={setSelectedQuery}
              setShowViewModal={setShowViewModal}
            />
          )}

          {activeTab === "consultations" && <ExpertConsultationsTab />}

          {activeTab === "profile" && (
            <ExpertManageProfile
              setActiveTab={setActiveTab}
              isActive={isActive}
              toggleExpertStatus={toggleExpertStatus}
              profileCompletion={expert.profileCompletion}
            />
          )}
        </div>
      </div>

      {showViewModal && selectedQuery && (
        <QueryDetailsModal
          query={selectedQuery}
          onClose={() => {
            setShowViewModal(false);
            setSelectedQuery(null);
          }}
          refreshQueries={() => {
            fetchQueries();
            fetchStats();
          }}
        />
      )}
      <BackToTopButton />
    </>
  );
};

export default LegalExpertDashboard;
