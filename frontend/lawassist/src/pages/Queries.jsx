import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AskQueryForm from "../components/AskQueryForm";
import BackToTopButton from "../components/BackToTopButton";
import "../styles/queries.css";

const categories = [
  "All",
  "Banking",
  "E-Commerce",
  "Insurance",
  "Real Estate",
  "Telecom",
  "Travel",
  "Education",
  "Medical",
  "Others",
];

const Queries = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [queries, setQueries] = useState([]);
  const [activeTab, setActiveTab] = useState("details");
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
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
      const res = await axios.get(
        "https://law-assist.onrender.com/api/queries/public",
      );
      setQueries(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAcceptCase = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `http://localhost:5000/api/expert/accept/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Case accepted successfully");

      fetchQueries();
    } catch (error) {
      console.log(error);
      alert("Case already taken by another expert");
    }
  };

  useEffect(() => {
    fetchQueries();

    const interval = setInterval(() => {
      fetchQueries();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
              <button className="primary-btn" onClick={() => setShowForm(true)}>
                + Ask a Question
              </button>
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
                <div className="answers-section">
                  {selectedQuery.answers && selectedQuery.answers.length > 0 ? (
                    selectedQuery.answers.map((answer, index) => (
                      <div key={index} className="answer-card">
                        <div className="expert-info">
                          <h4>{answer.expertName}</h4>
                          <p className="expert-speciality">
                            {answer.speciality}
                          </p>
                        </div>

                        <div className="expert-answer">{answer.response}</div>
                      </div>
                    ))
                  ) : (
                    <p className="no-answers-text">
                      No expert has responded yet.
                    </p>
                  )}
                </div>
              )}
              {selectedQuery.status === "In Review" &&
                userRole === "legalExpert" && (
                  <button
                    className="mt-4 px-4 py-2 text-sm font-medium rounded-lg transition bg-emerald-600 text-white hover:bg-emerald-700"
                    onClick={() => handleAcceptCase(selectedQuery._id)}
                  >
                    Accept Case
                  </button>
                )}
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
