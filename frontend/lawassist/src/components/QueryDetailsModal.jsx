import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API = "https://law-assist.onrender.com/api";

const QueryDetailsModal = ({ query, onClose, refreshQueries }) => {
  const [answerText, setAnswerText] = useState("");
  const token = localStorage.getItem("token");

  let userRole = null;

  if (token) {
    const decoded = jwtDecode(token);
    userRole = decoded.role;
  }

  const handleResolve = async () => {
    try {
      await axios.patch(
        `${API}/expert/resolve/${query._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      refreshQueries();
      onClose();
    } catch (error) {
      console.log(error);
      alert("Failed to mark query as resolved.");
    }
  };

  const handleSubmitAnswer = async () => {
    try {
      await axios.post(
        `${API}/expert/answer/${query._id}`,
        { answer: answerText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Answer submitted successfully");

      refreshQueries();
      onClose();
    } catch (error) {
      console.log(error);
      alert("Failed to submit answer");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${API}/queries/${query._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      refreshQueries();
      onClose();
    } catch (error) {
      console.log(error);
      alert("Failed to delete query.");
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "user-status-pending";
      case "Answered":
        return "user-status-answered";
      case "Consultation Requested":
        return "user-status-consult";
      case "Resolved":
        return "user-status-resolved";
      default:
        return "user-status-default";
    }
  };

  return (
    <div className="view-overlay">
      <div className="view-modal">
        {/* Close button */}
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
            <span>Status</span>
            <span
              className={`user-status-badge view-item-status ${getStatusClass(
                query.status,
              )}`}
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

          {/* EXPERT ANSWER SECTION */}
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
        </div>

        {/* ACTION BUTTONS */}
        <div className="view-actions">
          {userRole === "legalExpert" && query.status === "Assigned" && (
            <button className="view-resolve-btn" onClick={handleResolve}>
              Mark as Resolved
            </button>
          )}

          {userRole === "consumer" && query.status === "In Review" && (
            <button className="view-delete-btn" onClick={handleDelete}>
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
                className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
              />

              <button
                onClick={handleSubmitAnswer}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Submit Answer
              </button>
            </div>
          )}
      </div>
    </div>
  );
};

export default QueryDetailsModal;
