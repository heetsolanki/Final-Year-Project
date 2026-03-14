import DashboardCard from "../DashboardCard";
import { getStatusClass } from "../../../data";
import { Search, Eye, FileText } from "lucide-react";

const ExpertQueriesTab = ({
  queries,
  expert,
  isActive,
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  setSelectedQuery,
  setShowViewModal,
}) => {
  const assignedQueries = queries.filter(
    (query) => query.expertId === expert.userId
  );

  const filteredQueries = assignedQueries.filter((q) => {
    const matchesSearch =
      q.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q._id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === "All" || q.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardCard title="Assigned Queries" icon={FileText}>
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        {/* Search */}
        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 flex-1 bg-white">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by case ID or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="outline-none text-sm flex-1"
          />
        </div>

        {/* Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="All">All</option>
          <option value="In Review">In Review</option>
          <option value="Assigned">Assigned</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {/* Table */}
      {filteredQueries.length === 0 ? (
        <p className="text-sm text-gray-500">No queries found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b text-gray-500">
              <tr className="text-left">
                <th className="py-2 pr-4">Case ID</th>
                <th className="py-2 pr-4">Consumer</th>
                <th className="py-2 pr-4">Category</th>
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-2"></th>
              </tr>
            </thead>

            <tbody>
              {filteredQueries.map((query) => (
                <tr
                  key={query._id}
                  className="border-b last:border-none hover:bg-gray-50 transition"
                >
                  <td className="py-3 pr-4">{query._id.slice(-5)}</td>
                  <td className="py-3 pr-4">{query.userId}</td>
                  <td className="py-3 pr-4">{query.category}</td>
                  <td className="py-3 pr-4">
                    {new Date(query.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`expert-status-badge ${getStatusClass(query.status)}`}
                    >
                      {query.status}
                    </span>
                  </td>
                  <td className="py-3 pr-2">
                    <button
                      className={`text-blue-600 hover:text-blue-800 transition ${
                        expert.verificationStatus !== "verified" || !isActive
                          ? "cursor-not-allowed opacity-50"
                          : ""
                      }`}
                      disabled={
                        expert.verificationStatus !== "verified" || !isActive
                      }
                      onClick={() => {
                        if (!isActive) return;
                        setSelectedQuery(query);
                        setShowViewModal(true);
                      }}
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardCard>
  );
};

export default ExpertQueriesTab;