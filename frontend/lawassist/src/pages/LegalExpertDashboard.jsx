import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { FolderOpen, Clock, CheckCircle, Bell, User } from "lucide-react";
import "../styles/legalExpertDashboard.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import QueryDetailsModal from "../components/QueryDetailsModal";
import BackToTopButton from "../components/BackToTopButton";

const LegalExpertDashboard = () => {
  const [expert, setExpert] = useState({});
  const [stats, setStats] = useState({});
  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const fetchExpertProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const decoded = jwtDecode(token);

      const res = await axios.get("http://localhost:5000/api/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setExpert({
        ...res.data,
        userId: decoded.userId,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/expert/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchQueries = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/expert/queries", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setQueries(res.data);
    } catch (error) {
      console.log(error);
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

  return (
    <>
      <Navbar />

      <div className="expert-dashboard-wrapper">
        <div className="expert-dashboard-container">
          <div className="expert-dashboard-header">
            <h1 className="expert-dashboard-title">
              Welcome back, {expert.name || "Advocate"}
            </h1>
            <p className="expert-dashboard-subtext">
              Manage and respond to assigned consumer complaints efficiently.
            </p>
          </div>

          <div className="expert-stats-grid">
            <div className="expert-stat-card">
              <FolderOpen className="text-blue-600" />
              <div>
                <h3>Assigned Cases</h3>
                <p>{stats.assignedQueries || 0}</p>
              </div>
            </div>

            <div className="expert-stat-card">
              <Clock className="text-yellow-500" />
              <div>
                <h3>Pending Replies</h3>
                <p>{stats.pendingQueries || 0}</p>
              </div>
            </div>

            <div className="expert-stat-card">
              <CheckCircle className="text-green-600" />
              <div>
                <h3>Resolved Cases</h3>
                <p>{stats.resolvedQueries || 0}</p>
              </div>
            </div>

            <div className="expert-stat-card">
              <Bell className="text-red-500" />
              <div>
                <h3>New Queries Today</h3>
                <p>
                  {
                    queries.filter(
                      (q) =>
                        new Date(q.createdAt).toDateString() ===
                        new Date().toDateString(),
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="expert-table-wrapper">
            <table className="expert-table">
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Consumer</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {queries
                  .filter((query) => query.expertId === expert.userId)
                  .map((query) => (
                    <tr key={query._id}>
                      <td>{query._id.slice(-5)}</td>
                      <td>{query.userId}</td>
                      <td>{query.category}</td>

                      <td>{new Date(query.createdAt).toLocaleDateString()}</td>

                      <td>
                        <span
                          className={`expert-status-badge 
${
  query.status === "Assigned"
    ? "expert-status-progress"
    : "expert-status-resolved"
}`}
                        >
                          {query.status}
                        </span>
                      </td>

                      <td>
                        <button
                          className="expert-view-btn"
                          onClick={() => {
                            setSelectedQuery(query);
                            setShowViewModal(true);
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* ================= SIDE PANEL ================= */}
          <div className="expert-side-panel">
            {/* Profile Card */}
            <div className="expert-side-card expert-profile-card">
              <h3>
                <User size={18} /> Advocate Profile
              </h3>
              <p>
                <strong>Name:</strong> {expert.name || "Loading..."}
              </p>
              <p>
                <strong>Email:</strong> {expert.email || "Loading..."}
              </p>
              <p>
                <strong>Role:</strong> Legal Expert
              </p>
              <button className="expert-outline-btn small">Edit Profile</button>
            </div>

            {/* Notifications */}
            <div className="expert-side-card">
              <h3>Recent Notifications</h3>
              <ul>
                <li>New case assigned (2 hours ago)</li>
                <li>Consumer replied to Case #1023</li>
                <li>Case #1018 marked resolved</li>
              </ul>
            </div>
          </div>
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
      <Footer />
    </>
  );
};

export default LegalExpertDashboard;
