import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import API_URL from "../api";
import {
  FolderOpen,
  Clock,
  CheckCircle,
  Bell,
  User,
  BadgeCheck,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import QueryDetailsModal from "../components/QueryDetailsModal";
import BackToTopButton from "../components/BackToTopButton";
import { getStatusClass } from "../data";

const LegalExpertDashboard = () => {
  const [expert, setExpert] = useState({});
  const [stats, setStats] = useState({});
  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [isActive, setIsActive] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

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
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
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

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-14 px-4 pt-36 max-md:px-3 max-md:pt-28">
        <div className="expert-dashboard-container">
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

          {/* HEADER */}
          <div className="mb-12">
            <h1 className="text-2xl max-md:text-xl font-bold text-[#1E3A8A]">
              Welcome back, {expert.name || "Advocate"}
            </h1>
            <p className="text-gray-500 text-sm max-md:text-xs mt-1">
              Manage and respond to assigned consumer complaints efficiently.
            </p>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="expert-stat-card expert-stat-card-1">
              <FolderOpen className="text-blue-600" />
              <div>
                <h3 className="text-sm text-gray-500">Assigned Cases</h3>
                <p className="text-2xl max-[480px]:text-xl font-bold text-[#1E3A8A]">
                  {stats.assignedQueries || 0}
                </p>
              </div>
            </div>

            <div className="expert-stat-card expert-stat-card-2">
              <Clock className="text-yellow-500" />
              <div>
                <h3 className="text-sm text-gray-500">Pending Replies</h3>
                <p className="text-2xl max-[480px]:text-xl font-bold text-[#1E3A8A]">
                  {stats.pendingQueries || 0}
                </p>
              </div>
            </div>

            <div className="expert-stat-card expert-stat-card-3">
              <CheckCircle className="text-green-600" />
              <div>
                <h3 className="text-sm text-gray-500">Resolved Cases</h3>
                <p className="text-2xl max-[480px]:text-xl font-bold text-[#1E3A8A]">
                  {stats.resolvedQueries || 0}
                </p>
              </div>
            </div>

            <div className="expert-stat-card expert-stat-card-4">
              <Bell className="text-red-500" />
              <div>
                <h3 className="text-sm text-gray-500">New Queries Today</h3>
                <p className="text-2xl max-[480px]:text-xl font-bold text-[#1E3A8A]">
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

          {/* TABLE */}
          <div className="overflow-x-auto rounded-2xl border border-gray-100 transition duration-300 hover:shadow-md">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="p-4 max-md:p-3 text-sm max-md:text-sm text-gray-500 border-b bg-gray-50">
                    Case ID
                  </th>
                  <th className="p-4 max-md:p-3 text-sm max-md:text-sm text-gray-500 border-b bg-gray-50">
                    Consumer
                  </th>
                  <th className="p-4 max-md:p-3 text-sm max-md:text-sm text-gray-500 border-b bg-gray-50">
                    Category
                  </th>
                  <th className="p-4 max-md:p-3 text-sm max-md:text-sm text-gray-500 border-b bg-gray-50">
                    Date
                  </th>
                  <th className="p-4 max-md:p-3 text-sm max-md:text-sm text-gray-500 border-b bg-gray-50">
                    Status
                  </th>
                  <th className="p-4 max-md:p-3 text-sm max-md:text-sm text-gray-500 border-b bg-gray-50">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {queries
                  .filter((query) => query.expertId === expert.userId)
                  .map((query) => (
                    <tr
                      key={query._id}
                      className="transition duration-200 hover:bg-gray-50"
                    >
                      <td className="p-4 max-md:p-3 text-sm max-md:text-sm text-gray-700 border-b transition duration-200">
                        {query._id.slice(-5)}
                      </td>
                      <td className="p-4 max-md:p-3 text-sm max-md:text-sm text-gray-700 border-b transition duration-200">
                        {query.userId}
                      </td>
                      <td className="p-4 max-md:p-3 text-sm max-md:text-sm text-gray-700 border-b transition duration-200">
                        {query.category}
                      </td>
                      <td className="p-4 max-md:p-3 text-sm max-md:text-sm text-gray-700 border-b transition duration-200">
                        {new Date(query.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 max-md:p-3 text-sm max-md:text-sm text-gray-700 border-b transition duration-200">
                        <span
                          className={`expert-status-badge ${getStatusClass(query.status)}`}
                        >
                          {query.status}
                        </span>
                      </td>
                      <td className="p-4 max-md:p-3 text-sm max-md:text-sm text-gray-700 border-b transition duration-200">
                        <button
                          className={`text-sm font-medium text-[#1E3A8A] transition duration-300 hover:text-[#D4AF37] hover:underline ${
                            expert.verificationStatus !== "verified" ||
                            !isActive
                              ? "cursor-not-allowed opacity-50"
                              : ""
                          }`}
                          disabled={
                            expert.verificationStatus !== "verified" ||
                            !isActive
                          }
                          onClick={() => {
                            if (!isActive) return;
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

          {/* SIDE PANEL */}
          <div className="mt-12 flex gap-6 justify-between flex-wrap max-lg:flex-col">
            {/* Profile Card */}
            <div className="expert-side-card profile">
              <h3 className="text-lg font-semibold text-[#1E3A8A] mb-3 flex items-center gap-2">
                <User size={18} /> Advocate Profile
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                <strong>Name:</strong> {expert.name || "Loading..."}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                <strong>Email:</strong> {expert.email || "Loading..."}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                <strong>Specialization:</strong>{" "}
                {expert.specialization || "N/A"}
              </p>
              <p className="mt-2 text-sm text-gray-500 mb-4">
                <strong>Verification:</strong>{" "}
                {expert.verificationStatus === "verified" ? (
                  <span className="font-semibold text-green-600">
                    <BadgeCheck size={16} className="inline mr-1" />
                    Verified
                  </span>
                ) : expert.verificationStatus === "pending" ? (
                  <span className="font-semibold text-yellow-600">Pending</span>
                ) : (
                  <span className="font-semibold text-red-500">Incomplete</span>
                )}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Profile Completion:</strong>{" "}
                {expert.profileCompletion || 0}%
              </p>
              <div className="mt-3 h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-[#C9A227] transition-all duration-300"
                  style={{ width: `${expert.profileCompletion || 0}%` }}
                ></div>
              </div>
              <div className="mt-5 w-full flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Profile Status
                </span>

                <button
                  onClick={toggleExpertStatus}
                  className={`shrink-0 px-4 py-1.5 text-xs font-semibold rounded-full transition ${
                    isActive
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-red-100 text-red-700 hover:bg-red-200"
                  }`}
                >
                  {isActive ? "Active" : "Inactive"}
                </button>
              </div>
            </div>

            {/* Notifications */}
            <div className="expert-side-card">
              <h3 className="text-lg font-semibold text-[#1E3A8A] mb-3 flex items-center gap-2">
                Recent Notifications
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="transition duration-200 cursor-pointer hover:text-[#D4AF37]">
                  New case assigned (2 hours ago)
                </li>
                <li className="transition duration-200 cursor-pointer hover:text-[#D4AF37]">
                  Consumer replied to Case #1023
                </li>
                <li className="transition duration-200 cursor-pointer hover:text-[#D4AF37]">
                  Case #1018 marked resolved
                </li>
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
