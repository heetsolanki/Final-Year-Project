import { ClipboardList, CheckCircle, Clock, XCircle, Circle, Edit3, X } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import API_URL from "../../../api";
import AlertPopup from "../../ui/AlertPopup";

const STEPS = ["Pending", "In Review", "Assigned", "Answered", "Resolved"];
const STEP_INDEX = { Pending: 0, "In Review": 1, Assigned: 2, Answered: 3, Resolved: 4 };

const ReAppealModal = ({ query, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: query.title,
    description: query.description,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      setError("Title and description are required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/api/queries/re-appeal/${query._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to re-submit query");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="global-modal-overlay">
      <div className="global-modal-panel w-full max-w-lg p-6 animate-fadeInScale">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-800">Edit & Re-Appeal Query</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Modify your query and submit it again for admin review.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Query Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Enter query title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
              placeholder="Describe your issue in detail"
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs text-amber-700">
              <span className="font-medium">Note:</span> Category and subcategory cannot be changed.
              Please ensure your updated query follows our guidelines to avoid another rejection.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Re-Submit for Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const QueryTrackCard = ({ query, onReAppeal }) => {
  const isRejected = query.status === "Rejected";
  const currentIndex = STEP_INDEX[query.status] ?? -1;

  if (isRejected) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-all duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-gray-800 truncate">
              {query.title}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {query.category} &middot;{" "}
              {new Date(query.createdAt).toLocaleDateString()}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Rejected
          </span>
        </div>

        {/* Rejected path: Pending → Rejected */}
        <div className="flex items-center gap-0">
          {/* Pending step */}
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
              <CheckCircle size={14} className="text-gray-500" />
            </div>
            <span className="text-[10px] text-gray-500 mt-1">Pending</span>
          </div>
          {/* Line */}
          <div className="flex-1 h-0.5 bg-red-300 mx-1" />
          {/* Rejected step */}
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle size={14} className="text-red-600" />
            </div>
            <span className="text-[10px] text-red-600 font-medium mt-1">
              Rejected
            </span>
          </div>
        </div>

        {query.rejectionReason && (
          <div className="mt-3 rounded-lg bg-red-50 border border-red-100 p-3">
            <p className="text-xs text-red-700">
              <span className="font-medium">Reason:</span>{" "}
              {query.rejectionReason}
            </p>
          </div>
        )}

        {/* Edit & Re-Appeal Button */}
        <button
          onClick={() => onReAppeal(query)}
          className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition"
        >
          <Edit3 size={14} />
          Edit & Re-Appeal
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-gray-800 truncate">
            {query.title}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {query.category} &middot;{" "}
            {new Date(query.createdAt).toLocaleDateString()}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
            currentIndex === 4
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/20"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              currentIndex === 4 ? "bg-green-500" : "bg-[#C9A227]"
            }`}
          />
          {query.status}
        </span>
      </div>

      {/* Step tracker */}
      <div className="flex items-center">
        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isFuture = idx > currentIndex;

          return (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              {/* Step dot */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? "bg-green-100"
                      : isCurrent
                        ? "bg-[#C9A227]/20 ring-2 ring-[#C9A227]/30"
                        : "bg-gray-100"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle size={14} className="text-green-600" />
                  ) : isCurrent ? (
                    <Circle
                      size={10}
                      className="text-[#C9A227] fill-[#C9A227]"
                    />
                  ) : (
                    <Circle size={10} className="text-gray-300" />
                  )}
                </div>
                <span
                  className={`text-[10px] mt-1 whitespace-nowrap ${
                    isCompleted
                      ? "text-green-600 font-medium"
                      : isCurrent
                        ? "text-[#C9A227] font-semibold"
                        : "text-gray-400"
                  }`}
                >
                  {step}
                </span>
              </div>

              {/* Connecting line */}
              {idx < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-1 transition-all duration-300 ${
                    idx < currentIndex ? "bg-green-300" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const QueryTrackTab = ({ queries, refreshQueries }) => {
  const [filter, setFilter] = useState("All");
  const [reAppealQuery, setReAppealQuery] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const STATUS_FILTERS = ["All", "Pending", "In Review", "Assigned", "Answered", "Resolved", "Rejected"];

  const filteredQueries = queries.filter((q) => {
    if (filter === "All") return true;
    return q.status === filter;
  });

  const handleReAppealSuccess = () => {
    setReAppealQuery(null);
    setShowSuccessPopup(true);
    if (refreshQueries) refreshQueries();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 rounded-xl">
            <ClipboardList size={20} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Track Your Queries
            </h2>
            <p className="text-xs text-gray-400">
              {filteredQueries.length} of {queries.length}{" "}
              {queries.length === 1 ? "query" : "queries"}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                filter === status
                  ? status === "Rejected"
                    ? "bg-red-50 text-red-700 border-red-200 shadow-sm"
                    : "bg-blue-50 text-blue-700 border-blue-200 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Query List */}
        {filteredQueries.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-gray-400">
            <ClipboardList size={36} className="mb-3 text-gray-300" />
            <p className="text-sm">No queries to track</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQueries.map((query) => (
              <QueryTrackCard
                key={query._id}
                query={query}
                onReAppeal={setReAppealQuery}
              />
            ))}
          </div>
        )}
      </div>

      {/* Re-Appeal Modal */}
      {reAppealQuery && (
        <ReAppealModal
          query={reAppealQuery}
          onClose={() => setReAppealQuery(null)}
          onSuccess={handleReAppealSuccess}
        />
      )}

      {/* Success Popup */}
      <AlertPopup
        show={showSuccessPopup}
        type="success"
        title="Query Re-Submitted"
        description="Your query has been re-submitted and is pending admin review."
        onClose={() => setShowSuccessPopup(false)}
      />
    </div>
  );
};

export default QueryTrackTab;
