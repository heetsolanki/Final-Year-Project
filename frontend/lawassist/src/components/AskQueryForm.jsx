import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AlertPopup from "./AlertPopup";
import { categories } from "../data";

const AskQueryForm = ({
  onClose,
  onSuccess,
  defaultCategory = "",
  defaultSubcategory = "",
}) => {
  const [formData, setFormData] = useState({
    title: "",
    category: defaultCategory,
    subcategory: defaultSubcategory,
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const navigate = useNavigate();

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
        setShowLoginPopup(true);
        return;
      }
      await axios.post(
        "https://law-assist.onrender.com/api/queries",
        {
          title: formData.title,
          category: formData.category,
          subcategory: formData.subcategory,
          description: formData.description,
          status: "Pending",
          consultRequested: false,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setShowSuccessModal(true);
      setFormData({
        title: "",
        category: "",
        subcategory: "",
        description: "",
      });
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    setShowLoginPopup(false);
    navigate("/login");
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
          onChange={(e) =>
            setFormData({
              ...formData,
              category: e.target.value,
              subcategory: "",
            })
          }
          disabled={defaultCategory}
          required
        >
          <option value="">Select Category</option>
          {Object.keys(categories).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {formData.category && (
          <select
            name="subcategory"
            className="form-input"
            value={formData.subcategory}
            onChange={handleChange}
            disabled={defaultSubcategory}
            required
          >
            <option value="">Select Sub Category</option>
            {categories[formData.category].map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        )}

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

      <AlertPopup
        show={showSuccessModal}
        title="Query Submitted 🎉"
        message="Your query has been successfully submitted. You can track its progress from your dashboard."
        onClose={() => {
          setShowSuccessModal(false);
          if (onClose) onClose();
          if (onSuccess) onSuccess();
        }}
      />
      <AlertPopup
        show={showLoginPopup}
        title="Please Login"
        message="You need to be logged in to submit a query."
        onClose={handleLoginRedirect}
      />
    </div>
  );
};

export default AskQueryForm;
