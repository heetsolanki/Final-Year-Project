import { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../../../api";
import {
  ShieldCheck,
  ShieldX,
  ShieldOff,
  ShieldAlert,
  User,
  BadgeCheck,
  Briefcase,
  MapPin,
  Clock,
  Search,
  Filter,
  X,
  Eye,
  Mail,
  FileText,
  Languages,
  Unlock,
} from "lucide-react";

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "under_review", label: "Under Review" },
  { value: "active", label: "Active" },
  { value: "rejected", label: "Rejected" },
  { value: "blocked", label: "Blocked" },
  { value: "profile_incomplete", label: "Incomplete" },
];

const statusBadgeStyles = {
  under_review: "bg-yellow-50 text-yellow-700 border-yellow-200",
  active: "bg-green-50 text-green-700 border-green-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  blocked: "bg-gray-100 text-gray-600 border-gray-300",
  profile_incomplete: "bg-orange-50 text-orange-700 border-orange-200",
};

const statusDotStyles = {
  under_review: "bg-yellow-500",
  active: "bg-green-500",
  rejected: "bg-red-500",
  blocked: "bg-gray-500",
  profile_incomplete: "bg-orange-500",
};

const statusLabels = {
  under_review: "Under Review",
  active: "Active",
  rejected: "Rejected",
  blocked: "Blocked",
  profile_incomplete: "Incomplete",
};

