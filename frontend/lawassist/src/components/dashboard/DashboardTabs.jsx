const DashboardTabs = ({ activeTab, setActiveTab, tabs = [] }) => {
  return (
    <div className="mt-8 border-b border-gray-200">
      <div className="flex gap-6 md:gap-8 overflow-x-auto whitespace-nowrap px-1 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative pb-3 text-sm md:text-[15px] font-medium transition-colors duration-200
            ${
              activeTab === tab.id
                ? "text-[#1E3A8A]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}

            {/* animated underline */}
            <span
              className={`absolute left-0 bottom-0 h-[2px] w-full bg-[#1E3A8A]
              transform transition-transform duration-300
              ${activeTab === tab.id ? "scale-x-100" : "scale-x-0"} origin-left`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default DashboardTabs;
