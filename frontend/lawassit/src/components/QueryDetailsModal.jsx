import React from "react";
import axios from "axios";

const QueryDetailsModal = ({ query, onClose, refreshQueries }) => {
  const token = localStorage.getItem("token");

  const handleResolve = async () => {
    try {
      await axios.patch(
        `https://law-assist.onrender.com/api/queries/${query._id}/resolve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      refreshQueries();
      onClose();
    } catch (error) {
      console.log(error);
      alert("Failed to mark query as resolved.");
    }
  };

  const handleConsult = async () => {
    try {
      await axios.patch(
        `https://law-assist.onrender.com/api/queries/${query._id}/consult`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      refreshQueries();
      onClose();
    } catch (error) {
      console.log(error);
      alert("Failed to request consultation.");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://law-assist.onrender.com/api/queries/${query._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
                query.status
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
          {query.status === "Answered" && (
            <>
              <button className="view-resolve-btn" onClick={handleResolve}>
                Mark as Resolved
              </button>

              <button className="view-consult-btn" onClick={handleConsult}>
                Consult Legal Expert
              </button>
            </>
          )}

          <button className="view-delete-btn" onClick={handleDelete}>
            Delete Query
          </button>
        </div>
      </div>
    </div>
  );
};

export default QueryDetailsModal;