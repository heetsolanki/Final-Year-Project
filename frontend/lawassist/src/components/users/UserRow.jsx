import { UserCircle, Mail, MapPin, Calendar } from "lucide-react";
import UserStatusBadge from "./UserStatusBadge";
import UserActionButtons from "./UserActionButtons";

const roleLabel = {
  consumer: "Consumer",
  admin: "Admin",
  legalExpert: "Legal Expert",
};

const roleBadge = {
  consumer: "bg-blue-100 text-blue-700 border-blue-200",
  admin: "bg-purple-100 text-purple-700 border-purple-200",
  legalExpert: "bg-amber-100 text-amber-700 border-amber-200",
};

const roleDot = {
  consumer: "bg-blue-500",
  admin: "bg-purple-500",
  legalExpert: "bg-amber-500",
};

const UserRow = ({ user, onAction, actionLoading }) => {
  return (
    <tr
      className={`group hover:bg-blue-50/30 transition-colors duration-200 ${
        user.status === "blocked" || (user._isExpert && user.verificationStatus === "blocked")
          ? "bg-red-50/20"
          : ""
      }`}
    >
      {/* User Info */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
              user.status === "blocked" || (user._isExpert && user.verificationStatus === "blocked")
                ? "bg-red-100 text-red-500"
                : "bg-blue-100 text-blue-600"
            }`}
          >
            <UserCircle size={20} />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-gray-800 truncate">{user.name}</p>
            <p className="text-xs text-gray-400 truncate flex items-center gap-1">
              <Mail size={10} className="shrink-0" />
              {user.email}
            </p>
          </div>
        </div>
      </td>
      {/* Location */}
      <td className="px-5 py-4 hidden lg:table-cell">
        <span className="text-gray-500 flex items-center gap-1.5 text-xs">
          <MapPin size={12} className="text-gray-400 shrink-0" />
          {user.city || "—"}
        </span>
      </td>
      {/* Joined */}
      <td className="px-5 py-4 hidden md:table-cell">
        <span className="text-gray-500 flex items-center gap-1.5 text-xs">
          <Calendar size={12} className="text-gray-400 shrink-0" />
          {new Date(user.createdAt).toLocaleDateString()}
        </span>
      </td>
      {/* Role */}
      <td className="px-5 py-4">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${
            roleBadge[user.role] || "bg-gray-50 text-gray-600 border-gray-200"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              roleDot[user.role] || "bg-gray-400"
            }`}
          />
          {roleLabel[user.role] || user.role}
        </span>
      </td>
      {/* Status */}
      <td className="px-5 py-4">
        <UserStatusBadge
          status={user.status}
          verificationStatus={user._isExpert ? user.verificationStatus : null}
        />
      </td>
      {/* Actions */}
      <td className="px-5 py-4">
        <UserActionButtons
          user={user}
          onAction={onAction}
          actionLoading={actionLoading}
        />
      </td>
    </tr>
  );
};

export default UserRow;
