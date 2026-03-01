import React, { useState, useEffect } from "react";
import axios from "axios";
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
import "../styles/userDashboard.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AskQueryForm from "../components/AskQueryForm";
import BackToTopButton from "../components/BackToTopButton";

const UserDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [userName, setUserName] = useState("");
  const [queries, setQueries] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const fetchDashboard = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "https://law-assist.onrender.com/api/dashboard",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setUserName(res.data.name || "");
    setQueries(res.data.queries || []);
  } catch (error) {
    console.log(error);
  }
};
  useEffect(() => {
    fetchDashboard();
  }, []);

  const notifications = [
    "Your case 'Refund not received' is under review.",
    "Legal expert assigned to 'Defective mobile phone'.",
    "Your case 'Late delivery complaint' was resolved.",
  ];

  const savedTopics = [
    "Consumer Protection Act",
    "Online Refund Rights",
    "Warranty Guidelines",
  ];

  const filteredQueries = queries?.filter((q) => {
    const matchesSearch = q.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "All" || q.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case "In Review":
        return "user-status-review";
      case "Assigned":
        return "user-status-assigned";
      case "Resolved":
        return "user-status-resolved";
      default:
        return "user-status-default";
    }
  };

  return (
    <>
      <Navbar />
      <div className="user-dashboard-wrapper">
        <div className="user-dashboard-container">
          <div className="user-dashboard-header">
            <div className="user-user-info">
              <div className="user-avatar">
                <User size={20} />
              </div>
              <div>
                <h1 className="user-dashboard-title">
                  Welcome back, {userName}
                </h1>
                <p className="user-dashboard-subtext">
                  Manage your consumer legal queries and track their status.
                </p>
              </div>
            </div>
          </div>

          <div className="user-quick-actions">
            {!showForm && (
              <button
                className="user-primary-btn"
                onClick={() => setShowForm(true)}
              >
                <Plus size={18} /> Submit New Query
              </button>
            )}
            <button className="user-outline-btn">View Saved Topics</button>
            <button className="user-outline-btn">Track Ongoing Cases</button>
          </div>

          {showForm && <AskQueryForm onClose={() => setShowForm(false)} onSuccess={fetchDashboard}/>}

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
                <p>{queries.filter((q) => q.status !== "Resolved").length}</p>
              </div>
            </div>

            <div className="user-stat-card">
              <CheckCircle size={25} color="rgba(34, 197, 94)" />
              <div>
                <h3>Resolved</h3>
                <p>{queries.filter((q) => q.status === "Resolved").length}</p>
              </div>
            </div>
          </div>

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

          <div className="user-table-wrapper">
            <table className="user-queries-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredQueries.map((query) => (
                  <tr key={query.id}>
                    <td>{query.title}</td>
                    <td>{query.category}</td>
                    <td>{new Date(query.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span
                        className={`user-status-badge ${getStatusClass(
                          query.status,
                        )}`}
                      >
                        {query.status}
                      </span>
                    </td>
                    <td>
                      <button className="user-view-btn">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
              <button className="user-outline-btn user-small-btn">
                View Profile
              </button>
            </div>

            <div className="user-profile-card user-side-card">
              <h3>Saved Topics</h3>
              <ul>
                {savedTopics.map((topic, index) => (
                  <li key={index}>{topic}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="user-dashboard-disclaimer">
            ⚖️ LawAssist provides legal information and query management
            support. It does not replace professional legal advice.
          </div>
        </div>

        <button className="user-floating-btn">
          <Plus size={22} />
        </button>
      </div>
      <BackToTopButton />
      <Footer />
    </>
  );
};

export default UserDashboard;
