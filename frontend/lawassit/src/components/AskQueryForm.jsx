import React from "react";

const AskQueryForm = ({ onClose }) => {
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

  return (
    <div className="query-card">
      <div className="form-header">
        <h2 className="form-title">Ask a Consumer Rights Question</h2>
        <button onClick={onClose} className="close-btn">
          ✕
        </button>
      </div>

      <p className="form-subtitle">
        Do not include personal details like phone number, order ID, or bank details.
      </p>

      <form className="query-form">
        <input
          type="text"
          placeholder="Enter question title"
          className="form-input"
          required
        />

        <select className="form-input" required>
          <option>Select Category</option>
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        <textarea
          rows="4"
          placeholder="Describe your issue in detail (100–1000 characters)"
          className="form-input"
          required
        ></textarea>

        <div className="checkbox-row">
          <input type="checkbox" />
          <label>Post this question anonymously</label>
        </div>

        <button type="submit" className="primary-btn">
          Post Question
        </button>
      </form>
    </div>
  );
};

export default AskQueryForm;