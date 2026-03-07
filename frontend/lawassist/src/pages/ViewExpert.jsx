import React, { useEffect, useState, useCallback } from "react";
import { MapPin, Briefcase, CheckCircle, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/viewExpert.css";
import BackToTopButton from "../components/BackToTopButton";
import axios from "axios";

const API = "https://law-assist.onrender.com/api";

const ExpertProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [expert, setExpert] = useState(null);

  const fetchExpert = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/expert/${id}`);
      setExpert(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [id]);

  useEffect(() => {
    fetchExpert();
  }, [fetchExpert]);

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

      <div className="expert-profile-wrapper">
        <div className="expert-profile-container">
          <button onClick={() => navigate(-1)} className="back-btn">
            <ArrowLeft size={20} /> Back
          </button>

          {/* TOP PROFILE SECTION */}

          <div className="profile-card">
            <div className="profile-left">
              <h1 className="profile-name">{expert.name}</h1>

              <p className="profile-specialization">
                {expert.specialization || "Legal Expert"}
              </p>

              <div className="profile-meta">
                <div className="meta-item">
                  <MapPin size={16} />
                  {expert.city}, {expert.state}
                </div>

                <div className="meta-item">
                  <Briefcase size={16} />
                  {expert.experience}+ Years Experience
                </div>

                {expert.verificationStatus === "verified" && (
                  <div className="meta-item verified">
                    <CheckCircle size={16} />
                    Verified Legal Expert
                  </div>
                )}
              </div>

              <p className="profile-bio">
                {expert.bio || "No professional bio available."}
              </p>
            </div>

            <div className="profile-right">
              <div className="fee-card">
                <p className="fee-label">Consultation Fee</p>

                <p className="fee-amount">
                  ₹{expert.consultationCharges || "Free"}
                </p>

                <button className="btn-primary full">Send Query</button>
              </div>
            </div>
          </div>

          {/* EXPERTISE SECTION */}

          <div className="section-card">
            <h2 className="expert-profile-title">Areas of Expertise</h2>

            <div className="expertise-grid">
              {expert.expertiseAreas && expert.expertiseAreas.length > 0 ? (
                expert.expertiseAreas.map((area, index) => (
                  <span key={index} className="expertise-pill">
                    {area}
                  </span>
                ))
              ) : (
                <p>No expertise areas listed.</p>
              )}
            </div>
          </div>

          <div className="section-card">
            <h2 className="expert-profile-title">Languages Spoken</h2>

            <div className="expertise-grid">
              {expert.languages && expert.languages.length > 0 ? (
                expert.languages.map((lang, index) => (
                  <span key={index} className="expertise-pill">
                    {lang}
                  </span>
                ))
              ) : (
                <p>No languages listed.</p>
              )}
            </div>
          </div>

          {/* PROFESSIONAL DETAILS */}

          <div className="section-card">
            <h2 className="expert-profile-title">Professional Details</h2>

            <div className="details-grid">
              <div>
                <h3 className="details-heading">Specialization</h3>
                <p>{expert.specialization || "Not specified"}</p>
              </div>

              <div>
                <h3 className="details-heading">Experience</h3>
                <p>{expert.experience} Years</p>
              </div>
            </div>
          </div>

          {/* REVIEWS SECTION (Static for now) */}

          <div className="section-card">
            <h2 className="expert-profile-title">Client Reviews</h2>

            <div className="reviews-grid">
              <div className="review-card">
                <p className="review-name">Client</p>
                <p className="review-rating">⭐⭐⭐⭐</p>
                <p className="review-text">
                  Very professional and helpful legal guidance.
                </p>
              </div>

              <div className="review-card">
                <p className="review-name">Client</p>
                <p className="review-rating">⭐⭐⭐⭐⭐</p>
                <p className="review-text">
                  Clear explanation of legal options and quick response.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BackToTopButton />
      <Footer />
    </>
  );
};

export default ExpertProfile;
