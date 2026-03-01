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
    anonymous: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
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
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Query submitted successfully!");

      // Reset form
      setFormData({
        title: "",
        category: "",
        description: "",
        anonymous: false,
      });

      // Close modal
      if (onClose) onClose();

      // Refresh parent if provided
      if (onSuccess) onSuccess();
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

        <div className="checkbox-row">
          <input
            type="checkbox"
            name="anonymous"
            checked={formData.anonymous}
            onChange={handleChange}
          />
          <label>Post this question anonymously</label>
        </div>

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? "Posting..." : "Post Question"}
        </button>
      </form>
    </div>
  );
};

export default AskQueryForm;
