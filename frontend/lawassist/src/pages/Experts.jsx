import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Star, Briefcase, IndianRupee } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackToTopButton from "../components/BackToTopButton";
import "../styles/experts.css";

const experts = [
  {
    id: 1,
    name: "Advocate",
    specialization: "Consumer Protection & E-commerce Law",
    location: "Mumbai, Maharashtra",
    experience: "8+ Years Experience",
    rating: "4.8",
    reviews: "124",
    fee: "999",
  },
  {
    id: 2,
    name: "Advocate",
    specialization: "Banking & Financial Disputes",
    location: "Delhi, India",
    experience: "6+ Years Experience",
    rating: "4.6",
    reviews: "89",
    fee: "799",
  },
  {
    id: 3,
    name: "Advocate",
    specialization: "Real Estate & Builder Disputes",
    location: "Bangalore, Karnataka",
    experience: "10+ Years Experience",
    rating: "4.9",
    reviews: "158",
    fee: "1199",
  },
];

const Experts = () => {
  return (
    <>
      <Navbar />

      <div className="experts-wrapper">
        <div className="experts-container">
          {/* Header */}
          <div className="experts-header">
            <h1 className="experts-title">Meet Our Legal Experts</h1>
            <p className="experts-subtitle">
              Connect with verified legal professionals specializing in consumer
              rights and dispute resolution.
            </p>
          </div>

          {/* Experts Grid */}
          <div className="experts-grid">
            {experts.map((expert) => (
              <div key={expert.id} className="expert-card">
                <div className="expert-card-header">
                  <h2 className="expert-name">{expert.name}</h2>
                  <span className="verified-badge">Verified</span>
                </div>

                <p className="expert-specialization">{expert.specialization}</p>

                <div className="expert-info">
                  <div className="info-item">
                    <MapPin size={16} />
                    {expert.location}
                  </div>

                  <div className="info-item">
                    <Briefcase size={16} />
                    {expert.experience}
                  </div>

                  <div className="info-item rating">
                    <Star size={16} />
                    {expert.rating} ({expert.reviews} reviews)
                  </div>

                  <div className="info-item fee">
                    <IndianRupee size={16} />
                    {expert.fee} / session
                  </div>
                </div>

                <div className="expert-buttons">
                  <Link to="/expert-profile" className="btn-outline">
                    View Profile
                  </Link>
                  <button className="btn-primary">Send Query</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BackToTopButton />

      <Footer />
    </>
  );
};

export default Experts;
