import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const ProfileHeader = ({ user }) => {
  const navigate = useNavigate();

  return (
    <>
      {/* ===== TOP HEADER ROW ===== */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
            Manage Profile
          </h2>

          <p className="text-gray-500 text-xs md:text-sm mt-1">
            Update your personal information and account settings securely.
          </p>
        </div>

        <button
          onClick={() => navigate("/user-dashboard")}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <X size={20} />
        </button>
      </div>

      {/* ===== SUMMARY CARD ===== */}
      <div className="profile-summary">
        <div className="flex items-center gap-6">
          <div className="profile-avatar">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <span className="profile-badge">
              {user.role === "legalExpert" ? "Legal Expert" : "Consumer"}
            </span>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          Member since {new Date(user.createdAt).getFullYear()}
        </div>
      </div>
    </>
  );
};

export default ProfileHeader;
