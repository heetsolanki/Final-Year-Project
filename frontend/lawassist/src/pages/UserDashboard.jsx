import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../api";

import DashboardTopCard from "../components/dashboard/DashboardTopCard";
import Tabs from "../components/dashboard/DashboardTabs";

import UserOverviewTab from "../components/dashboard/user/OverviewTab";
import UserQueriesTab from "../components/dashboard/user/QueriesTab";
import UserConsultations from "../components/dashboard/user/Consultations";
import SavedTopics from "../components/dashboard/user/SavedTopics";
import UserProfileTab from "../components/dashboard/user/UserProfileTab";

import QueryDetailsModal from "../components/queries/QueryDetailsModal";
import ReviewModal from "../components/queries/ReviewModal";
import BackToTopButton from "../components/layout/BackToTopButton";

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

      case "consultations":
        return <UserConsultations />;

      case "saved":
        return <SavedTopics />;

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
          />

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
      </div>

      <BackToTopButton />
    </>
  );
};

export default UserDashboard;
