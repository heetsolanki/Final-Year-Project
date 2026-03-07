import React from "react";
import {
  Shield,
  Info,
  ShoppingCart,
  MessageCircle,
  Scale,
  BookOpen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackToTopButton from "../components/BackToTopButton";

const ExploreRights = () => {
  const navigate = useNavigate();

  const rights = [
    {
      title: "Right to Safety",
      slug: "right-to-safety",
      description:
        "Protection against hazardous goods and unsafe services.",
      icon: <Shield size={28} />,
    },
    {
      title: "Right to be Informed",
      slug: "right-to-be-informed",
      description:
        "Right to receive accurate and complete product information.",
      icon: <Info size={28} />,
    },
    {
      title: "Right to Choose",
      slug: "right-to-choose",
      description:
        "Freedom to select from a variety of goods and services.",
      icon: <ShoppingCart size={28} />,
    },
    {
      title: "Right to be Heard",
      slug: "right-to-be-heard",
      description:
        "Right to raise complaints and have them addressed.",
      icon: <MessageCircle size={28} />,
    },
    {
      title: "Right to Seek Redressal",
      slug: "right-to-seek-redressal",
      description:
        "Right to claim compensation for defective goods or unfair practices.",
      icon: <Scale size={28} />,
    },
    {
      title: "Right to Consumer Awareness",
      slug: "right-to-consumer-awareness",
      description:
        "Right to be educated about consumer rights and responsibilities.",
      icon: <BookOpen size={28} />,
    },
  ];

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-14 pt-40">
        <div className="max-w-7xl mx-auto px-6">

          {/* Header Section */}
          <div className="text-center mb-14">
            <h2 className="section-title">Explore Your Consumer Rights</h2>
            <div className="section-underline"></div>
            <p className="section-subtitle">
              Learn about your legal protections under the Consumer Protection Act
              and understand how to take action if your rights are violated.
            </p>
          </div>

          {/* Rights Grid */}
          <div className="features-grid">
            {rights.map((right, index) => (
              <div
                key={index}
                className="feature-card"
                onClick={() => navigate(`/explore-rights/${right.slug}`)}
              >
                <div className="feature-icon">
                  {right.icon}
                </div>

                <h3 className="feature-title">{right.title}</h3>
                <p className="feature-description">{right.description}</p>

                <button className="mt-6 bg-[#0A1F44] text-white text-sm py-2 px-4 rounded-lg hover:bg-[#162f6a] transition">
                  Learn More
                </button>
              </div>
            ))}
          </div>

          {/* Info Strip */}
          <div className="mt-12 bg-blue-50 rounded-2xl p-6 text-center">
            <p className="text-gray-700 max-w-3xl mx-auto">
              Each right includes detailed explanations, real-life examples,
              and the option to ask a legal query or consult an expert.
            </p>
          </div>

        </div>
      </div>
      <BackToTopButton />

      <Footer />
    </>
  );
};

export default ExploreRights;