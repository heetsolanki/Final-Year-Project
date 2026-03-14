import { FolderOpen, FileText, CheckCircle } from "lucide-react";

const StatsGrid = ({ queries }) => {
  const totalCases = queries.length;
  const activeCases = queries.filter((q) => q.status !== "Resolved").length;
  const resolvedCases = queries.filter((q) => q.status === "Resolved").length;

  const stats = [
    {
      title: "Total Cases",
      value: totalCases,
      icon: FolderOpen,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Active Cases",
      value: activeCases,
      icon: FileText,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      title: "Resolved",
      value: resolvedCases,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <div
            key={index}
            className="flex items-center gap-4 p-4 sm:p-5 rounded-xl border border-gray-200 bg-white
            transition md:hover:shadow-md"
          >
            <div className={`p-3 rounded-lg ${stat.bg}`}>
              <Icon size={22} className={stat.color} />
            </div>

            <div>
              <p className="text-sm text-gray-500">{stat.title}</p>

              <p className="text-xl font-semibold text-gray-800">
                {stat.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsGrid;
