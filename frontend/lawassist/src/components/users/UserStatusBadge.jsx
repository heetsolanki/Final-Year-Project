const statusStyles = {
  active: {
    bg: "bg-green-100 text-green-700 border border-green-200",
    dot: "bg-green-500",
    label: "Active",
  },
  blocked: {
    bg: "bg-red-100 text-red-700 border border-red-200",
    dot: "bg-red-500",
    label: "Blocked",
  },
  under_review: {
    bg: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    dot: "bg-yellow-500",
    label: "Under Review",
  },
  profile_incomplete: {
    bg: "bg-orange-100 text-orange-700 border border-orange-200",
    dot: "bg-orange-500",
    label: "Incomplete",
  },
  rejected: {
    bg: "bg-red-100 text-red-600 border border-red-200",
    dot: "bg-red-400",
    label: "Rejected",
  },
};

const UserStatusBadge = ({ status, verificationStatus }) => {
  // For experts, show verificationStatus if available
  const displayStatus = verificationStatus || status || "active";
  const style = statusStyles[displayStatus] || statusStyles.active;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${style.bg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
};

export default UserStatusBadge;
