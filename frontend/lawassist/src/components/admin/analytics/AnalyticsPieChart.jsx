import { useMemo, useState } from "react";

const PIE_COLORS = [
  "#3B82F6",
  "#A855F7",
  "#F59E0B",
  "#10B981",
  "#EF4444",
  "#14B8A6",
  "#6366F1",
  "#F97316",
];

const AnalyticsPieChart = ({ title, icon: Icon, data = [], labelKey }) => {
  const [hoveredLabel, setHoveredLabel] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState(null);

  const sanitized = data
    .map((item) => ({
      label: item?.[labelKey] || "N/A",
      count: Number(item?.count || 0),
    }))
    .filter((item) => item.count >= 0);

  const visibleData = useMemo(() => {
    if (!selectedLabel) return sanitized;
    return sanitized.filter((item) => item.label === selectedLabel);
  }, [sanitized, selectedLabel]);

  const total = visibleData.reduce((sum, item) => sum + item.count, 0);

  const activeLabel = hoveredLabel || selectedLabel;
  const activeItem = visibleData.find((item) => item.label === activeLabel) || null;

  const centerCount = activeItem ? activeItem.count : total;
  const centerLabel = activeItem ? activeItem.label : "Total";

  let runningPercent = 0;
  const gradient =
    total === 0
      ? "conic-gradient(#E5E7EB 0deg 360deg)"
      : `conic-gradient(${visibleData
          .map((item, index) => {
            const start = runningPercent;
            const segment = (item.count / total) * 100;
            runningPercent += segment;
            return `${PIE_COLORS[index % PIE_COLORS.length]} ${start}% ${runningPercent}%`;
          })
          .join(", ")})`;

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-indigo-50">
          <Icon size={16} className="text-indigo-600" />
        </div>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
          {title}
        </h3>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        <div className="mx-auto">
          <div
            className={`relative w-44 h-44 rounded-full shadow-inner border border-gray-100 transition-transform duration-200 ${
              activeItem ? "scale-[1.02]" : ""
            }`}
            style={{ background: gradient }}
          >
            <div className="absolute inset-[22%] bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center">
              <div className="text-center">
                <p className="text-xs text-gray-400 truncate max-w-[5.5rem] mx-auto">{centerLabel}</p>
                <p className="text-xl font-bold text-gray-800">{centerCount}</p>
              </div>
            </div>
          </div>

          {selectedLabel && (
            <button
              type="button"
              onClick={() => {
                setSelectedLabel(null);
                setHoveredLabel(null);
              }}
              className="mt-3 mx-auto block text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Reset selection
            </button>
          )}
        </div>

        <div className="flex-1 space-y-2">
          {visibleData.length === 0 ? (
            <p className="text-sm text-gray-400">No chart data available.</p>
          ) : (
            visibleData.map((item, index) => {
              const percent = total > 0 ? Math.round((item.count / total) * 100) : 0;
              const isActive = activeLabel === item.label;

              return (
                <button
                  type="button"
                  key={`${item.label}-${index}`}
                  onMouseEnter={() => setHoveredLabel(item.label)}
                  onMouseLeave={() => setHoveredLabel(null)}
                  onClick={() =>
                    setSelectedLabel((prev) => (prev === item.label ? null : item.label))
                  }
                  className={`w-full flex items-center justify-between rounded-lg border px-3 py-2 transition-all duration-200 ${
                    isActive
                      ? "border-indigo-300 bg-indigo-50 shadow-sm"
                      : "border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                    />
                    <p className="text-sm text-gray-600 truncate">{item.label}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-700 shrink-0">
                    {item.count} ({percent}%)
                  </p>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPieChart;
