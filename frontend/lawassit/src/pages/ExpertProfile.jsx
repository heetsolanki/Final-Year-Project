import React from "react";
import { MapPin, Star, Briefcase, CheckCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/expertProfile.css";
import BackToTopButton from "../components/BackToTopButton";

const ExpertProfile = () => {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />

      <div className="expert-profile-wrapper">
        <div className="expert-profile-container">
          <button onClick={() => navigate(-1)} className="back-btn">
            <ArrowLeft size={20} className="display: inline"/> Back
          </button>
          {/* TOP PROFILE SECTION */}
          <div className="profile-card">
            <div className="profile-left">
              <h1 className="profile-name">Advocate</h1>

              <p className="profile-specialization">
                Consumer Protection & E-commerce Law Specialist
              </p>

              <div className="profile-meta">
                <div className="meta-item">
                  <MapPin size={16} />
                  Mumbai, Maharashtra
                </div>

                <div className="meta-item">
                  <Briefcase size={16} />
                  8+ Years Experience
                </div>

                <div className="meta-item rating">
                  <Star size={16} />
                  4.8 (124 Reviews)
                </div>

                <div className="meta-item verified">
                  <CheckCircle size={16} />
                  Verified Legal Expert
                </div>
              </div>

              <p className="profile-bio">
                Helping consumers fight unfair trade practices, defective
                products, and online fraud cases with strong legal
                representation and practical advice.
              </p>
            </div>

            <div className="profile-right">
              <div className="fee-card">
                <p className="fee-label">Consultation Fee</p>
                <p className="fee-amount">₹999</p>

                <button className="btn-primary full">Send Query</button>
              </div>
            </div>
          </div>

          {/* EXPERTISE SECTION */}
          <div className="section-card">
            <h2 className="section-title">Areas of Expertise</h2>

            <div className="expertise-grid">
              <span className="expertise-pill">
                Consumer Court Representation
              </span>
              <span className="expertise-pill">E-commerce Disputes</span>
              <span className="expertise-pill">Banking & Payment Fraud</span>
              <span className="expertise-pill">
                Refund & Compensation Claims
              </span>
              <span className="expertise-pill">Warranty & Product Issues</span>
              <span className="expertise-pill">Unfair Trade Practices</span>
            </div>
          </div>

          {/* PROFESSIONAL DETAILS */}
          <div className="section-card">
            <h2 className="section-title">Professional Details</h2>

            <div className="details-grid">
              <div>
                <h3 className="details-heading">Education</h3>
                <p>LLB – Mumbai University</p>
                <p>LLM in Consumer Law – National Law University</p>
              </div>

              <div>
                <h3 className="details-heading">Experience Highlights</h3>
                <p>300+ Cases Handled</p>
                <p>85% Successful Resolution Rate</p>
                <p>Average Response Time: Within 2 Hours</p>
              </div>
            </div>
          </div>

          {/* REVIEWS SECTION */}
          <div className="section-card">
            <h2 className="section-title">Client Reviews</h2>

            <div className="reviews-grid">
              <div className="review-card">
                <p className="review-name">Client 1</p>
                <p className="review-rating">⭐⭐⭐⭐</p>
                <p className="review-text">
                  Very professional and guided me step-by-step in my refund
                  case. Highly recommended.
                </p>
              </div>

              <div className="review-card">
                <p className="review-name">Client 2</p>
                <p className="review-rating">⭐⭐⭐⭐⭐</p>
                <p className="review-text">
                  Quick response and clear explanation of my legal options. My
                  complaint was resolved smoothly.
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
