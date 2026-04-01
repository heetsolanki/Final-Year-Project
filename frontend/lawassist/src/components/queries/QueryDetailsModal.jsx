import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../../api";
import { jwtDecode } from "jwt-decode";
import AlertPopup from "../ui/AlertPopup";
import { getStatusClass } from "../../data";
import { useNavigate } from "react-router-dom";

const QueryDetailsModal = ({
  query,
  onClose,
  refreshQueries,
  openReviewModal,
}) => {
  const [answerText, setAnswerText] = useState("");
  const token = localStorage.getItem("token");
  const [showAnswerPopup, setShowAnswerPopup] = useState(false);
  const [expert, setExpert] = useState(null);
  const [isActive, setIsActive] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [acceptingCase, setAcceptingCase] = useState(false);
  const [errorPopup, setErrorPopup] = useState({ show: false, title: "", message: "" });
  const navigate = useNavigate();

  const decoded = token ? jwtDecode(token) : null;
  const userRole = decoded?.role;
  const currentUserId = decoded?.userId;
  const isQueryOwner = Boolean(query?.userId && currentUserId && query.userId === currentUserId);

  const fetchExpertProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_URL}/api/expert/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setExpert(res.data);
      setIsActive(res.data.isActive);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userRole === "legalExpert") {
      fetchExpertProfile();
    }
  }, [userRole]);

  // Auto-refresh query details every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (refreshQueries) {
        refreshQueries();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [refreshQueries]);

  const handleAcceptCase = async () => {
    if (expert?.verificationStatus !== "active") {
      setErrorPopup({ show: true, title: "Profile Incomplete", message: "Complete your expert profile before accepting cases." });
      return;
    }

    try {
      setAcceptingCase(true);
      const token = localStorage.getItem("token");

      await axios.patch(
        `${API_URL}/api/expert/accept/${query._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setShowSuccessPopup(true);

      if (refreshQueries) {
        refreshQueries();
      }
    } catch (error) {
      console.log(error);
      setAcceptingCase(false);
      setErrorPopup({ show: true, title: "Case Unavailable", message: "Case already taken by another expert." });
    }
  };

  const handleResolve = async () => {
    try {
      await axios.patch(
        `${API_URL}/api/users/resolve/${query._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      refreshQueries();

      if (openReviewModal) {
        openReviewModal(query);
      }

      onClose();
    } catch (error) {
      console.log(error);
      setErrorPopup({ show: true, title: "Error", message: "Failed to mark query as resolved." });
    }
  };

  const handleSubmitAnswer = async () => {
    try {
      await axios.post(
        `${API_URL}/api/expert/answer/${query._id}`,
        { answer: answerText },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setShowAnswerPopup(true);
      refreshQueries();
    } catch (error) {
      console.log(error);
      setErrorPopup({ show: true, title: "Error", message: "Failed to submit answer." });
    }
  };

  const handleExpertResolve = async () => {
    try {
      await axios.patch(
        `${API_URL}/api/expert/resolve/${query._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      refreshQueries();
      onClose();
    } catch (error) {
      console.log(error);
      setErrorPopup({ show: true, title: "Error", message: "Failed to mark query as resolved." });
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/api/queries/${query._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      refreshQueries();
      onClose();
    } catch (error) {
      console.log(error);
      setErrorPopup({ show: true, title: "Error", message: "Failed to delete query." });
    }
  };

  const handleAnswerPopupClose = () => {
    setShowAnswerPopup(false);
    onClose();
  };

  

  return (
    <div className="view-overlay">
      <div className="view-modal">
        <button className="view-close-btn" onClick={onClose}>
          ✕
        </button>

        <h2 className="view-title">Query Details</h2>

        <div className="view-content">
          <div className="view-item">
            <span>Title</span>
            <p>{query.title}</p>
          </div>

          <div className="view-item">
            <span>Category</span>
            <p>{query.category}</p>
          </div>

          <div className="view-item">
            <span>Subcategory</span>
            <p>{query.subcategory}</p>
          </div>

          <div className="view-item">
            <span>Status</span>
            <span
              className={`user-status-badge view-item-status ${getStatusClass(query.status)}`}
            >
              {query.status}
            </span>
          </div>

          <div className="view-item">
            <span>Date</span>
            <p>{new Date(query.createdAt).toLocaleDateString()}</p>
          </div>

          <div className="view-item">
            <span>Description</span>
            <p>{query.description}</p>
          </div>

          <div className="view-item view-answer">
            <span>Expert Answer</span>

            {query.answer ? (
              <>
                <p>{query.answer}</p>

                {query.answeredBy && (
                  <small>
                    Answered by: {query.answeredBy.name} (
                    {query.answeredBy.specialization})
                  </small>
                )}
              </>
            ) : (
              <p style={{ color: "#9ca3af" }}>
                No expert answer yet. Your query is under review.
              </p>
            )}
          </div>
          {userRole === "consumer" && query.status === "Resolved" && query.expertId && (
            <div className="mt-2 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
              <p className="text-sm text-blue-900">
                Not satisfied with the answer?{" "}
                <button
                  type="button"
                  onClick={() => navigate(`/payment?expertId=${encodeURIComponent(query.expertId)}`)}
                  className="font-semibold text-[#1E3A8A] underline hover:text-[#123A6F]"
                >
                  Consult Expert
                </button>
              </p>
            </div>
          )}
          {query.status === "In Review" && userRole === "legalExpert" && (
            <>
              {expert?.verificationStatus !== "active" && (
                <p className="text-sm text-red-500 mt-3">
                  Complete your expert profile to accept cases.
                </p>
              )}

              {expert?.verificationStatus === "active" && !isActive && (
                <p className="text-sm text-red-500 mt-3">
                  Activate your profile to accept cases.
                </p>
              )}

              <button
                disabled={
                  expert?.verificationStatus !== "active" || !isActive || acceptingCase
                }
                className={`mt-4 px-4 py-2 text-sm font-medium rounded-lg transition
      ${
        expert?.verificationStatus !== "active" || !isActive || acceptingCase
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-emerald-600 text-white hover:bg-emerald-700"
      }`}
                onClick={handleAcceptCase}
              >
                {acceptingCase ? "Accepting Case..." : "Accept Case"}
              </button>
            </>
          )}
        </div>

        <div className="view-actions">
          {userRole === "consumer" && query.status === "Answered" && (
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl"
              onClick={handleResolve}
            >
              Mark as Resolved
            </button>
          )}

          {userRole === "legalExpert" && query.status === "Answered" && (
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl"
              onClick={handleExpertResolve}
            >
              Mark as Resolved
            </button>
          )}

          {userRole === "consumer" && isQueryOwner && (query.status === "In Review" || query.status === "Pending") && (
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl"
              onClick={handleDelete}
            >
              Delete Query
            </button>
          )}
        </div>

        {query.status === "Assigned" && userRole === "legalExpert" && (
          <div className="mt-4">
            <textarea
              placeholder="Write your legal answer..."
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              className="w-full border rounded-lg p-3"
              rows="4"
            />

            <button
              onClick={handleSubmitAnswer}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Submit Answer
            </button>
          </div>
        )}

        <AlertPopup
          show={showAnswerPopup}
          title="Success"
          message="Answer submitted successfully!"
          onClose={handleAnswerPopupClose}
        />
        <AlertPopup
          show={showSuccessPopup}
          title="Case Accepted"
          message="Case accepted successfully! Redirecting to dashboard..."
          redirectTo="/legal-expert-dashboard"
          onClose={() => setShowSuccessPopup(false)}
        />
        <AlertPopup
          show={errorPopup.show}
          title={errorPopup.title}
          message={errorPopup.message}
          type="error"
          onClose={() => setErrorPopup({ show: false, title: "", message: "" })}
        />
      </div>
    </div>
  );
};

export default QueryDetailsModal;
