import React, { useState, useEffect } from "react";
import axios from "axios";
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

  const fetchQueries = async () => {
    try {
      const res = await axios.get("https://law-assist.onrender.com/api/queries/public");
      setQueries(res.data || []);
    } catch (error) {
      console.log(error);
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
                      className={`status-badge ${
                        query.status === "Resolved" ? "answered" : "open"
                      }`}
                    >
                      {query.status || "Open"}
                    </span>
                  </div>

                  <p className="query-description">{query.description}</p>

                  <div className="query-footer">
                    <span>0 Answers</span>
                    <button className="secondary-btn">View Details</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <BackToTopButton />
      <Footer />
    </>
  );
};

export default Queries;
