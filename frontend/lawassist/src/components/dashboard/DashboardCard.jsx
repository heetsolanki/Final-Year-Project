const DashboardCard = ({ title, icon: Icon, children }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-5 md:p-6 transition md:hover:shadow-lg">
      {title && (
        <h3 className="text-base sm:text-lg font-semibold text-[#1E3A8A] mb-4 flex items-center gap-2">
          {Icon && <Icon size={18} className="text-[#1E3A8A]" />}
          {title}
        </h3>
      )}

      {children}
    </div>
  );
};

export default DashboardCard;
