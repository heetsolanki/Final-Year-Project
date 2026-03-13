import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../api";
import { jwtDecode } from "jwt-decode";
import AlertPopup from "./AlertPopup";
import { getStatusClass } from "../data";

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

  const decoded = token ? jwtDecode(token) : null;
  const userRole = decoded?.role;

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
    if (expert?.verificationStatus !== "verified") {
      alert("Complete your expert profile before accepting cases.");
      return;
    }

    try {
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
      alert("Case already taken by another expert");
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
      alert("Failed to mark query as resolved.");
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
      alert("Failed to submit answer");
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
      alert("Failed to delete query.");
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
          {query.status === "In Review" && userRole === "legalExpert" && (
            <>
              {expert?.verificationStatus !== "verified" && (
                <p className="text-sm text-red-500 mt-3">
                  Complete your expert profile to accept cases.
                </p>
              )}

              {expert?.verificationStatus === "verified" && !isActive && (
                <p className="text-sm text-red-500 mt-3">
                  Activate your profile to accept cases.
                </p>
              )}

              <button
                disabled={
                  expert?.verificationStatus !== "verified" || !isActive
                }
                className={`mt-4 px-4 py-2 text-sm font-medium rounded-lg transition
      ${
        expert?.verificationStatus !== "verified" || !isActive
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-emerald-600 text-white hover:bg-emerald-700"
      }`}
                onClick={handleAcceptCase}
              >
                Accept Case
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

          {userRole === "consumer" && query.status === "In Review" && (
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
          title="Success"
          message="Case accepted successfully!"
          onClose={() => setShowSuccessPopup(false)}
        />
      </div>
    </div>
  );
};

export default QueryDetailsModal;
