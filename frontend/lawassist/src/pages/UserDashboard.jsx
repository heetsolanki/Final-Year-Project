import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../api";
import { User, MessageSquare, X } from "lucide-react";

import DashboardTopCard from "../components/dashboard/DashboardTopCard";

import UserOverviewTab from "../components/dashboard/user/OverviewTab";
import UserQueriesTab from "../components/dashboard/user/QueriesTab";
import UserConsultations from "../components/dashboard/user/Consultations";
import SavedTopics from "../components/dashboard/user/SavedTopics";
import UserProfileTab from "../components/dashboard/user/UserProfileTab";
import UserNotificationsTab from "../components/dashboard/user/NotificationsTab";
import QueryTrackTab from "../components/dashboard/user/QueryTrackTab";
import PaymentHistoryTab from "../components/dashboard/user/PaymentHistoryTab";

import QueryDetailsModal from "../components/queries/QueryDetailsModal";
import ReviewModal from "../components/queries/ReviewModal";
import AskQueryForm from "../components/queries/AskQueryForm";
import BackToTopButton from "../components/layout/BackToTopButton";

const USER_TABS = [
  { id: "overview", label: "Overview" },
  { id: "queries", label: "All Queries" },
  { id: "track", label: "Track Status" },
  { id: "consultations", label: "Consultations" },
  { id: "payments", label: "Payments" },
  { id: "saved", label: "Saved Topics" },
  { id: "notifications", label: "Notifications" },
];

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const [queries, setQueries] = useState([]);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const [selectedQueryId, setSelectedQueryId] = useState(null);
  const [selectedQuery, setSelectedQuery] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const [reviewQuery, setReviewQuery] = useState(null);

  const [refreshKey, setRefreshKey] = useState(0);

  // Pending query from localStorage (non-logged-in user)
  const [pendingQuery, setPendingQuery] = useState(null);
  const [showAskQueryModal, setShowAskQueryModal] = useState(false);

  // Check for pending query on mount
  useEffect(() => {
    const stored = localStorage.getItem("pendingQuery");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Only show if saved within the last 24 hours
        const savedAt = new Date(parsed.savedAt);
        const now = new Date();
        const hoursDiff = (now - savedAt) / (1000 * 60 * 60);
        if (hoursDiff < 24) {
          setPendingQuery(parsed);
        } else {
          localStorage.removeItem("pendingQuery");
        }
      } catch {
        localStorage.removeItem("pendingQuery");
      }
    }
  }, []);

  const handleContinueQuery = () => {
    setShowAskQueryModal(true);
  };

  const handleDismissBanner = () => {
    localStorage.removeItem("pendingQuery");
    setPendingQuery(null);
  };

  const handleQuerySuccess = () => {
    localStorage.removeItem("pendingQuery");
    setPendingQuery(null);
    setShowAskQueryModal(false);
    fetchDashboard();
  };

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_URL}/api/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserName(res.data.name || "");
      setEmail(res.data.email || "");
      setQueries(res.data.queries || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    if (!selectedQueryId) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${API_URL}/api/queries/${selectedQueryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShowDeleteModal(false);
      setSelectedQuery(null);
      setSelectedQueryId(null);

      fetchDashboard();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDashboard();

    const interval = setInterval(() => {
      fetchDashboard();
      setRefreshKey((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case "overview":
        return (
          <UserOverviewTab
            queries={queries}
            setSelectedQuery={setSelectedQuery}
            setShowViewModal={setShowViewModal}
            setSelectedQueryId={setSelectedQueryId}
            setShowDeleteModal={setShowDeleteModal}
            setActiveTab={setActiveTab}
          />
        );

      case "queries":
        return (
          <UserQueriesTab
            queries={queries}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            setSelectedQuery={setSelectedQuery}
            setShowViewModal={setShowViewModal}
            setSelectedQueryId={setSelectedQueryId}
            setShowDeleteModal={setShowDeleteModal}
          />
        );

      case "track":
        return <QueryTrackTab queries={queries} refreshQueries={fetchDashboard} />;

      case "consultations":
        return <UserConsultations />;

      case "payments":
        return <PaymentHistoryTab />;

      case "saved":
        return <SavedTopics />;

      case "notifications":
        return <UserNotificationsTab refreshKey={refreshKey} />;

      case "profile":
        return <UserProfileTab setActiveTab={setActiveTab} />;

      default:
        return null;
    }
  };

  return (
    <>
      <div className="user-dashboard-wrapper bg-slate-50 min-h-screen">
        <div className="user-dashboard-container max-w-7xl mx-auto px-4 md:px-6">
          {/* Top Profile Card */}
          <DashboardTopCard
            userName={userName}
            email={email}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabs={USER_TABS}
            avatarIcon={User}
          />

          {/* Pending Query Banner */}
          {pendingQuery && (
            <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 animate-fadeIn">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                  <MessageSquare size={20} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-800">
                    Continue with your query?
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                    You have a saved query: "{pendingQuery.title}"
                  </p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={handleContinueQuery}
                      className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                    >
                      Continue Query
                    </button>
                    <button
                      onClick={handleDismissBanner}
                      className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleDismissBanner}
                  className="p-1 hover:bg-white/50 rounded-lg transition shrink-0"
                >
                  <X size={16} className="text-gray-400" />
                </button>
              </div>
            </div>
          )}

          {/* Tab Content */}
          <div className="mt-6">{renderTab()}</div>
        </div>

        {/* View Query */}
        {showViewModal && selectedQuery && (
          <QueryDetailsModal
            query={selectedQuery}
            onClose={() => {
              setShowViewModal(false);
              setSelectedQuery(null);
            }}
            refreshQueries={fetchDashboard}
            openReviewModal={(query) => {
              setReviewQuery(query);
              setShowReviewModal(true);
            }}
          />
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="delete-overlay">
            <div className="delete-modal">
              <h3 className="delete-title">Delete Query?</h3>

              <p className="delete-text">
                Are you sure you want to delete this query? This action cannot
                be undone.
              </p>

              <div className="delete-actions">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="delete-cancel-btn"
                >
                  Cancel
                </button>

                <button onClick={handleDelete} className="delete-confirm-btn">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Review Modal */}
        {showReviewModal && reviewQuery && (
          <ReviewModal
            query={reviewQuery}
            onClose={() => {
              setShowReviewModal(false);
              setReviewQuery(null);
            }}
          />
        )}

        {/* Ask Query Modal (for pending query continuation) */}
        {showAskQueryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <AskQueryForm
              onClose={() => setShowAskQueryModal(false)}
              onSuccess={handleQuerySuccess}
              defaultCategory={pendingQuery?.category || ""}
              defaultSubcategory={pendingQuery?.subcategory || ""}
              initialData={pendingQuery}
            />
          </div>
        )}
      </div>

      <BackToTopButton />
    </>
  );
};

export default UserDashboard;
