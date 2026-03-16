import { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../../../api";
import { Search, Eye, Trash2, FileSearch, Filter, CheckCircle, XCircle } from "lucide-react";
import QueryDetailsModal from "../../queries/QueryDetailsModal";
import AlertPopup from "../../ui/AlertPopup";
import { useConfirmModal } from "../../../context/ConfirmModalContext";

const STATUS_FILTERS = ["All", "Pending", "In Review", "Assigned", "Answered", "Resolved", "Rejected"];

const statusBadge = {
  Pending: "bg-orange-50 text-orange-700 border border-orange-200",
  "In Review": "user-status-pending",
  Assigned: "user-status-consult",
  Resolved: "user-status-resolved",
  Answered: "user-status-answered",
  Rejected: "bg-red-50 text-red-700 border border-red-200",
};

const statusDot = {
  Pending: "bg-orange-500",
  "In Review": "bg-yellow-500",
  Assigned: "bg-purple-500",
  Resolved: "bg-green-500",
  Answered: "bg-blue-500",
  Rejected: "bg-red-500",
};

const AdminQueriesTab = ({ refreshKey }) => {
  const [queries, setQueries] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // Modals
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [alertPopup, setAlertPopup] = useState({ show: false, title: "", message: "", type: "success" });
  const { openConfirmModal } = useConfirmModal();

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchQueries = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/queries/public`);
      setQueries(res.data);
    } catch (err) {
      console.error("Failed to fetch queries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, [refreshKey]);

  const handleDelete = async (queryId) => {
    if (!queryId) return;
    setActionLoading(`delete-${queryId}`);
    try {
      await axios.delete(`${API_URL}/api/admin/query/${queryId}`, { headers });
      fetchQueries();
    } catch (err) {
      console.error("Failed to delete query:", err);
      setAlertPopup({ show: true, title: "Error", message: "Failed to delete query.", type: "error" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleApprove = async (queryId) => {
    setActionLoading(`approve-${queryId}`);
    try {
      await axios.put(`${API_URL}/api/admin/query/approve/${queryId}`, {}, { headers });
      setAlertPopup({ show: true, title: "Query Approved", message: "Query has been approved and is now under review.", type: "success" });
      fetchQueries();
    } catch (err) {
      console.error("Failed to approve query:", err);
      setAlertPopup({ show: true, title: "Error", message: err.response?.data?.message || "Failed to approve query.", type: "error" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (queryId) => {
    if (!queryId) return;
    setActionLoading(`reject-${queryId}`);
    try {
      await axios.put(
        `${API_URL}/api/admin/query/reject/${queryId}`,
        { reason: "Rejected by admin" },
        { headers },
      );
      setAlertPopup({ show: true, title: "Query Rejected", message: "Query has been rejected and the user has been notified.", type: "success" });
      fetchQueries();
    } catch (err) {
      console.error("Failed to reject query:", err);
      setAlertPopup({ show: true, title: "Error", message: err.response?.data?.message || "Failed to reject query.", type: "error" });
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    if (!deleteConfirm) return;

    const queryId = deleteConfirm;

    openConfirmModal({
      title: "Delete Query?",
      description: "This will permanently remove the query from the platform. This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: () => handleDelete(queryId),
    });

    setDeleteConfirm(null);
  }, [deleteConfirm, openConfirmModal]);

  useEffect(() => {
    if (!rejectModal) return;

    const queryId = rejectModal;
    openConfirmModal({
      title: "Reject Query?",
      description: "This query will be rejected and sent back to the user.",
      confirmText: "Reject Query",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: () => handleReject(queryId),
    });

    setRejectModal(null);
  }, [rejectModal, openConfirmModal]);

  const categories = [
    "All",
    ...new Set(queries.map((q) => q.category).filter(Boolean)),
  ];

  const filtered = queries
    .filter((q) => {
      const matchesSearch =
        q.title?.toLowerCase().includes(search.toLowerCase()) ||
        q.category?.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "All" || q.status === filter;
      const matchesCategory =
        categoryFilter === "All" || q.category === categoryFilter;
      return matchesSearch && matchesFilter && matchesCategory;
    })
    .sort((a, b) => {
      if (a.status === "Rejected" && b.status !== "Rejected") return 1;
      if (a.status !== "Rejected" && b.status === "Rejected") return -1;
      return 0;
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-yellow-200 border-t-yellow-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-500 animate-pulse">
            Loading queries...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-yellow-50 rounded-xl">
            <FileSearch size={20} className="text-yellow-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Query Moderation
            </h2>
            <p className="text-xs text-gray-400">
              {filtered.length} of {queries.length} queries
            </p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3.5 py-2.5 bg-gray-50 hover:bg-white hover:border-gray-300 focus-within:bg-white focus-within:border-blue-300 focus-within:shadow-sm transition-all duration-200 w-full sm:max-w-sm">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by title or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="outline-none w-full text-sm bg-transparent"
            />
          </div>

          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3.5 py-2.5 bg-gray-50 hover:bg-white hover:border-gray-300 transition-all duration-200">
            <Filter size={14} className="text-gray-400 shrink-0" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="outline-none text-sm bg-transparent cursor-pointer"
            >
              {STATUS_FILTERS.map((s) => (
                <option key={s} value={s}>
                  {s === "All" ? "All Status" : s}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3.5 py-2.5 bg-gray-50 hover:bg-white hover:border-gray-300 transition-all duration-200">
            <Filter size={14} className="text-gray-400 shrink-0" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="outline-none text-sm bg-transparent cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === "All" ? "All Categories" : c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-16 text-gray-400"
                    >
                      <FileSearch
                        size={32}
                        className="mx-auto mb-2 text-gray-300"
                      />
                      <p className="text-sm">No queries found</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((query) => (
                    <tr
                      key={query._id}
                      className="hover:bg-gray-50/50 transition-colors duration-150"
                    >
                      <td className="px-5 py-4 font-medium text-gray-800">
                        {query.title}
                      </td>
                      <td className="px-5 py-4 text-gray-500">
                        {query.category}
                      </td>
                      <td className="px-5 py-4 text-gray-500">
                        {query.userId}
                      </td>
                      <td className="px-5 py-4 text-gray-500">
                        {new Date(query.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                            statusBadge[query.status] ||
                            "bg-gray-50 text-gray-600 border border-gray-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              statusDot[query.status] || "bg-gray-400"
                            }`}
                          />
                          {query.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {(() => {
                          const isApproving = actionLoading === `approve-${query._id}`;
                          const isRejecting = actionLoading === `reject-${query._id}`;
                          const isDeleting = actionLoading === `delete-${query._id}`;

                          return (
                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                          <button
                            onClick={() => setSelectedQuery(query)}
                            title="View Query"
                            className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 hover:text-blue-700 active:scale-95 transition-all duration-200"
                          >
                            <Eye size={16} />
                          </button>

                          {query.status === "Pending" && (
                            <>
                              <button
                                onClick={() => handleApprove(query._id)}
                                disabled={isApproving}
                                title={isApproving ? "Approving..." : "Approve Query"}
                                className="p-2 rounded-lg text-green-500 hover:bg-green-50 hover:text-green-700 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isApproving ? (
                                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <CheckCircle size={16} />
                                )}
                              </button>
                              <button
                                onClick={() => {
                                  setRejectModal(query._id);
                                }}
                                disabled={isRejecting}
                                title={isRejecting ? "Rejecting..." : "Reject Query"}
                                className="p-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isRejecting ? (
                                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <XCircle size={16} />
                                )}
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => setDeleteConfirm(query._id)}
                            disabled={isDeleting}
                            title={isDeleting ? "Deleting..." : "Delete Query"}
                            className="p-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isDeleting ? (
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                          );
                        })()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Query Details Modal */}
      {selectedQuery && (
        <QueryDetailsModal
          query={selectedQuery}
          onClose={() => setSelectedQuery(null)}
          refreshQueries={fetchQueries}
        />
      )}

      {/* Alert Popup */}
      <AlertPopup
        show={alertPopup.show}
        title={alertPopup.title}
        message={alertPopup.message}
        type={alertPopup.type}
        onClose={() => setAlertPopup({ show: false, title: "", message: "", type: "success" })}
      />
    </div>
  );
};

export default AdminQueriesTab;
