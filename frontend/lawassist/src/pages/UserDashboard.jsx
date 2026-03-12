import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../api";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  FolderOpen,
  FileText,
  CheckCircle,
  User,
  Plus,
  Bell,
  Search,
  Eye,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AskQueryForm from "../components/AskQueryForm";
import BackToTopButton from "../components/BackToTopButton";
import QueryDetailsModal from "../components/QueryDetailsModal";
import ReviewModal from "../components/ReviewModal";
import SavedTopics from "../components/SavedTopics";
import { getStatusClass } from "../data";

const UserDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [userName, setUserName] = useState("");
  const [queries, setQueries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedQueryId, setSelectedQueryId] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewQuery, setReviewQuery] = useState(null);
  const [showSavedTopics, setShowSavedTopics] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isProfilePage = location.pathname.includes("manage-profile");

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserName(res.data.name || "");
      setQueries(res.data.queries || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    if (!selectedQueryId || selectedQueryId === "null") {
      console.log("Invalid ID — delete stopped");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/queries/${selectedQueryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowDeleteModal(false);
      setShowViewModal(false);
      setSelectedQuery(null);
      setSelectedQueryId(null);
      fetchDashboard();
    } catch (error) {
      console.log(error);
      alert("Failed to delete query");
    }
  };

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(() => {
      fetchDashboard();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const notifications = [
    "Your case 'Refund not received' is under review.",
    "Legal expert assigned to 'Defective mobile phone'.",
    "Your case 'Late delivery complaint' was resolved.",
  ];

  const filteredQueries = queries?.filter((q) => {
    const matchesSearch = q.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "All" || q.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <Navbar />
      {showSavedTopics ? (
        <div className="user-dashboard-wrapper">
          <div className="user-dashboard-container">
            <SavedTopics onClose={() => setShowSavedTopics(false)} />
          </div>
        </div>
      ) : (
        <>
          <div className="user-dashboard-wrapper">
            <div className="user-dashboard-container">
              {!isProfilePage && (
                <>
                  {/* HEADER */}
                  <div className="mb-12">
                    <div className="flex items-center gap-4">
                      <div className="user-avatar">
                        <User size={20} />
                      </div>
                      <div>
                        <h1 className="user-dashboard-title">
                          Welcome back, {userName}
                        </h1>
                        <p className="user-dashboard-subtext">
                          Manage your consumer legal queries and track their
                          status.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* QUICK ACTIONS */}
                  <div className="user-quick-actions">
                    {!showForm && (
                      <button
                        className="user-primary-btn"
                        onClick={() => setShowForm(true)}
                      >
                        <Plus size={18} /> Submit New Query
                      </button>
                    )}
                    <button
                      className="user-outline-btn"
                      onClick={() => setShowSavedTopics(true)}
                    >
                      View Saved Topics
                    </button>
                  </div>

                  {showForm && (
                    <AskQueryForm
                      onClose={() => setShowForm(false)}
                      onSuccess={fetchDashboard}
                    />
                  )}

                  {/* STATS */}
                  <div className="user-stats-grid">
                    <div className="user-stat-card">
                      <FolderOpen size={25} color="rgba(37, 99, 235)" />
                      <div>
                        <h3>Total Cases</h3>
                        <p>{queries.length}</p>
                      </div>
                    </div>

                    <div className="user-stat-card">
                      <FileText size={25} color="rgba(212, 175, 55)" />
                      <div>
                        <h3>Active Cases</h3>
                        <p>
                          {
                            queries.filter((q) => q.status !== "Resolved")
                              .length
                          }
                        </p>
                      </div>
                    </div>

                    <div className="user-stat-card">
                      <CheckCircle size={25} color="rgba(34, 197, 94)" />
                      <div>
                        <h3>Resolved</h3>
                        <p>
                          {
                            queries.filter((q) => q.status === "Resolved")
                              .length
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* FILTER BAR */}
                  <div className="user-filter-bar">
                    <div className="user-search-box">
                      <Search size={16} />
                      <input
                        type="text"
                        placeholder="Search queries..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="All">All</option>
                      <option value="In Review">In Review</option>
                      <option value="Assigned">Assigned</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>

                  {/* TABLE */}
                  <div className="user-table-wrapper">
                    <table className="user-queries-table">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Category</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th></th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredQueries.map((query) => (
                          <tr key={query._id}>
                            <td>{query.title}</td>
                            <td>{query.category}</td>
                            <td>
                              {new Date(query.createdAt).toLocaleDateString()}
                            </td>
                            <td>
                              <span
                                className={`user-status-badge ${getStatusClass(query.status)}`}
                              >
                                {query.status}
                              </span>
                            </td>
                            <td>
                              <button
                                className="user-view-btn"
                                onClick={() => {
                                  setSelectedQuery(query);
                                  setShowViewModal(true);
                                }}
                              >
                                <Eye size={18} />
                              </button>
                            </td>
                            <td>
                              <button
                                className="user-delete-btn"
                                onClick={() => {
                                  setSelectedQueryId(query._id);
                                  setShowDeleteModal(true);
                                }}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* SIDE PANEL */}
                  <div className="user-side-panel">
                    <div className="user-side-card">
                      <h3>
                        <Bell size={16} /> Recent Activity
                      </h3>
                      <ul>
                        {notifications.map((note, index) => (
                          <li key={index}>{note}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="user-profile-card user-side-card">
                      <h3>My Profile</h3>
                      <p>Manage account settings and security.</p>
                      <button
                        className="user-outline-btn small mt-2"
                        onClick={() => navigate("manage-profile")}
                      >
                        View Profile
                      </button>
                    </div>
                  </div>

                  {/* DISCLAIMER */}
                  <div className="user-dashboard-disclaimer">
                    ⚖️ LawAssist provides legal information and query management
                    support. It does not replace professional legal advice.
                  </div>
                </>
              )}
              <Outlet />
            </div>

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
            {showDeleteModal && (
              <div className="delete-overlay">
                <div className="delete-modal">
                  <h3 className="delete-title">Delete Query?</h3>
                  <p className="delete-text">
                    Are you sure you want to delete this query? This action
                    cannot be undone.
                  </p>
                  <div className="delete-actions">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="delete-cancel-btn"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      className="delete-confirm-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
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
        </>
      )}
      <BackToTopButton />
      <Footer />
    </>
  );
};

export default UserDashboard;
