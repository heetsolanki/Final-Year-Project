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
import ExpertNotificationsTab from "../components/dashboard/expert/NotificationsTab";
import ClientReviewsTab from "../components/dashboard/expert/ClientReviewsTab";
import QueryDetailsModal from "../components/queries/QueryDetailsModal";
import BackToTopButton from "../components/layout/BackToTopButton";
import { useNavigate } from "react-router-dom";

// Expert-specific tabs (no "Saved Topics")
const EXPERT_TABS = [
  { id: "overview", label: "Overview" },
  { id: "queries", label: "Assigned Queries" },
  { id: "consultations", label: "Consultations" },
  { id: "reviews", label: "Client Reviews" },
  { id: "notifications", label: "Notifications" },
];

const LegalExpertDashboard = () => {
  const [expert, setExpert] = useState({});
  const [stats, setStats] = useState({});
  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [isActive, setIsActive] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const [refreshKey, setRefreshKey] = useState(0);

  // Queries tab state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const navigate = useNavigate();

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
      fetchExpertProfile();
      fetchStats();
      fetchQueries();
      setRefreshKey((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="user-dashboard-wrapper bg-slate-50 min-h-screen">
        <div className="user-dashboard-container max-w-7xl mx-auto px-4 md:px-6">
          {/* Verification / Inactive Banners */}
          {expert.verificationStatus === "profile_incomplete" && (
            <div className="mb-6 rounded-lg border border-yellow-300 bg-yellow-50 p-4 shadow-sm">
              <p className="text-sm font-medium text-yellow-800">
                Complete your expert profile to start accepting and
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
            </div>
          )}

          {expert.verificationStatus === "under_review" && (
            <div className="mb-6 rounded-lg border border-yellow-300 bg-yellow-50 p-4 shadow-sm inline-flex items-center gap-2 w-full">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-300 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                Under Review
              </span>
              <p className="text-sm text-yellow-800">
                Your expert profile is currently under review. Profile Completion: <span className="font-semibold">{expert.profileCompletion || 0}%</span>
              </p>
            </div>
          )}

          {expert.verificationStatus === "rejected" && (
            <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 shadow-sm">
              <p className="text-sm font-medium text-red-700">
                Your profile verification was rejected.
              </p>
              {expert.rejectionReason && (
                <p className="mt-1 text-sm text-red-600">
                  Reason: {expert.rejectionReason}
                </p>
              )}
              <button
                className="mt-3 rounded-md bg-[#C9A227] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#b8921f]"
                onClick={() => (window.location.href = "/expert-profile")}
              >
                Update Profile & Resubmit
              </button>
            </div>
          )}

          {expert.verificationStatus === "blocked" && (
            <div className="mb-6 rounded-lg border border-gray-300 bg-gray-50 p-4 shadow-sm">
              <p className="text-sm font-medium text-gray-700">
                Your account has been blocked by the administrator.
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Please contact support for assistance.
              </p>
            </div>
          )}

          {isActive === false && expert.verificationStatus !== "blocked" && (
            <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 shadow-sm">
              <p className="text-sm font-medium text-red-700">
                Your profile is currently inactive.
              </p>
              <p className="mt-1 text-sm text-gray-700">
                Activate your profile to accept or respond to consumer queries.
              </p>
            </div>
          )}

          {/* Shared DashboardTopCard */}
          <DashboardTopCard
            userName={expert.name || "Advocate"}
            email={expert.email || ""}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabs={EXPERT_TABS}
            avatarIcon={BadgeCheck}
            belowManageProfileButton={
              localStorage.getItem("role") === "admin" ? (
                <button
                  onClick={() => navigate("/admin-dashboard")}
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-blue-50 hover:border-blue-300 transition"
                >
                  Switch to Admin Dashboard
                </button>
              ) : null
            }
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

          {activeTab === "reviews" && <ClientReviewsTab expertUserId={expert.userId} />}

          {activeTab === "notifications" && <ExpertNotificationsTab refreshKey={refreshKey} />}

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
