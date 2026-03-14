const StatsGrid = ({ stats = [] }) => {
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
