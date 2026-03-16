import { Settings, User } from "lucide-react";
import DashboardTabs from "./DashboardTabs";
import DashboardNotificationBell from "./notifications/DashboardNotificationBell";

const DashboardTopCard = ({
  userName,
  email,
  activeTab,
  setActiveTab,
  tabs,
  avatarIcon: AvatarIcon = User,
  headerExtra = null,
}) => {
  return (
    <div className="relative rounded-2xl px-6 md:px-12 py-8 md:py-10 mt-6 mb-10 shadow-md overflow-hidden bg-gradient-to-r from-blue-50 via-white to-blue-50">
      {/* background accent */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-40" />

      {/* Header */}
      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Left Section */}
        <div className="flex items-center gap-5">
          {/* Avatar */}
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-blue-100 flex items-center justify-center shadow-md hover:scale-105 transition">
            <AvatarIcon
              size={24}
              className="md:w-[30px] md:h-[30px] text-blue-700"
            />
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
              Welcome back, {userName}
            </h2>
            <p className="text-sm text-gray-500 mt-1">{email}</p>
            {/* Optional extra content below email e.g. status badge */}
            {headerExtra}
          </div>
        </div>

        {/* Manage Profile Button */}
        <div className="flex w-full md:w-auto items-center justify-end gap-2">
          <DashboardNotificationBell
            onOpenNotifications={() => setActiveTab("notifications")}
          />
          <button
            onClick={() => setActiveTab("profile")}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium
            bg-white border border-gray-200 rounded-lg shadow-sm
            hover:bg-blue-50 hover:border-blue-300 transition
            w-full md:w-auto"
          >
            <Settings size={16} />
            Manage Profile
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8">
        <DashboardTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={tabs}
        />
      </div>
    </div>
  );
};

export default DashboardTopCard;
