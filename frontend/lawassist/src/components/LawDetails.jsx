import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, ArrowLeft, Scale } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AskQueryForm from "../components/AskQueryForm";
import BackToTopButton from "./BackToTopButton";

const API = "https://law-assist.onrender.com/api";

const LawDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [law, setLaw] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const token = localStorage.getItem("token");
  const location = useLocation();
  const searchTerm = location.state?.searchTerm || "";

  let userRole = null;

  if (token) {
    const decoded = jwtDecode(token);
    userRole = decoded.role;
  }

  useEffect(() => {
    const fetchLaw = async () => {
      try {
        const res = await axios.get(`${API}/laws/${id}`);

        const fetchedLaw = res.data;
        setLaw(fetchedLaw);

        if (searchTerm) {
          const index = fetchedLaw.sections.findIndex((section) =>
            JSON.stringify(section)
              .toLowerCase()
              .includes(searchTerm.toLowerCase()),
          );

          if (index !== -1) {
            setActiveIndex(index);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchLaw();
  }, [id, searchTerm]);

  const toggleCard = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  if (!law) return null;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-36 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          {/* Back button */}

          <button
            onClick={() => navigate(-1)}
            className="text-[#1e3a8a] font-semibold cursor-pointer text-sm sm:text-base transition-all duration-200 flex items-center gap-2 mb-4 sm:mb-6 hover:text-yellow-500"
          >
            <ArrowLeft size={20} /> Back
          </button>

          {/* Header */}

          <div className="text-center mb-14">
            <h1 className="section-title">{law.alias}</h1>

            <div className="section-underline"></div>

            <p className="section-subtitle">{law.description.short}</p>
          </div>

          {/* Expandable Sections */}
          <div className="space-y-6">
            {law.sections.map((section, index) => {
              const isOpen = activeIndex === index;

              return (
                <div
                  key={index}
                  className={`border rounded-xl overflow-hidden transition duration-300
                  ${
                    isOpen
                      ? "border-[#0A1F44] shadow-lg bg-white"
                      : "border-gray-200 bg-white hover:shadow-md hover:-translate-y-[2px]"
                  }`}
                >
                  {/* Header */}
                  <button
                    onClick={() => toggleCard(index)}
                    className="w-full flex items-center justify-between p-6 text-left group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gray-100 text-[#0A1F44] transition-all duration-300 group-hover:bg-[#0A1F44] group-hover:text-white flex-shrink-0">
                        <Scale size={18} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[#0A1F44]">
                          {section.alias}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                          {section.description.short}
                        </p>
                      </div>
                    </div>

                    <ChevronDown
                      size={20}
                      className={`flex-shrink-0 transition duration-300 ${
                        isOpen ? "rotate-180 text-[#0A1F44]" : "text-gray-400"
                      }`}
                    />
                  </button>

                  {/* Expanded Content */}
                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      isOpen ? "max-h-[900px]" : "max-h-0"
                    }`}
                  >
                    <div className="border-t border-gray-200 p-6 space-y-6">
                      {/* Simple Explanation */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">
                          Simple Explanation
                        </h4>

                        <p className="text-gray-700 text-sm leading-relaxed">
                          {section.description.layman}
                        </p>
                      </div>

                      {/* Keywords */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">
                          Common Issues
                        </h4>

                        <div className="flex flex-wrap gap-2">
                          {section.keywords.map((keyword, i) => (
                            <span
                              key={i}
                              className="text-xs px-3 py-1 bg-gray-100 rounded-full text-gray-700 transition hover:bg-[#0A1F44] hover:text-white cursor-default"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Technical */}
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h4 className="font-semibold text-gray-800 mb-2">
                          Legal Reference
                        </h4>

                        <p className="text-sm text-gray-600">
                          {section.description.technical}
                        </p>
                      </div>

                      {/* Ask Query */}
                      <div className="pt-4 border-t border-gray-200">
                        {!showForm && userRole !== "legalExpert" && (
                          <>
                            <h4 className="font-semibold text-gray-800 mb-3">
                              Still Confused? Ask a Question!
                            </h4>
                            <div className="flex justify-start mb-6">
                              <button
                                className="bg-[#1E3A8A] hover:bg-blue-700 text-white font-medium w-full sm:w-auto py-2.5 px-6 rounded-lg transition"
                                onClick={() => setShowForm(true)}
                              >
                                + Ask a Question
                              </button>
                            </div>
                          </>
                        )}

                        {/* Form */}
                        {showForm && (
                          <AskQueryForm onClose={() => setShowForm(false)} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <BackToTopButton />
      <Footer />
    </>
  );
};

export default LawDetails;
