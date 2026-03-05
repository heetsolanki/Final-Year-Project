import React from "react";
import {
  FolderOpen,
  Clock,
  CheckCircle,
  Bell,
  User,
} from "lucide-react";
import "../styles/legalExpertDashboard.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackToTopButton from "../components/BackToTopButton";

const LegalExpertDashboard = () => {
  return (
    <>
      <Navbar />

      <div className="expert-dashboard-wrapper">
  <div className="expert-dashboard-container">

    <div className="expert-dashboard-header">
      <h1 className="expert-dashboard-title">
        Welcome back, Advocate Heet
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
          <p>12</p>
        </div>
      </div>

      <div className="expert-stat-card">
        <Clock className="text-yellow-500" />
        <div>
          <h3>Pending Replies</h3>
          <p>5</p>
        </div>
      </div>

      <div className="expert-stat-card">
        <CheckCircle className="text-green-600" />
        <div>
          <h3>Resolved Cases</h3>
          <p>24</p>
        </div>
      </div>

      <div className="expert-stat-card">
        <Bell className="text-red-500" />
        <div>
          <h3>New Queries Today</h3>
          <p>3</p>
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

                <tr>
                  <td>#1023</td>
                  <td>Rohan Mehta</td>
                  <td>E-Commerce</td>
                  <td>25 Feb 2026</td>
                  <td>
                    <span className="expert-status-badge expert-status-new">New</span>
                  </td>
                  <td>
                    <button className="expert-view-btn">
                       View
                    </button>
                  </td>
                </tr>

                <tr>
                  <td>#1018</td>
                  <td>Priya Sharma</td>
                  <td>Banking</td>
                  <td>23 Feb 2026</td>
                  <td>
                    <span className="expert-status-badge expert-status-progress">In Progress</span>
                  </td>
                  <td>
                    <button className="expert-view-btn">
                       View
                    </button>
                  </td>
                </tr>

                <tr>
                  <td>#1009</td>
                  <td>Amit Patel</td>
                  <td>Insurance</td>
                  <td>20 Feb 2026</td>
                  <td>
                    <span className="expert-status-badge expert-status-resolved">Resolved</span>
                  </td>
                  <td>
                    <button className="expert-view-btn">
                       View
                    </button>
                  </td>
                </tr>

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
              <p><strong>Name:</strong> Heet Solanki</p>
              <p><strong>Specialization:</strong> Consumer Protection Law</p>
              <p><strong>Experience:</strong> 7 Years</p>
              <button className="expert-outline-btn small">
                Edit Profile
              </button>
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
      <BackToTopButton />
      <Footer />
    </>
  );
};

export default LegalExpertDashboard;