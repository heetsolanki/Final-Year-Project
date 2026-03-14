import DashboardCard from "../DashboardCard";
import StatsGrid from "../StatsGrid";
import { getStatusClass } from "../../../data";
import { Eye, LayoutDashboard } from "lucide-react";

const OverviewTab = ({
  queries,
  setSelectedQuery,
  setShowViewModal,
  setSelectedQueryId,
  setShowDeleteModal,
  setActiveTab,
}) => {
  const recentQueries = queries.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <DashboardCard title="Case Summary" icon={LayoutDashboard}>
        <StatsGrid queries={queries} />
      </DashboardCard>

      {/* Recent Queries */}
      <DashboardCard title="Recent Queries">
        {recentQueries.length === 0 ? (
          <p className="text-sm text-gray-500">
            You haven't submitted any queries yet.
          </p>
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
                {recentQueries.map((query) => (
                  <tr key={query._id} className="border-b last:border-none">
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
                        className="text-blue-600 hover:text-blue-800 transition"
                        onClick={() => {
                          setSelectedQuery(query);
                          setShowViewModal(true);
                        }}
                      >
                        <Eye size={18} />
                      </button>
                    </td>

                    <td className="py-3">
                      <button
                        className="text-red-500 hover:text-red-700 text-sm"
                        onClick={() => {
                          setSelectedQueryId(query._id);
                          setShowDeleteModal(true);
                        }}
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

        <div className="flex justify-end mt-4">
          <button
            onClick={() => setActiveTab("queries")}
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            View All Queries →
          </button>
        </div>
      </DashboardCard>
    </div>
  );
};

export default OverviewTab;
