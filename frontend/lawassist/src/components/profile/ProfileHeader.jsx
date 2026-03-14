import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const ProfileHeader = ({ user, setActiveTab }) => {
  const navigate = useNavigate();

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      })
    : "Recently";

  return (
    <>
      {/* ===== TOP HEADER ROW ===== */}
      <div className="flex items-start justify-between gap-4">
        <div>

          <p className="text-gray-500 text-xs md:text-sm mt-1">
            Update your personal information and account settings securely.
          </p>
        </div>

        <button
          onClick={() => setActiveTab("overview")}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <X size={20} />
        </button>
      </div>

      {/* ===== SUMMARY CARD ===== */}
      <div className="profile-summary flex flex-col md:flex-row md:items-center md:justify-between gap-5 mt-6">

        {/* LEFT SECTION */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="profile-avatar flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-blue-600 text-white text-lg md:text-xl font-semibold">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3 className="text-base md:text-lg font-semibold text-gray-800">
              {user.name}
            </h3>

            <p className="text-gray-500 text-xs md:text-sm">
              {user.email}
            </p>

            <span className="profile-badge inline-block mt-1 px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
              {user.role === "legalExpert" ? "Legal Expert" : "Consumer"}
            </span>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="text-xs md:text-sm text-gray-500">
          Member since {memberSince}
        </div>
      </div>
    </>
  );
};

export default ProfileHeader;