import { FolderOpen, FileText, CheckCircle } from "lucide-react";
import StatsGrid from "../StatsGrid";

const UserStatsGrid = ({ queries }) => {
  const stats = [
    {
      title: "Total Cases",
      value: queries.length,
      icon: FolderOpen,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Active Cases",
      value: queries.filter((q) => q.status !== "Resolved").length,
      icon: FileText,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      title: "Resolved",
      value: queries.filter((q) => q.status === "Resolved").length,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ];

  return <StatsGrid stats={stats} />;
};

export default UserStatsGrid;