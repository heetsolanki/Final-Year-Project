import { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../../../api";
import {
  Users,
  BadgeCheck,
  FileText,
  MessageSquare,
  Clock,
  ShieldCheck,
  TrendingUp,
  Activity,
} from "lucide-react";

const statCards = [
  {
    key: "totalUsers",
    title: "Total Consumers",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    hoverBorder: "hover:border-blue-400",
  },
  {
    key: "totalExperts",
    title: "Total Experts",
    icon: BadgeCheck,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    hoverBorder: "hover:border-purple-400",
  },
  {
    key: "totalQueries",
    title: "Total Queries",
    icon: FileText,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    hoverBorder: "hover:border-yellow-400",
  },
  {
    key: "activeConsultations",
    title: "Active Consultations",
    icon: MessageSquare,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    hoverBorder: "hover:border-green-400",
  },
  {
    key: "pendingVerifications",
    title: "Pending Verifications",
    icon: Clock,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    hoverBorder: "hover:border-red-400",
  },
];

const AdminOverviewTab = ({ refreshKey }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const userName = localStorage.getItem("name") || "Admin";
  const email = localStorage.getItem("email") || "";

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch admin stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [refreshKey]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-500 animate-pulse">
            Loading dashboard stats...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <style>{`
        @keyframes shimmer {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes floatReverse {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
      `}</style>
      {/* Main Card Wrapper */}
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 md:p-8 space-y-8">
        {/* Welcome Back Card */}
        <div className="group relative rounded-2xl px-8 md:px-16 py-10 md:py-12 shadow-md hover:shadow-lg overflow-hidden bg-gradient-to-r from-[#0A1F44] via-[#132D5E] to-[#0A1F44] transition-shadow duration-300">
          {/* Subtle shimmer sweep */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" style={{ animation: 'shimmer 8s ease-in-out infinite' }} />
          </div>
          {/* Floating accent orbs */}
          <div className="absolute top-4 right-12 w-24 h-24 rounded-full bg-[#C9A227]/5" style={{ animation: 'float 6s ease-in-out infinite' }} />
          <div className="absolute bottom-4 left-8 w-16 h-16 rounded-full bg-white/5" style={{ animation: 'floatReverse 8s ease-in-out infinite' }} />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            {/* Left — Avatar + Info */}
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shadow-md hover:scale-105 transition-transform duration-200">
                <ShieldCheck size={28} className="text-[#C9A227]" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-white">
                  Welcome back, {userName}
                </h2>
                <p className="text-sm text-gray-300 mt-0.5">{email}</p>
                <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#C9A227]/20 text-[#C9A227] border border-[#C9A227]/30">
                  <ShieldCheck size={12} />
                  Master Admin
                </span>
              </div>
            </div>

            {/* Right — Quick Summary */}
            <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 transition-colors duration-200">
              <div className="p-2 rounded-lg bg-green-500/20">
                <TrendingUp size={18} className="text-green-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Total Platform Users</p>
                <p className="text-lg font-bold text-white">
                  {(stats?.totalUsers ?? 0) + (stats?.totalExperts ?? 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section Heading */}
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Platform Overview
          </h3>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {statCards.map((card) => {
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
                      {card.title}
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
      </div>
    </div>
  );
};

export default AdminOverviewTab;
