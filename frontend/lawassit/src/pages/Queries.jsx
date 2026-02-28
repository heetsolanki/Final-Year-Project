import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AskQueryForm from "../components/AskQueryForm";
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

  const sampleQueries = [
    {
      id: 1,
      title: "Refund not received for cancelled flight",
      category: "Travel",
      description:
        "My flight was cancelled 2 months ago and I still haven't received my refund.",
      status: "Open",
      answers: 0,
    },
    {
      id: 2,
      title: "Defective product delivered by online store",
      category: "E-Commerce",
      description:
        "Seller is refusing replacement or refund.",
      status: "Answered",
      answers: 2,
    },
  ];

  const filteredQueries =
    selectedCategory === "All"
      ? sampleQueries
      : sampleQueries.filter(
          (query) => query.category === selectedCategory
        );

  return (
    <>
      <Navbar />

      <div className="queries-wrapper">
        <div className="queries-container">

          {/* Section Heading */}
          <div className="queries-heading">
            <h1 className="section-title">Consumer Legal Forum</h1>
            <div className="section-underline"></div>
            <p className="section-subtitle">
              Browse public consumer queries answered by verified legal experts.
            </p>
          </div>

          {/* Ask Question Button */}
          {!showForm && (
            <div className="ask-btn-wrapper">
              <button
                className="primary-btn"
                onClick={() => setShowForm(true)}
              >
                + Ask a Question
              </button>
            </div>
          )}

          {/* Form Component */}
          {showForm && (
            <AskQueryForm onClose={() => setShowForm(false)} />
          )}

          {/* Sticky Category Tabs */}
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
            {filteredQueries.map((query) => (
              <div key={query.id} className="query-card hover-card">
                <div className="query-header">
                  <h3>{query.title}</h3>
                  <span
                    className={`status-badge ${
                      query.status === "Answered"
                        ? "answered"
                        : "open"
                    }`}
                  >
                    {query.status}
                  </span>
                </div>

                <p className="query-description">
                  {query.description}
                </p>

                <div className="query-footer">
                  <span>{query.answers} Answers</span>
                  <button className="secondary-btn">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default Queries;