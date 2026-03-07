import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MapPin, Star, Briefcase, IndianRupee } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackToTopButton from "../components/BackToTopButton";
import "../styles/experts.css";

const API = "https://law-assist.onrender.com/api";


const Experts = () => {
  const [experts, setExperts] = useState([]);
  const navigate = useNavigate();

useEffect(() => {
  fetchExperts();

  const interval = setInterval(() => {
    fetchExperts();
  }, 5000);

  return () => clearInterval(interval);
}, []);

const fetchExperts = async () => {
  try {
    const res = await axios.get(`${API}/expert/all`);
    setExperts(res.data);
  } catch (error) {
    console.log(error);
  }
};

  return (
    <>
      <Navbar />

      <div className="experts-wrapper">
        <div className="experts-container">
          {/* Header */}
          <div className="experts-header">
            <h1 className="section-title">Meet Our Legal Experts</h1>
            <div className="section-underline"></div>
            <p className="section-subtitle">
              Connect with verified legal professionals specializing in consumer
              rights and dispute resolution.
            </p>
          </div>

          {/* Experts Grid */}
          <div className="experts-grid">
            {experts.map((expert) => (
              <div key={expert._id} className="expert-card">
                <div className="expert-card-header">
                  <h2 className="expert-name">{expert.name}</h2>
                  <span className="verified-badge">Verified</span>
                </div>

                <p className="expert-specialization">{expert.specialization}</p>

                <div className="expert-info">
                  <div className="info-item">
                    <MapPin size={16} />
                    {expert.city}, {expert.state}
                  </div>

                  <div className="info-item">
                    <Briefcase size={16} />
                    {expert.experience}+ Years Experience
                  </div>

                  <div className="info-item fee">
                    <IndianRupee size={16} />
                    {expert.consultationCharges} / session
                  </div>
                </div>

                <div className="expert-buttons">
                  <button className="btn-outline" onClick={() => navigate(`/experts/${expert._id}`)}>
                    View Profile
                  </button>
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
