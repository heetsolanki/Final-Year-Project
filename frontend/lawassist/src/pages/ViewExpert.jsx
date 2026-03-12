import React, { useEffect, useState, useCallback } from "react";
import { MapPin, Briefcase, CheckCircle, ArrowLeft, Star } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackToTopButton from "../components/BackToTopButton";
import axios from "axios";
import API_URL from "../api";

const ExpertProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [expert, setExpert] = useState(null);
  const [reviews, setReviews] = useState([]);

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
        <Navbar />
        <div className="text-center mt-40 text-lg">
          Loading expert profile...
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

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

                {expert.verificationStatus === "verified" && (
                  <div className="flex items-center gap-1 sm:gap-2 text-green-600 font-medium">
                    <CheckCircle size={16} />
                    Verified Legal Expert
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
                  ₹{expert.consultationCharges || "Free"}
                </p>

                <button className="w-full bg-[#1E3A8A] text-white py-2.5 sm:py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-[#1E3A8A]/90">
                  Send Query
                </button>
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

            {[1,2,3,4,5].map((star) => (

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

      <BackToTopButton />
      <Footer />
    </>
  );
};

export default ExpertProfile;
