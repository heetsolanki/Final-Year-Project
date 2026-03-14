import DashboardCard from "../DashboardCard";
import StatsGrid from "../StatsGrid";
import { getStatusClass } from "../../../data";
import { Eye, LayoutDashboard, FolderOpen, Clock, CheckCircle } from "lucide-react";

const ExpertOverviewTab = ({
  queries,
  stats,
  expert,
  isActive,
  setSelectedQuery,
  setShowViewModal,
  setActiveTab,
}) => {
  const recentQueries = queries
    .filter((query) => query.expertId === expert.userId)
    .slice(0, 5);

  const statItems = [
    {
      title: "Assigned Cases",
      value: stats.assignedQueries || 0,
      icon: FolderOpen,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Pending Replies",
      value: stats.pendingQueries || 0,
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      title: "Resolved Cases",
      value: stats.resolvedQueries || 0,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <DashboardCard title="Case Summary" icon={LayoutDashboard}>
        <StatsGrid stats={statItems} />
      </DashboardCard>

      {/* Recent Assigned Queries */}
      <DashboardCard title="Recent Assigned Queries">
        {recentQueries.length === 0 ? (
          <p className="text-sm text-gray-500">
            No queries have been assigned to you yet.
          </p>
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
                {recentQueries.map((query) => (
                  <tr key={query._id} className="border-b last:border-none">
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

export default ExpertOverviewTab;