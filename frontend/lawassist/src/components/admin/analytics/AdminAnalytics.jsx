import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import API_URL from "../../../api";
import {
  Activity,
  AlertCircle,
  BarChart3,
  PieChart,
  Sparkles,
} from "lucide-react";

import AnalyticsStatsGrid from "./AnalyticsStatsGrid";
import AnalyticsPieChart from "./AnalyticsPieChart";
import AnalyticsBarChart from "./AnalyticsBarChart";
import AnalyticsInsightsCard from "./AnalyticsInsightsCard";

const DEFAULT_ANALYTICS = {
  stats: {
    users: 0,
    experts: 0,
    queries: 0,
    consultations: 0,
    payments: 0,
  },
  queriesByCategory: [],
  queriesByStatus: [],
  queriesPerCategoryBar: [],
  insights: {
    mostCommonCategory: "N/A",
    answeredPercentage: 0,
    avgQueriesPerUser: 0,
    totalActiveExperts: 0,
  },
};

const AdminAnalytics = ({ refreshKey }) => {
  const [analytics, setAnalytics] = useState(DEFAULT_ANALYTICS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchAnalytics = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/api/admin/analytics`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!mounted) return;

        setAnalytics({
          ...DEFAULT_ANALYTICS,
          ...res.data,
          stats: { ...DEFAULT_ANALYTICS.stats, ...(res.data?.stats || {}) },
          insights: {
            ...DEFAULT_ANALYTICS.insights,
            ...(res.data?.insights || {}),
          },
          queriesByCategory: res.data?.queriesByCategory || [],
          queriesByStatus: res.data?.queriesByStatus || [],
          queriesPerCategoryBar: res.data?.queriesPerCategoryBar || [],
        });
      } catch (err) {
        console.error("Failed to fetch admin analytics:", err);
        if (mounted) setError("Unable to load analytics right now.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAnalytics();

    return () => {
      mounted = false;
    };
  }, [refreshKey]);

  const mostCommonCategoryShare = useMemo(() => {
    const totalQueries = analytics.queriesByCategory.reduce(
      (sum, item) => sum + (item.count || 0),
      0,
    );

    if (!totalQueries || !analytics.insights.mostCommonCategory) return 0;

    const topItem = analytics.queriesByCategory.find(
      (item) => item.category === analytics.insights.mostCommonCategory,
    );

    if (!topItem) return 0;

    return Math.round((topItem.count / totalQueries) * 100);
  }, [analytics.queriesByCategory, analytics.insights.mostCommonCategory]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-500 animate-pulse">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 md:p-8">
          <div className="flex items-start gap-3 text-red-600 bg-red-50 border border-red-200 rounded-xl p-4">
            <AlertCircle size={18} className="mt-0.5" />
            <div>
              <p className="text-sm font-semibold">Analytics Unavailable</p>
              <p className="text-sm text-red-500">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 md:p-8 space-y-8">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Analytics Overview
          </h3>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <AnalyticsStatsGrid stats={analytics.stats} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <AnalyticsPieChart
          title="Queries by Category"
          icon={PieChart}
          data={analytics.queriesByCategory}
          labelKey="category"
        />

        <AnalyticsPieChart
          title="Query Status Overview"
          icon={PieChart}
          data={analytics.queriesByStatus}
          labelKey="status"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <AnalyticsBarChart
          title="Queries Posted Per Category"
          icon={BarChart3}
          data={analytics.queriesPerCategoryBar}
        />

        <AnalyticsInsightsCard
          title="Platform Insights"
          icon={Sparkles}
          insights={analytics.insights}
          mostCommonCategoryShare={mostCommonCategoryShare}
        />
      </div>
    </div>
  );
};

export default AdminAnalytics;
