import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../api";
import { jwtDecode } from "jwt-decode";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AskQueryForm from "../components/AskQueryForm";
import BackToTopButton from "../components/BackToTopButton";
import AlertPopup from "../components/AlertPopup";
import { getStatusClass } from "../data";

// const API = "https://law-assist.onrender.com/api";

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

  const categories = [
    "All",
    "Shopping & Marketplace",
    "Health & Safety",
    "Digital & Telecom",
    "Financial Services",
    "Housing & Property",
    "Travel & Transport",
    "Utilities",
    "Education",
  ];

  let userRole = null;

  if (token) {
    const decoded = jwtDecode(token);
    userRole = decoded.role;
  }

  const fetchQueries = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/queries/public`);
      setQueries(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchExpertProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_URL}/api/expert/profile`, {
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
        `${API_URL}/api/expert/accept/${id}`,
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

      <div className="min-h-screen bg-gray-50 pt-28 sm:pt-32 lg:pt-40 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-6 px-2">
            <h1 className="section-title">Consumer Legal Forum</h1>
            <div className="section-underline"></div>
            <p className="section-subtitle">
              Browse public consumer queries answered by verified legal experts.
            </p>
          </div>

          {/* Ask Button */}
          {!showForm && (
            <div className="flex justify-center mb-6">
              {userRole !== "legalExpert" && (
                <button
                  className="bg-[#1E3A8A] hover:bg-blue-700 text-white font-medium w-full sm:w-auto py-2.5 px-6 rounded-lg transition"
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
              onSuccess={fetchQueries}
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
          <div className="space-y-5 mt-6">
            {filteredQueries.length === 0 ? (
              <p style={{ textAlign: "center", marginTop: "20px" }}>
                No queries found.
              </p>
            ) : (
              filteredQueries.map((query) => (
                <div
                  key={query._id}
                  className="bg-white relative rounded-xl shadow-sm p-5 sm:p-6 lg:p-8 mb-6 transition hover:shadow-md sm:hover:shadow-lg"
                >
                  <div className="flex items-center flex-wrap justify-between mb-2">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 leading-snug">
                      {query.title}
                    </h3>
                    <span
                      className={`user-status-badge ${getStatusClass(query.status)}`}
                    >
                      {query.status || "Open"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    {query.description}
                  </p>

                  <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center text-sm text-gray-500">
                    <span>
                      {query.answeredBy?.name !== undefined
                        ? `Answered by: ${query.answeredBy.name}`
                        : "Not answered yet"}
                    </span>
                    <button
                      className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-medium text-sm py-2 px-4 rounded-lg transition"
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 sm:px-6">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 animate-[fadeInScale_0.25s_ease]">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 transition"
              onClick={() => {
                setShowViewModal(false);
                setSelectedQuery(null);
                setActiveTab("details");
              }}
            >
              ✕
            </button>

            <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-6">
              Query Overview
            </h2>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                className={`flex-1 text-sm sm:text-base py-2 font-medium text-gray-500 hover:text-blue-600 transition ${
                  activeTab === "details"
                    ? "bg-[#1E3A8A] rounded-lg text-white transition duration-300"
                    : ""
                }`}
                onClick={() => setActiveTab("details")}
              >
                Query Details
              </button>

              <button
                className={`flex-1 text-sm sm:text-base py-2 font-medium text-gray-500 hover:text-blue-600 transition ${
                  activeTab === "answers"
                    ? "bg-[#1E3A8A] rounded-lg text-white transition duration-300"
                    : ""
                }`}
                onClick={() => setActiveTab("answers")}
              >
                Expert Answers
              </button>
            </div>

            {/* Tab Content */}
            <div className="max-h-[60vh] overflow-y-auto pr-1">
              {/* QUERY DETAILS TAB */}
              {activeTab === "details" && (
                <div className="space-y-5 text-sm sm:text-base text-gray-700">
                  <div className="view-item">
                    <span>Title</span>
                    <p>{selectedQuery.title}</p>
                  </div>

                  <div className="view-item">
                    <span>Category</span>
                    <p>{selectedQuery.category}</p>
                  </div>

                  <div className="view-item">
                    <span>Subcategory</span>
                    <p>{selectedQuery.subcategory}</p>
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
                    <p
                      className="text-sm text-red-500 mt-3"
                      hidden={expert?.verificationStatus === "verified"}
                    >
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
