import {
  ShieldPlus,
  ShieldMinus,
  Ban,
  Unlock,
  Trash2,
} from "lucide-react";

const UserActionButtons = ({ user, onAction, actionLoading }) => {
  const isExpert = user._isExpert;

  if (user.isMasterAdmin) {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-400 border border-gray-200">
        <ShieldPlus size={12} />
        Master Admin
      </span>
    );
  }

  // Determine if the user/expert is effectively blocked
  const isBlocked = isExpert
    ? user.verificationStatus === "blocked"
    : user.status === "blocked";

  const isActive = isExpert
    ? user.verificationStatus !== "blocked"
    : user.status === "active";

  const isPromoting = actionLoading === `promote-${user.userId}`;
  const isDemoting = actionLoading === `demote-${user.userId}`;
  const isBlocking = actionLoading === `block-${user.userId}`;
  const isUnblocking = actionLoading === `unblock-${user.userId}`;
  const isDeleting = actionLoading === `delete-${user.userId}`;

  return (
    <div className="flex items-center gap-1.5 whitespace-nowrap">
      {/* Promote — for consumers or active experts, not blocked, not already admin */}
      {user.role !== "admin" && !isBlocked && (!isExpert || user.verificationStatus === "active") && (
        <button
          onClick={() => onAction("promote", user.userId, isExpert)}
          disabled={isPromoting}
          title="Promote to Admin"
          className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-emerald-100 hover:border-emerald-300 hover:shadow-sm active:scale-95 transition-all duration-200 disabled:opacity-50"
        >
          <ShieldPlus size={13} />
          {isPromoting ? "Promoting..." : "Promote"}
        </button>
      )}
      {/* Demote — for admins (both regular users and experts) */}
      {user.role === "admin" && (
        <button
          onClick={() => onAction("demote", user.userId, isExpert)}
          disabled={isDemoting}
          title={isExpert ? "Demote Expert Admin" : "Demote Admin"}
          className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-amber-100 hover:border-amber-300 hover:shadow-sm active:scale-95 transition-all duration-200 disabled:opacity-50"
        >
          <ShieldMinus size={13} />
          {isDemoting ? "Demoting..." : "Demote"}
        </button>
      )}
      {/* Block / Unblock */}
      {isActive && !isBlocked ? (
        <button
          onClick={() => onAction("block", user.userId, isExpert)}
          disabled={isBlocking}
          title={isExpert ? "Block Expert" : "Block User"}
          className="inline-flex items-center gap-1 bg-red-50 text-red-600 border border-red-200 px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-red-100 hover:border-red-300 hover:shadow-sm active:scale-95 transition-all duration-200 disabled:opacity-50"
        >
          <Ban size={13} />
          {isBlocking ? "Blocking..." : "Block"}
        </button>
      ) : isBlocked ? (
        <button
          onClick={() => onAction("unblock", user.userId, isExpert)}
          disabled={isUnblocking}
          title={isExpert ? "Unblock Expert" : "Unblock User"}
          className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-emerald-100 hover:border-emerald-300 hover:shadow-sm active:scale-95 transition-all duration-200 disabled:opacity-50"
        >
          <Unlock size={13} />
          {isUnblocking ? "Unblocking..." : "Unblock"}
        </button>
      ) : null}
      {/* Delete */}
      <button
        onClick={() => onAction("delete", user.userId, isExpert)}
        disabled={isDeleting}
        title="Delete User"
        className="inline-flex items-center gap-1 bg-red-50 text-red-600 border border-red-200 px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-red-100 hover:border-red-300 hover:shadow-sm active:scale-95 transition-all duration-200 disabled:opacity-50"
      >
        <Trash2 size={13} />
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
};

export default UserActionButtons;
