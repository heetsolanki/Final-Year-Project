import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../api";
import AskQueryForm from "../components/queries/AskQueryForm";
import BackToTopButton from "../components/layout/BackToTopButton";
import QueryDetailsModal from "../components/queries/QueryDetailsModal";
import { getStatusClass } from "../data";

const Queries = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [queries, setQueries] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("All");

  const categories = [
    "All",
    "Shopping & Marketplace",
    "Health & Safety",
    "Digital & Telecom",
    "Financial Services",
    "Housing & Property",
    "Travel & Transport",
    "Utilities",
    "Education",
  ];

  const statuses = ["All", "In Review", "Assigned", "Answered", "Resolved"];

  const fetchQueries = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/queries/public`);
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

  const filteredQueries = queries.filter((query) => {
    const categoryMatch =
      selectedCategory === "All" || query.category === selectedCategory;

    const statusMatch =
      selectedStatus === "All" || query.status === selectedStatus;

    // Hide rejected queries from public view
    const notRejected = query.status !== "Rejected";

    return categoryMatch && statusMatch && notRejected;
  });

  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-28 sm:pt-32 lg:pt-40 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-6 px-2">
            <h1 className="section-title">Consumer Legal Forum</h1>
            <div className="section-underline"></div>
            <p className="section-subtitle">
              Browse public consumer queries answered by verified legal experts.
            </p>
          </div>

          {/* Ask Button */}
          {!showForm && (
            <div className="flex justify-center mb-6">
              <button
                className="bg-[#1E3A8A] hover:bg-blue-700 text-white font-medium w-full sm:w-auto py-2.5 px-6 rounded-lg transition"
                onClick={() => setShowForm(true)}
              >
                + Ask a Question
              </button>
            </div>
          )}

          {/* Form */}
          {showForm && (
            <AskQueryForm
              onClose={() => setShowForm(false)}
              onSuccess={fetchQueries}
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

          {/* Status Tabs */}
          <div className="flex justify-end mt-4">
            <div className="flex flex-wrap gap-2 w-full sm:w-[60%] justify-center lg:w-[40%] justify-end">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`text-xs sm:text-sm font-medium px-3.5 sm:px-4 py-1.5 rounded-md transition
                  ${
                    selectedStatus === status
                      ? getStatusClass(status)
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Queries List */}
          <div className="space-y-5 mt-6">
            {filteredQueries.length === 0 ? (
              <p style={{ textAlign: "center", marginTop: "20px" }}>
                No queries found.
              </p>
            ) : (
              filteredQueries.map((query) => (
                <div
                  key={query._id}
                  className="bg-white relative rounded-xl shadow-sm p-5 sm:p-6 lg:p-8 mb-6 transition hover:shadow-md sm:hover:shadow-lg"
                >
                  <div className="flex items-center flex-wrap justify-between mb-2">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 leading-snug">
                      {query.title}
                    </h3>
                    <span
                      className={`user-status-badge ${getStatusClass(query.status)}`}
                    >
                      {query.status || "Open"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    {query.description}
                  </p>

                  <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center text-sm text-gray-500">
                    <span>
                      {query.answeredBy?.name
                        ? `Answered by: ${query.answeredBy.name}`
                        : "Not answered yet"}
                    </span>

                    <button
                      className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-medium text-sm py-2 px-4 rounded-lg transition"
                      onClick={() => {
                        setSelectedQuery(query);
                        setShowViewModal(true);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showViewModal && selectedQuery && (
        <QueryDetailsModal
          query={selectedQuery}
          onClose={() => {
            setShowViewModal(false);
            setSelectedQuery(null);
          }}
          refreshQueries={fetchQueries}
        />
      )}
      <BackToTopButton />
    </>
  );
};

export default Queries;
