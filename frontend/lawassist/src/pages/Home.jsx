import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/home.css";

import useScrollReveal from "../hooks/useScrollReveal";
import BackToTopButton from "../components/BackToTopButton";
import { miniCards, features, steps, homeCategories } from "../data";

function Home() {
  useScrollReveal();
  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section className="hero-section fade-up">
        <div className="hero-layout">
          {/* LEFT CONTENT */}
          <div className="max-w-xl">
            <h1 className="hero-title">
              Know Your Consumer Rights. Get Legal Help Instantly.
            </h1>
            <p className="hero-text">
              Submit complaints, connect with legal experts, and navigate your
              rights with confidence.
            </p>
            <div className="hero-buttons">
              <button className="home-btn-primary" onClick={() => window.location.href = '/queries'}>Submit a Query</button>

              <button className="home-btn-outline" onClick={() => window.location.href = '/explore-rights'}>Explore Your Rights</button>
            </div>
          </div>

          {/* RIGHT MINI CARDS */}
          <div className="hero-grid">
            {miniCards.map((card) => (
              <div key={card.id} className="hero-card">
                {card.icon}
                <h3 className="mt-3 font-semibold text-[#0A1F44]">
                  {card.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features-section fade-up">
        <div className="container-custom">
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
          <div className="features-grid">
            {features.map((feature) => (
              <div key={feature.id} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-text">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="how-section fade-up">
        <div className="container-custom text-center">
          {/* Heading */}
          <h2 className="section-title">How It Works</h2>
          <div className="section-underline"></div>
          <p className="section-subtitle">
            Four simple steps to get the legal help you need.
          </p>
          {/* Steps */}
          <div className="how-grid">
            {/* Horizontal line */}
            <div className="how-line"></div>
            {steps.map((step) => (
              <div key={step.id} className="relative">
                <div className="how-number">{step.id}</div>
                <div className="how-icon">{step.icon}</div>
                <h3 className="how-title">{step.title}</h3>
                <p className="how-text">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="section-padding bg-[#f6f8fb] fade-up">
        <div className="container-custom">
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
          <div className="features-grid">
            {homeCategories.map((category) => (
              <div key={category.id} className="feature-card">
                <div className="feature-icon">{category.icon}</div>
                <h3 className="feature-title">{category.title}</h3>
                <p className="feature-text">{category.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <BackToTopButton />

      <Footer />
    </>
  );
}

export default Home;
