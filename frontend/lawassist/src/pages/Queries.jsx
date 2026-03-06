import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AskQueryForm from "../components/AskQueryForm";
import BackToTopButton from "../components/BackToTopButton";
import AlertPopup from "../components/AlertPopup";
import "../styles/queries.css";
import { categories } from "../data";

const API = "https://law-assist.onrender.com/api";

const Queries = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [queries, setQueries] = useState([]);
  const [activeTab, setActiveTab] = useState("details");
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [expert, setExpert] = useState(null);
  const token = localStorage.getItem("token");

  let userRole = null;

  if (token) {
    const decoded = jwtDecode(token);
    userRole = decoded.role;
  }

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

  const fetchQueries = async () => {
    try {
      const res = await axios.get(`${API}/queries/public`);
      setQueries(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchExpertProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/expert/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setExpert(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAcceptCase = async (id) => {
    if (expert?.verificationStatus !== "verified") {
      alert("Complete your expert profile before accepting cases.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `${API}/expert/accept/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setShowSuccessPopup(true);

      fetchQueries();
    } catch (error) {
      console.log(error);
      alert("Case already taken by another expert");
    }
  };

  useEffect(() => {
    fetchQueries();

    if (userRole === "legalExpert") {
      fetchExpertProfile();
    }

    const interval = setInterval(() => {
      fetchQueries();
    }, 5000);

    return () => clearInterval(interval);
  }, [userRole]);

  const filteredQueries =
    selectedCategory === "All"
      ? queries
      : queries.filter((query) => query.category === selectedCategory);

  return (
    <>
      <Navbar />

      <div className="queries-wrapper">
        <div className="queries-container">
          {/* Heading */}
          <div className="queries-heading">
            <h1 className="section-title">Consumer Legal Forum</h1>
            <div className="section-underline"></div>
            <p className="section-subtitle">
              Browse public consumer queries answered by verified legal experts.
            </p>
          </div>

          {/* Ask Button */}
          {!showForm && (
            <div className="ask-btn-wrapper">
              {userRole !== "legalExpert" && (
                <button
                  className="primary-btn"
                  onClick={() => setShowForm(true)}
                >
                  + Ask a Question
                </button>
              )}
            </div>
          )}

          {/* Form */}
          {showForm && (
            <AskQueryForm
              onClose={() => setShowForm(false)}
              onSuccess={fetchQueries} // 🔥 auto refresh
            />
          )}

          {/* Category Tabs */}
          <div className="tabs-container">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`tab-item ${
                  selectedCategory === cat ? "active-tab" : ""
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Queries List */}
          <div className="queries-list">
            {filteredQueries.length === 0 ? (
              <p style={{ textAlign: "center", marginTop: "20px" }}>
                No queries found.
              </p>
            ) : (
              filteredQueries.map((query) => (
                <div key={query._id} className="query-card hover-card">
                  <div className="query-header">
                    <h3>{query.title}</h3>
                    <span
                      className={`status-badge view-item-status ${
                        query.status === "Resolved" ? "answered" : "open"
                      }`}
                    >
                      {query.status || "Open"}
                    </span>
                  </div>

                  <p className="query-description">{query.description}</p>

                  <div className="query-footer">
                    <span>0 Answers</span>
                    <button
                      className="secondary-btn"
                      onClick={() => {
                        setSelectedQuery(query);
                        setShowViewModal(true);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {showViewModal && selectedQuery && (
        <div className="view-overlay">
          <div className="view-modal">
            {/* Close Button */}
            <button
              className="view-close-btn"
              onClick={() => {
                setShowViewModal(false);
                setSelectedQuery(null);
                setActiveTab("details");
              }}
            >
              ✕
            </button>

            <h2 className="view-title">Query Overview</h2>

            {/* Tabs */}
            <div className="view-tabs">
              <button
                className={`view-tab-btn ${
                  activeTab === "details" ? "query-active-tab" : ""
                }`}
                onClick={() => setActiveTab("details")}
              >
                Query Details
              </button>

              <button
                className={`view-tab-btn ${
                  activeTab === "answers" ? "query-active-tab" : ""
                }`}
                onClick={() => setActiveTab("answers")}
              >
                Expert Answers
              </button>
            </div>

            {/* Tab Content */}
            <div className="view-tab-content">
              {/* QUERY DETAILS TAB */}
              {activeTab === "details" && (
                <div className="view-content">
                  <div className="view-item">
                    <span>Title</span>
                    <p>{selectedQuery.title}</p>
                  </div>

                  <div className="view-item">
                    <span>Category</span>
                    <p>{selectedQuery.category}</p>
                  </div>

                  <div className="view-item">
                    <span>Status</span>
                    <span
                      className={`user-status-badge view-item-status ${getStatusClass(
                        selectedQuery.status,
                      )}`}
                    >
                      {selectedQuery.status}
                    </span>
                  </div>

                  <div className="view-item">
                    <span>Description</span>
                    <p>{selectedQuery.description}</p>
                  </div>
                </div>
              )}

              {/* ANSWERS TAB */}
              {activeTab === "answers" && (
                <div className="mt-5">
                  {selectedQuery.answer ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                      {/* Expert Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-base font-semibold text-gray-900">
                            {selectedQuery.answeredBy?.name || "Legal Expert"}
                          </h4>

                          <p className="text-sm text-gray-500">
                            {selectedQuery.answeredBy?.specialization ||
                              "Consumer Law"}
                          </p>
                        </div>

                        <span className="text-xs font-medium px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
                          Verified Expert
                        </span>
                      </div>

                      {/* Answer Text */}
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {selectedQuery.answer}
                      </p>
                    </div>
                  ) : (
                    <p className="text-center text-gray-400 text-sm py-6">
                      No expert has responded yet.
                    </p>
                  )}
                </div>
              )}
              {selectedQuery.status === "In Review" &&
                userRole === "legalExpert" && (
                  <>
                    <p className="text-sm text-red-500 mt-3" hidden={expert?.verificationStatus === "verified"}>
                      Complete your expert profile to accept cases.
                    </p>
                    <button
                      disabled={expert?.verificationStatus !== "verified"}
                      className={`mt-4 px-4 py-2 text-sm font-medium rounded-lg transition 
  ${
    expert?.verificationStatus !== "verified"
      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
      : "bg-emerald-600 text-white hover:bg-emerald-700"
  }`}
                      onClick={() => handleAcceptCase(selectedQuery._id)}
                    >
                      Accept Case
                    </button>
                  </>
                )}
              <AlertPopup
                show={showSuccessPopup}
                title="Success"
                message="Case accepted successfully!"
                onClose={() => setShowSuccessPopup(false)}
              />
            </div>
          </div>
        </div>
      )}

      <BackToTopButton />
      <Footer />
    </>
  );
};

export default Queries;
