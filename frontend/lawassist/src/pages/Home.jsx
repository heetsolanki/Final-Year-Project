import { useState } from "react";
import useScrollReveal from "../hooks/useScrollReveal";
import BackToTopButton from "../components/layout/BackToTopButton";
import { miniCards, features, steps, homeCategories } from "../data";

function Home() {
  useScrollReveal();
  const [flippedCards, setFlippedCards] = useState({});

  const featureBackText = {
    "Submit Legal Query": "Describe your issue clearly and route it to the right legal workflow.",
    "Upload Documents": "Attach invoices, chats, and receipts to strengthen your case.",
    "Secure Storage": "Your legal files stay protected with privacy-focused handling.",
    "Track Query Status": "Follow each stage from review to answer and resolution.",
    "Expert Panel Access": "Connect with active verified experts for practical legal direction.",
    "Smart Legal Search": "Find relevant consumer rights topics and legal references faster.",
  };

  const categoryBackText = {
    "Shopping & Marketplace Issues": "Covers refunds, delivery failures, wrong items, and unfair sellers.",
    "Health & Safety": "Addresses unsafe products, service negligence, and safety concerns.",
    "Digital & Telecom": "Includes online scams, unauthorized deductions, and telecom complaints.",
    "Financial Services": "For banking disputes, insurance claim issues, and payment-related problems.",
    "Housing & Property": "Helps with builder delays, rental disputes, and possession concerns.",
    "Travel & Transport": "Supports refund, cancellation, overcharge, and service-quality disputes.",
    Utilities: "Handles electricity, water, and utility billing or service interruptions.",
    Education: "For fee disputes, false promises, and institutional service issues.",
  };

  const toggleFlipCard = (key) => {
    if (typeof window !== "undefined" && window.innerWidth > 768) return;
    setFlippedCards((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      {/* HERO SECTION */}
      <section className="pt-36 sm:pt-44 lg:pt-56 bg-white mb-12 sm:mb-16 lg:mb-20 fade-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12 lg:gap-16">
          {/* LEFT CONTENT */}
          <div className="max-w-xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A1F44] leading-tight sm:leading-snug text-center lg:text-left">
              Know Your Consumer Rights. Get Legal Help Instantly.
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-600 text-center lg:text-left">
              Submit complaints, connect with legal experts, and navigate your
              rights with confidence.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
              <button
                className="bg-[#1e3a8a] text-white px-4 py-2.5 md:px-6 md:py-3 rounded-lg hover:bg-[#123A6F] transition w-full sm:w-auto text-center"
                onClick={() => (window.location.href = "/queries")}
              >
                Submit a Query
              </button>
              <button
                className="border border-[#1e3a8a] text-[#1e3a8a] px-4 py-2.5 md:px-6 md:py-3 rounded-lg hover:bg-[#1e3a8a] hover:text-white transition w-full sm:w-auto text-center"
                onClick={() => (window.location.href = "/explore-rights")}
              >
                Explore Your Rights
              </button>
            </div>
          </div>

          {/* RIGHT MINI CARDS */}
          <div className="w-full max-w-xl bg-gray-100 p-4 sm:p-6 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {miniCards.map((card) => (
              <div
                key={card.id}
                className="bg-white w-full min-h-[8rem] sm:min-h-[10rem] rounded-xl shadow-md transition hover:shadow-lg text-sm sm:text-base px-3 py-3 sm:px-4 sm:py-4"
              >
                <div className="h-full">
                  <div className="flex h-full flex-col items-center justify-center px-3 py-3">
                    {card.icon}
                    <h3 className="mt-3 font-semibold text-[#0A1F44] text-center">{card.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[#f6f8fb] fade-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="section-title">Our Key Features</h2>
            <div className="section-underline"></div>
            <p className="section-subtitle">
              Everything you need to navigate consumer rights and get the legal
              help you deserve.
            </p>
          </div>

          {/* Features Grid */}
          <div className="features-grid max-md:mt-12 max-md:gap-6">
            {features.map((feature) => (
              <div
                key={feature.id}
                className={`feature-card info-flip-card max-md:px-6 max-md:py-6 ${flippedCards[`feature-${feature.id}`] ? "is-flipped" : ""}`}
                onClick={() => toggleFlipCard(`feature-${feature.id}`)}
              >
                <div className="info-flip-inner">
                  <div className="info-flip-face">
                    <div className="feature-icon">{feature.icon}</div>
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-text">{feature.text}</p>
                  </div>
                  <div className="info-flip-face info-flip-back rounded-2xl border border-blue-100 bg-[#f8fafc] p-6 flex flex-col justify-center">
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-text">{featureBackText[feature.title] || feature.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="bg-white py-16 sm:py-20 lg:py-24 text-center fade-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 text-center">
          {/* Heading */}
          <h2 className="section-title">How It Works</h2>
          <div className="section-underline"></div>
          <p className="section-subtitle">
            Four simple steps to get the legal help you need.
          </p>
          {/* Steps */}
          <div className="max-w-7xl mx-auto px-2 sm:px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mt-12 sm:mt-16 lg:mt-20 relative">
            {/* Horizontal line */}
            <div className="hidden lg:block absolute top-8 left-[5%] w-[90%] h-[2px] bg-gray-300"></div>
            {steps.map((step) => (
              <div key={step.id} className="relative">
                <div className="w-16 h-16 bg-[#1e3a8a] text-white rounded-full flex items-center justify-center mx-auto font-semibold">
                  {step.id}
                </div>
                <div className="w-12 h-12 bg-[#e7dfc8] text-[#C9A227] rounded-lg flex items-center justify-center mx-auto my-6">
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold text-[#0A1F44] mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 text-center">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[#f6f8fb] fade-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Heading */}
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="section-title">Consumer Rights Categories</h2>
            <div className="section-underline"></div>
            <p className="section-subtitle">
              Select a category to learn about your rights and find relevant
              legal guidance.
            </p>
          </div>
          {/* Grid */}
          <div className="features-grid max-md:mt-12 max-md:gap-6">
            {homeCategories.map((category) => (
              <div
                key={category.id}
                className={`feature-card info-flip-card max-md:px-6 max-md:py-6 ${flippedCards[`category-${category.id}`] ? "is-flipped" : ""}`}
                onClick={() => toggleFlipCard(`category-${category.id}`)}
              >
                <div className="info-flip-inner">
                  <div className="info-flip-face">
                    <div className="feature-icon">{category.icon}</div>
                    <h3 className="feature-title">{category.title}</h3>
                    <p className="feature-text">{category.text}</p>
                  </div>
                  <div className="info-flip-face info-flip-back rounded-2xl border border-blue-100 bg-[#f8fafc] p-6 flex flex-col justify-center">
                    <h3 className="feature-title">{category.title}</h3>
                    <p className="feature-text">{categoryBackText[category.title] || category.text}</p>
                    <p className="text-xs text-[#1E3A8A] font-medium mt-3">Use this category to file a focused legal query.</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <BackToTopButton />
    </>
  );
}

export default Home;
