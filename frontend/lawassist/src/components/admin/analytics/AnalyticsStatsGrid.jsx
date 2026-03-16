import {
  Users,
  BadgeCheck,
  FileText,
  MessageSquare,
  Wallet,
} from "lucide-react";

const STAT_CONFIG = [
  {
    key: "users",
    label: "Total Users",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    hoverBorder: "hover:border-blue-400",
  },
  {
    key: "experts",
    label: "Total Experts",
    icon: BadgeCheck,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    hoverBorder: "hover:border-purple-400",
  },
  {
    key: "queries",
    label: "Total Queries",
    icon: FileText,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    hoverBorder: "hover:border-yellow-400",
  },
  {
    key: "consultations",
    label: "Total Consultations",
    icon: MessageSquare,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    hoverBorder: "hover:border-green-400",
  },
  {
    key: "payments",
    label: "Total Payments",
    icon: Wallet,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    hoverBorder: "hover:border-red-400",
  },
];

const AnalyticsStatsGrid = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {STAT_CONFIG.map((card) => {
        const Icon = card.icon;
        const value = stats?.[card.key] ?? 0;

        return (
          <div
            key={card.key}
            className={`group bg-gray-50 rounded-xl border ${card.border} ${card.hoverBorder} p-5 hover:shadow-md hover:-translate-y-0.5 hover:bg-white transition-all duration-200 cursor-default`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1 group-hover:text-gray-600 transition-colors duration-200">
                  {card.label}
                </p>
                <p className="text-3xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-200">
                  {value}
                </p>
              </div>
              <div
                className={`${card.bg} p-3 rounded-xl group-hover:scale-110 group-hover:shadow-md transition-all duration-300`}
              >
                <Icon
                  size={22}
                  className={`${card.color} group-hover:scale-105 transition-transform duration-200`}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AnalyticsStatsGrid;
