import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MapPin, Briefcase, IndianRupee } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackToTopButton from "../components/BackToTopButton";

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

      <div className="min-h-screen bg-gray-50 py-16 px-4 pt-36">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="section-title">Meet Our Legal Experts</h1>
            <div className="section-underline"></div>
            <p className="section-subtitle">
              Connect with verified legal professionals specializing in consumer
              rights and dispute resolution.
            </p>
          </div>

          {/* Experts Grid */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {experts.map((expert) => (
              <div
                key={expert._id}
                className="bg-white rounded-2xl shadow-sm p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold text-gray-800">{expert.name}</h2>
                  <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                    Verified
                  </span>
                </div>

                <p className="text-sm text-indigo-600 font-medium mb-4">{expert.specialization}</p>

                <div className="space-y-3 mb-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    {expert.city}, {expert.state}
                  </div>

                  <div className="flex items-center gap-2">
                    <Briefcase size={16} />
                    {expert.experience}+ Years Experience
                  </div>

                  <div className="flex items-center gap-2 text-gray-800 font-semibold">
                    <IndianRupee size={16} />
                    {expert.consultationCharges} / session
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    className="flex-1 border border-gray-300 text-gray-700 text-center py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-gray-100"
                    onClick={() => navigate(`/experts/${expert._id}`)}
                  >
                    View Profile
                  </button>
                  <button className="flex-1 bg-indigo-600 text-white py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-indigo-700">
                    Send Query
                  </button>
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