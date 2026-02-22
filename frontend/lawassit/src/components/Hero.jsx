import { Scale, Shield, FileText, Users } from "lucide-react";

function Hero() {
  return (
    <section className="hero-section fade-up">
      <div className="hero-layout">

        {/* LEFT CONTENT */}
        <div className="max-w-xl">
          <h1 className="hero-title">
            Know Your Consumer Rights. Get Legal Help Instantly.
          </h1>

          <p className="hero-text">
            Submit complaints, connect with legal experts,
            and navigate your rights with confidence.
          </p>

          <div className="hero-buttons">
            <button className="btn-primary">
              Submit a Query
            </button>

            <button className="btn-outline">
              Explore Your Rights
            </button>
          </div>
        </div>

        {/* RIGHT MINI CARDS */}
        <div className="hero-grid">

          <div className="hero-card">
            <Scale size={30} />
            <h3 className="mt-3 font-semibold text-[#0A1F44]">
              Justice
            </h3>
          </div>

          <div className="hero-card">
            <Shield size={30} />
            <h3 className="mt-3 font-semibold text-[#0A1F44]">
              Protection
            </h3>
          </div>

          <div className="hero-card">
            <FileText size={30} />
            <h3 className="mt-3 font-semibold text-[#0A1F44]">
              Documents
            </h3>
          </div>

          <div className="hero-card">
            <Users size={30} />
            <h3 className="mt-3 font-semibold text-[#0A1F44]">
              Experts
            </h3>
          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;