const AdminExpertsTab = ({ refreshKey }) => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // View Profile modal
  const [viewExpert, setViewExpert] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  // Reject modal
  const [rejectExpert, setRejectExpert] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchExperts = async () => {
    try {
      const params = {};
      if (statusFilter !== "all") params.status = statusFilter;
      if (search) params.search = search;

      const res = await axios.get(`${API_URL}/api/admin/experts`, {
        headers,
        params,
      });
      setExperts(res.data);
    } catch (err) {
      console.error("Failed to fetch experts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperts();
  }, [refreshKey, statusFilter, search]);

  const handleApprove = async (userId) => {
    setActionLoading(`approve-${userId}`);
    try {
      await axios.put(
        `${API_URL}/api/admin/experts/verify/${userId}`,
        {},
        { headers },
      );
      fetchExperts();
    } catch (err) {
      console.error("Failed to approve expert:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectExpert) return;
    setActionLoading(`reject-${rejectExpert.userId}`);
    try {
      await axios.put(
        `${API_URL}/api/admin/experts/reject/${rejectExpert.userId}`,
        { reason: rejectReason },
        { headers },
      );
      setRejectExpert(null);
      setRejectReason("");
      fetchExperts();
    } catch (err) {
      console.error("Failed to reject expert:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleBlock = async (userId) => {
    setActionLoading(`block-${userId}`);
    try {
      await axios.put(
        `${API_URL}/api/admin/experts/block/${userId}`,
        {},
        { headers },
      );
      fetchExperts();
    } catch (err) {
      console.error("Failed to block expert:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnblock = async (userId) => {
    setActionLoading(`unblock-${userId}`);
    try {
      await axios.put(
        `${API_URL}/api/admin/experts/unblock/${userId}`,
        {},
        { headers },
      );
      fetchExperts();
    } catch (err) {
      console.error("Failed to unblock expert:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewProfile = async (userId) => {
    setViewLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/admin/experts/${userId}`, {
        headers,
      });
      setViewExpert(res.data);
    } catch (err) {
      console.error("Failed to fetch expert profile:", err);
    } finally {
      setViewLoading(false);
    }
  };

  const renderActionButtons = (expert) => {
    const status = expert.verificationStatus;
    const uid = expert.userId;
    const isApproving = actionLoading === `approve-${uid}`;
    const isRejecting = actionLoading === `reject-${uid}`;
    const isBlocking = actionLoading === `block-${uid}`;
    const isUnblocking = actionLoading === `unblock-${uid}`;

    return (
      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
        {/* View Profile — always shown */}
        <button
          onClick={() => handleViewProfile(uid)}
          disabled={viewLoading}
          className="inline-flex items-center gap-1.5 border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-50 hover:border-gray-300 active:scale-95 transition-all duration-200"
        >
          <Eye size={14} />
          {viewLoading ? "Loading..." : "View"}
        </button>

        {status === "under_review" && (
          <>
            <button
              onClick={() => handleApprove(uid)}
              disabled={isApproving}
              className="inline-flex items-center gap-1.5 bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-600 hover:shadow-md active:scale-95 transition-all duration-200 disabled:opacity-50"
            >
              <ShieldCheck size={14} />
              {isApproving ? "Approving..." : "Approve"}
            </button>
            <button
              onClick={() => {
                setRejectExpert(expert);
                setRejectReason("");
              }}
              disabled={isRejecting}
              className="inline-flex items-center gap-1.5 bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-600 hover:shadow-md active:scale-95 transition-all duration-200 disabled:opacity-50"
            >
              <ShieldX size={14} />
              {isRejecting ? "Rejecting..." : "Reject"}
            </button>
          </>
        )}

        {status === "active" && (
          <button
            onClick={() => handleBlock(uid)}
            disabled={isBlocking}
            className="inline-flex items-center gap-1.5 bg-gray-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-700 hover:shadow-md active:scale-95 transition-all duration-200 disabled:opacity-50"
          >
            <ShieldOff size={14} />
            {isBlocking ? "Blocking..." : "Block"}
          </button>
        )}

        {status === "rejected" && (
          <button
            onClick={() => handleApprove(uid)}
            disabled={isApproving}
            className="inline-flex items-center gap-1.5 bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-600 hover:shadow-md active:scale-95 transition-all duration-200 disabled:opacity-50"
          >
            <ShieldCheck size={14} />
            {isApproving ? "Approving..." : "Approve"}
          </button>
        )}

        {status === "blocked" && (
          <button
            onClick={() => handleUnblock(uid)}
            disabled={isUnblocking}
            className="inline-flex items-center gap-1.5 bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-600 hover:shadow-md active:scale-95 transition-all duration-200 disabled:opacity-50"
          >
            <Unlock size={14} />
            {isUnblocking ? "Unblocking..." : "Unblock"}
          </button>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-500 animate-pulse">
            Loading experts...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-100">
              <BadgeCheck size={20} className="text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Experts
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {experts.length} expert{experts.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          {/* Summary Pills */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
              {experts.filter((e) => e.verificationStatus === "under_review").length} Pending
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              {experts.filter((e) => e.verificationStatus === "active").length} Active
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100" />

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3.5 py-2.5 bg-gray-50/50 hover:bg-white hover:border-gray-300 focus-within:bg-white focus-within:border-purple-300 focus-within:shadow-sm transition-all duration-200 w-full sm:max-w-sm">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by name, email, or specialization..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="outline-none w-full text-sm bg-transparent placeholder-gray-400"
            />
          </div>

          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3.5 py-2.5 bg-gray-50/50 hover:bg-white hover:border-gray-300 transition-all duration-200">
            <Filter size={14} className="text-gray-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="outline-none text-sm bg-transparent cursor-pointer text-gray-600"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cards Grid or Empty State */}
        {experts.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-gray-400">
            <ShieldCheck size={36} className="mb-3 text-gray-300" />
            <p className="text-sm">No experts found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {experts.map((expert) => (
              <div
                key={expert._id}
                className="group bg-gray-50 border border-gray-100 p-5 rounded-xl hover:bg-white hover:shadow-md hover:border-gray-200 hover:-translate-y-0.5 transition-all duration-300"
              >
                {/* Expert Info */}
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-purple-50 border border-purple-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                      <User size={18} className="text-purple-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold text-gray-800 truncate">
                        {expert.name}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">
                        {expert.email}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Briefcase size={14} className="text-gray-400" />
                      <span>
                        {expert.specialization || "Not specified"}
                        {expert.experience
                          ? ` - ${expert.experience} yrs`
                          : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-gray-400" />
                      <span>
                        {[expert.city, expert.state]
                          .filter(Boolean)
                          .join(", ") || "--"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-gray-400" />
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${statusBadgeStyles[expert.verificationStatus] || "bg-gray-50 text-gray-600 border-gray-200"}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${statusDotStyles[expert.verificationStatus] || "bg-gray-400"}`}
                        />
                        {statusLabels[expert.verificationStatus] ||
                          expert.verificationStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {renderActionButtons(expert)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== View Profile Modal ===== */}
      {(viewExpert || viewLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 max-h-[85vh] overflow-y-auto">
            {viewLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-50 border border-purple-200 flex items-center justify-center">
                      <User size={18} className="text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {viewExpert.name}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${statusBadgeStyles[viewExpert.verificationStatus] || ""}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${statusDotStyles[viewExpert.verificationStatus] || ""}`}
                        />
                        {statusLabels[viewExpert.verificationStatus] ||
                          viewExpert.verificationStatus}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setViewExpert(null)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition"
                  >
                    <X size={18} className="text-gray-500" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-4 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Email</p>
                      <p className="flex items-center gap-1.5 text-gray-700">
                        <Mail size={14} className="text-gray-400" />
                        {viewExpert.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">User ID</p>
                      <p className="text-gray-700">{viewExpert.userId}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">
                        Specialization
                      </p>
                      <p className="flex items-center gap-1.5 text-gray-700">
                        <Briefcase size={14} className="text-gray-400" />
                        {viewExpert.specialization || "--"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Experience</p>
                      <p className="text-gray-700">
                        {viewExpert.experience
                          ? `${viewExpert.experience} years`
                          : "--"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Location</p>
                      <p className="flex items-center gap-1.5 text-gray-700">
                        <MapPin size={14} className="text-gray-400" />
                        {[viewExpert.city, viewExpert.state]
                          .filter(Boolean)
                          .join(", ") || "--"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">
                        Bar Council ID
                      </p>
                      <p className="text-gray-700">
                        {viewExpert.barCouncilId || "--"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">
                        Government ID
                      </p>
                      <p className="flex items-center gap-1.5 text-gray-700">
                        <FileText size={14} className="text-gray-400" />
                        {viewExpert.idNumber || "--"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">
                        Consultation Fee
                      </p>
                      <p className="text-gray-700">
                        {viewExpert.consultationFee || viewExpert.consultationCharges
                          ? `Rs. ${viewExpert.consultationFee ?? viewExpert.consultationCharges}`
                          : "--"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">
                        Profile Completion
                      </p>
                      <p className="text-gray-700">
                        {viewExpert.profileCompletion || 0}%
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">
                        Active Status
                      </p>
                      <p className="text-gray-700">
                        {viewExpert.isActive ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </div>

                  {viewExpert.idProofUrl && (
                    <div>
                      <p className="text-gray-400 text-xs mb-1">
                        ID Proof Document
                      </p>
                      <a
                        href={viewExpert.idProofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm hover:underline break-all"
                      >
                        {viewExpert.idProofUrl}
                      </a>
                    </div>
                  )}

                  {viewExpert.languages && viewExpert.languages.length > 0 && (
                    <div>
                      <p className="text-gray-400 text-xs mb-1 flex items-center gap-1">
                        <Languages size={14} /> Languages
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {viewExpert.languages.map((lang) => (
                          <span
                            key={lang}
                            className="px-2 py-0.5 rounded-full text-xs bg-purple-50 text-purple-700 border border-purple-200"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {viewExpert.expertiseAreas &&
                    viewExpert.expertiseAreas.length > 0 && (
                      <div>
                        <p className="text-gray-400 text-xs mb-1">
                          Areas of Expertise
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {viewExpert.expertiseAreas.map((area) => (
                            <span
                              key={area}
                              className="px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200"
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  {viewExpert.bio && (
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Bio</p>
                      <p className="text-gray-700 leading-relaxed">
                        {viewExpert.bio}
                      </p>
                    </div>
                  )}

                  {viewExpert.rejectionReason && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                      <p className="flex items-center gap-1.5 text-sm font-medium text-red-700 mb-1">
                        <ShieldAlert size={14} />
                        Rejection Reason
                      </p>
                      <p className="text-sm text-red-600">
                        {viewExpert.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ===== Reject Modal ===== */}
      {rejectExpert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-50 rounded-xl">
                  <ShieldX size={20} className="text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Reject Expert
                </h3>
              </div>
              <button
                onClick={() => {
                  setRejectExpert(null);
                  setRejectReason("");
                }}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            <p className="text-sm text-gray-600">
              Rejecting <span className="font-medium">{rejectExpert.name}</span>
              . Please provide a reason so the expert can update their profile
              and resubmit.
            </p>

            <textarea
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-red-300 focus:outline-none focus:ring-1 focus:ring-red-200 transition"
            />

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setRejectExpert(null);
                  setRejectReason("");
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={
                  !rejectReason.trim() ||
                  actionLoading === `reject-${rejectExpert.userId}`
                }
                className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 hover:shadow-md active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading === `reject-${rejectExpert.userId}`
                  ? "Rejecting..."
                  : "Reject Expert"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminExpertsTab;
