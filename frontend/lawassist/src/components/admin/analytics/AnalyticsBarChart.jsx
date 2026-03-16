import { useMemo, useState } from "react";

const AnalyticsBarChart = ({ title, icon: Icon, data = [] }) => {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const sanitized = data.map((item) => ({
    category: item?.category || "Others",
    count: Number(item?.count || 0),
  }));

  const visibleData = useMemo(() => {
    if (!selectedCategory) return sanitized;
    return sanitized.filter((item) => item.category === selectedCategory);
  }, [sanitized, selectedCategory]);

  const maxValue = Math.max(...visibleData.map((item) => item.count), 0);
  const total = visibleData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-blue-50">
          <Icon size={16} className="text-blue-600" />
        </div>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
          {title}
        </h3>
      </div>

      <div className="space-y-3">
        {visibleData.length === 0 ? (
          <p className="text-sm text-gray-400">No chart data available.</p>
        ) : (
          visibleData.map((item) => {
            const widthPercent = maxValue > 0 ? (item.count / maxValue) * 100 : 0;
            const share = total > 0 ? Math.round((item.count / total) * 100) : 0;
            const isActive =
              hoveredCategory === item.category || selectedCategory === item.category;

            return (
              <button
                type="button"
                key={item.category}
                onMouseEnter={() => setHoveredCategory(item.category)}
                onMouseLeave={() => setHoveredCategory(null)}
                onClick={() =>
                  setSelectedCategory((prev) =>
                    prev === item.category ? null : item.category,
                  )
                }
                className={`w-full text-left space-y-1 rounded-lg border p-2 transition-all duration-200 ${
                  isActive
                    ? "border-blue-300 bg-blue-50/70"
                    : "border-transparent hover:border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm text-gray-600 truncate">{item.category}</p>
                  <p className="text-sm font-semibold text-gray-700">
                    {item.count}
                    {isActive ? ` (${share}%)` : ""}
                  </p>
                </div>
                <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-500 to-blue-500"
                        : "bg-gradient-to-r from-blue-500 to-indigo-500"
                    }`}
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>
              </button>
            );
          })
        )}
      </div>

      {selectedCategory && (
        <button
          type="button"
          onClick={() => {
            setSelectedCategory(null);
            setHoveredCategory(null);
          }}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          Reset selection
        </button>
      )}
    </div>
  );
};

export default AnalyticsBarChart;
