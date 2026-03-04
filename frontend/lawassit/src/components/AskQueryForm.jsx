import React, { useState } from "react";
import axios from "axios";

const AskQueryForm = ({ onClose, onSuccess }) => {
  const categories = [
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

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        return;
      }

      await axios.post(
        "https://law-assist.onrender.com/api/queries",
        {
          title: formData.title,
          category: formData.category,
          description: formData.description,

          // NEW FIELDS FOR QUERY FLOW
          status: "Pending",
          consultRequested: false,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setShowSuccessModal(true);

      // Reset form
      setFormData({
        title: "",
        category: "",
        description: "",
      });
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="query-card">
      <div className="form-header">
        <h2 className="form-title">Ask a Consumer Rights Question</h2>
        <button onClick={onClose} className="close-btn">
          ✕
        </button>
      </div>

      <p className="form-subtitle">
        Do not include personal details like phone number, order ID, or bank
        details.
      </p>

      <form className="query-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Enter question title"
          className="form-input"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <select
          name="category"
          className="form-input"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        <textarea
          name="description"
          rows="4"
          placeholder="Describe your issue in detail (100–1000 characters)"
          className="form-input"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? "Posting..." : "Post Question"}
        </button>
      </form>

      {showSuccessModal && (
        <div className="success-overlay">
          <div className="success-modal">
            <h3 className="success-title">Query Submitted 🎉</h3>

            <p className="success-text">
              Your query has been successfully submitted. You can track its
              progress from your dashboard.
            </p>

            <button
              className="success-btn"
              onClick={() => {
                setShowSuccessModal(false);
                if (onClose) onClose();
                if (onSuccess) onSuccess();
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AskQueryForm;
