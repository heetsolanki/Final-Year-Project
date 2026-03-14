import DashboardCard from "../DashboardCard";
import { getStatusClass } from "../../../data";
import { Search, Eye, FileText } from "lucide-react";

const UserQueriesTab = ({
  queries,
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  setSelectedQuery,
  setShowViewModal,
  setSelectedQueryId,
  setShowDeleteModal,
}) => {
  const filteredQueries = queries?.filter((q) => {
    const matchesSearch = q.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === "All" || q.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardCard title="All Queries" icon={FileText}>
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        {/* Search */}
        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 flex-1 bg-white">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search queries..."
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
                <th className="py-2 pr-4">Title</th>
                <th className="py-2 pr-4">Category</th>
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-2"></th>
                <th className="py-2"></th>
              </tr>
            </thead>

            <tbody>
              {filteredQueries.map((query) => (
                <tr
                  key={query._id}
                  className="border-b last:border-none hover:bg-gray-50 transition"
                >
                  <td className="py-3 pr-4">{query.title}</td>

                  <td className="py-3 pr-4">{query.category}</td>

                  <td className="py-3 pr-4">
                    {new Date(query.createdAt).toLocaleDateString()}
                  </td>

                  <td className="py-3 pr-4">
                    <span
                      className={`user-status-badge ${getStatusClass(query.status)}`}
                    >
                      {query.status}
                    </span>
                  </td>

                  <td className="py-3 pr-2">
                    <button
                      onClick={() => {
                        setSelectedQuery(query);
                        setShowViewModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 transition"
                    >
                      <Eye size={18} />
                    </button>
                  </td>

                  <td className="py-3">
                    <button
                      onClick={() => {
                        setSelectedQueryId(query._id);
                        setShowDeleteModal(true);
                      }}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
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

export default UserQueriesTab;
