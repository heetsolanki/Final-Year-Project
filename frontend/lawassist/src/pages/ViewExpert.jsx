import React, { useEffect, useState, useCallback } from "react";
import { MapPin, Briefcase, CheckCircle, ArrowLeft, Star, Circle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import BackToTopButton from "../components/layout/BackToTopButton";
import AlertPopup from "../components/ui/AlertPopup";
import axios from "axios";
import API_URL from "../api";

const ExpertProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [expert, setExpert] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [notifyLoading, setNotifyLoading] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState("");
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [authPopupMessage, setAuthPopupMessage] = useState("");

  const isWithinAvailability = useCallback((availability) => {
    if (!availability?.startTime || !availability?.endTime) return false;

    const toMinutes = (value) => {
      const [h, m] = String(value).split(":").map(Number);
      if (Number.isNaN(h) || Number.isNaN(m)) return null;
      return h * 60 + m;
    };

    const start = toMinutes(availability.startTime);
    const end = toMinutes(availability.endTime);
    if (start === null || end === null) return false;

    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    if (start < end) {
      return nowMinutes >= start && nowMinutes <= end;
    }

    return nowMinutes >= start || nowMinutes <= end;
  }, []);

  const availabilityWindow =
    expert?.availability?.startTime && expert?.availability?.endTime
      ? `${expert.availability.startTime} - ${expert.availability.endTime}`
      : "Not set";

  const canStartConsultation = expert?.isActive && isWithinAvailability(expert?.availability);

  const showLoginRequiredPopup = useCallback((message) => {
    setAuthPopupMessage(message);
    setShowAuthPopup(true);
  }, []);

  const startConsultation = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      showLoginRequiredPopup("Please login to start a consultation with this expert.");
      return;
    }

    if (!canStartConsultation) {
      return;
    }

    navigate(`/payment?expertId=${expert.userId}`);
  };

  const handleNotifyMe = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showLoginRequiredPopup("Please login to receive availability notifications.");
        return;
      }

      setNotifyLoading(true);
      setNotifyMessage("");

      const res = await axios.post(
        `${API_URL}/api/expert/${expert.userId}/notify-me`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setNotifyMessage(res.data?.message || "You will be notified when this expert is available.");
    } catch (error) {
      setNotifyMessage(
        error?.response?.data?.message || "Unable to enable Notify Me right now.",
      );
    } finally {
      setNotifyLoading(false);
    }
  };

  const fetchExpert = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/expert/${id}`);
      setExpert(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [id]);

  const fetchReviews = useCallback(async () => {
    try {
      if (!expert?.userId) return;

      const res = await axios.get(
        `${API_URL}/api/reviews/expert/${expert.userId}`,
      );

      setReviews(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [expert]);

  useEffect(() => {
    fetchExpert();
  }, [fetchExpert]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  if (!expert) {
    return (
      <>
        <div className="text-center mt-40 text-lg">
          Loading expert profile...
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-28 sm:pt-32 lg:pt-36 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 lg:space-y-10">
          <button
            onClick={() => navigate(-1)}
            className="text-[#1e3a8a] font-semibold cursor-pointer text-sm sm:text-base transition-all duration-200 flex items-center gap-2 mb-4 sm:mb-6 hover:text-yellow-500"
          >
            <ArrowLeft size={20} /> Back
          </button>

          {/* TOP PROFILE SECTION */}
          <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 lg:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="md:col-span-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                {expert.name}
              </h1>

              <p className="text-indigo-600 font-medium mb-3 sm:mb-4 text-sm sm:text-base">
                {expert.specialization || "Legal Expert"}
              </p>

              <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1 sm:gap-2">
                  <MapPin size={16} />
                  {expert.city}, {expert.state}
                </div>

                <div className="flex items-center gap-1 sm:gap-2">
                  <Briefcase size={16} />
                  {expert.experience}+ Years Experience
                </div>

                {expert.verificationStatus === "active" && (
                  <div className="flex items-center gap-1 sm:gap-2 text-green-600 font-medium">
                    <CheckCircle size={16} />
                    Verified Legal Expert
                  </div>
                )}

                {expert.isActive ? (
                  <div className="flex items-center gap-1 sm:gap-2 text-green-600 font-medium">
                    <Circle size={10} className="fill-green-500 text-green-500" />
                    {canStartConsultation ? "Available" : "Offline"}
                  </div>
                ) : (
                  <div className="flex items-center gap-1 sm:gap-2 text-gray-500 font-medium">
                    <Circle size={10} className="fill-gray-400 text-gray-400" />
                    Currently Unavailable
                  </div>
                )}
              </div>

              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {expert.bio || "No professional bio available."}
              </p>
            </div>

            <div>
              <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 lg:p-6 shadow-sm text-center space-y-3 sm:space-y-4">
                <p className="text-gray-500 text-xs sm:text-sm">
                  Consultation Fee
                </p>

                <p className="text-2xl sm:text-3xl font-bold text-gray-800">
                  ₹{expert.consultationFee ?? expert.consultationCharges ?? "Free"}
                </p>

                <p className="text-xs text-gray-500">
                  Follow-up Fee: ₹{expert.followUpFee ?? "Not set"}
                </p>

                <p className="text-xs text-gray-500">
                  Availability: {availabilityWindow}
                </p>

                {!canStartConsultation && (
                  <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                    Expert is currently offline. Available between {availabilityWindow}.
                  </p>
                )}

                <button
                  onClick={startConsultation}
                  disabled={!canStartConsultation}
                  className="w-full bg-[#1E3A8A] text-white py-2.5 sm:py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-[#1E3A8A]/90 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {!canStartConsultation ? "Expert Unavailable" : "Start Consultation"}
                </button>

                {!canStartConsultation && (
                  <button
                    onClick={handleNotifyMe}
                    disabled={notifyLoading}
                    className="w-full border border-[#1E3A8A] text-[#1E3A8A] py-2.5 sm:py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-blue-50 disabled:opacity-60"
                  >
                    {notifyLoading ? "Enabling..." : "Notify Me"}
                  </button>
                )}

                {notifyMessage && (
                  <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                    {notifyMessage}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* EXPERTISE SECTION */}
          <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 lg:p-8 transition-all duration-300 hover:shadow-lg">
            <h2 className="text-lg sm:text-lg lg:text-3xl font-bold text-[#0A1F44] mb-4">
              Areas of Expertise
            </h2>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              {expert.expertiseAreas && expert.expertiseAreas.length > 0 ? (
                expert.expertiseAreas.map((area, index) => (
                  <span
                    key={index}
                    className="bg-indigo-100 text-indigo-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium"
                  >
                    {area}
                  </span>
                ))
              ) : (
                <p>No expertise areas listed.</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 lg:p-8 transition-all duration-300 hover:shadow-lg">
            <h2 className="text-lg sm:text-lg lg:text-3xl font-bold text-[#0A1F44] mb-4">
              Languages Spoken
            </h2>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              {expert.languages && expert.languages.length > 0 ? (
                expert.languages.map((lang, index) => (
                  <span
                    key={index}
                    className="bg-indigo-100 text-indigo-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium"
                  >
                    {lang}
                  </span>
                ))
              ) : (
                <p>No languages listed.</p>
              )}
            </div>
          </div>

          {/* PROFESSIONAL DETAILS */}
          <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 lg:p-8 transition-all duration-300 hover:shadow-lg">
            <h2 className="text-lg sm:text-lg lg:text-3xl font-bold text-[#0A1F44] mb-4">
              Professional Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-sm sm:text-base text-gray-600">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Specialization
                </h3>
                <p>{expert.specialization || "Not specified"}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Experience</h3>
                <p>{expert.experience} Years</p>
              </div>
            </div>
          </div>

          {/* REVIEWS SECTION */}
          <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 lg:p-8 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg sm:text-xl lg:text-3xl font-bold text-[#0A1F44]">
                Client Reviews
              </h2>

              {reviews.length > 0 && (
                <span className="text-sm text-gray-500">
                  {reviews.length} Review{reviews.length > 1 && "s"}
                </span>
              )}
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                No client reviews yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-gray-50 rounded-xl p-4 sm:p-5 shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
                  >
                    {/* Top Row */}
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-800">
                        {review.username || "Client"}
                      </p>

                      <p className="text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Stars */}
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          className={
                            star <= review.rating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>

                    {/* Comment */}
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <AlertPopup
        show={showAuthPopup}
        type="warning"
        title="Login Required"
        description={authPopupMessage}
        redirectTo="/login"
        onClose={() => setShowAuthPopup(false)}
      />
      <BackToTopButton />
    </>
  );
};

export default ExpertProfile;
