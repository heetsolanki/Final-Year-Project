const AnalyticsInsightsCard = ({
  title,
  icon: Icon,
  insights,
  mostCommonCategoryShare,
}) => {
  const mostCommonCategory = insights?.mostCommonCategory || "N/A";
  const answeredPercentage = Number(insights?.answeredPercentage || 0);
  const avgQueriesPerUser = Number(insights?.avgQueriesPerUser || 0);
  const totalActiveExperts = Number(insights?.totalActiveExperts || 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 md:p-8 space-y-5">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-emerald-50">
          <Icon size={16} className="text-emerald-600" />
        </div>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
          {title}
        </h3>
      </div>

      <div className="space-y-3">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3">
          <p className="text-sm text-emerald-800">
            <span className="font-semibold">{mostCommonCategory}</span> issues account
            for approximately <span className="font-semibold">{mostCommonCategoryShare}%</span> of queries.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
            <p className="text-xs text-gray-500">Most Common Category</p>
            <p className="text-sm font-semibold text-gray-800 mt-1">{mostCommonCategory}</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
            <p className="text-xs text-gray-500">Answered Query Percentage</p>
            <p className="text-sm font-semibold text-gray-800 mt-1">{answeredPercentage}%</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
            <p className="text-xs text-gray-500">Average Queries Per User</p>
            <p className="text-sm font-semibold text-gray-800 mt-1">{avgQueriesPerUser}</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
            <p className="text-xs text-gray-500">Total Active Experts</p>
            <p className="text-sm font-semibold text-gray-800 mt-1">{totalActiveExperts}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsInsightsCard;
