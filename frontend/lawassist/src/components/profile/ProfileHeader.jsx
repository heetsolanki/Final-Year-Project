import { X } from "lucide-react";

const ProfileHeader = ({ user, setActiveTab }) => {
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      })
    : "Recently";

  return (
    <>
      {/* ===== HEADER TOP ===== */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-sm text-gray-500">
            Update your personal information and account settings securely.
          </p>
        </div>

        <button
          onClick={() => setActiveTab("overview")}
          className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
        >
          <X size={20} />
        </button>
      </div>

      {/* ===== PROFILE CARD ===== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-5">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white text-xl font-semibold shadow-sm">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <div className="leading-tight">
            <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>

            <p className="text-sm text-gray-500 mt-1">{user.email}</p>

            <span className="inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
              {user.role === "legalExpert" ? "Legal Expert" : "Consumer"}
            </span>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="text-sm text-gray-500">
          Member since{" "}
          <span className="font-medium text-gray-700">{memberSince}</span>
        </div>
      </div>
    </>
  );
};

export default ProfileHeader;
