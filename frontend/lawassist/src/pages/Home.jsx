import useScrollReveal from "../hooks/useScrollReveal";
import BackToTopButton from "../components/layout/BackToTopButton";
import { miniCards, features, steps, homeCategories } from "../data";

function Home() {
  useScrollReveal();
  return (
    <>
      {/* HERO SECTION */}
      <section className="pt-56 max-md:pt-40 bg-white mb-20 max-md:mb-12 fade-up">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-16 max-md:gap-10">
          {/* LEFT CONTENT */}
          <div className="max-w-xl">
            <h1 className="text-5xl max-md:text-3xl font-bold text-[#0A1F44] leading-tight max-md:leading-snug max-md:text-center">
              Know Your Consumer Rights. Get Legal Help Instantly.
            </h1>
            <p className="mt-6 text-lg max-md:text-base text-gray-600 max-md:text-center">
              Submit complaints, connect with legal experts, and navigate your
              rights with confidence.
            </p>
            <div className="mt-8 flex gap-4 max-md:flex-col max-md:items-center">
              <button
                className="bg-[#1e3a8a] text-white px-7 py-3 rounded-lg hover:bg-[#123A6F] transition max-md:w-full max-md:text-center"
                onClick={() => (window.location.href = "/queries")}
              >
                Submit a Query
              </button>
              <button
                className="border border-[#1e3a8a] text-[#1e3a8a] px-7 py-3 rounded-lg hover:bg-[#1e3a8a] hover:text-white transition max-md:w-full max-md:text-center"
                onClick={() => (window.location.href = "/explore-rights")}
              >
                Explore Your Rights
              </button>
            </div>
          </div>

          {/* RIGHT MINI CARDS */}
          <div className="bg-gray-100 p-6 max-md:p-4 rounded-2xl grid grid-cols-2 gap-6 max-md:gap-4">
            {miniCards.map((card) => (
              <div
                key={card.id}
                className="bg-white w-40 max-md:w-full h-40 max-md:h-32 flex flex-col items-center justify-center rounded-xl shadow-md transition hover:shadow-lg max-md:text-sm max-md:px-4 max-md:py-3"
              >
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
      <section className="py-24 max-md:py-16 fade-up">
        <div className="max-w-7xl mx-auto px-6">
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
                className="feature-card max-md:px-6 max-md:py-6"
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-text">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="bg-white py-24 max-md:py-16 text-center fade-up">
        <div className="max-w-7xl mx-auto px-6 text-center">
          {/* Heading */}
          <h2 className="section-title">How It Works</h2>
          <div className="section-underline"></div>
          <p className="section-subtitle">
            Four simple steps to get the legal help you need.
          </p>
          {/* Steps */}
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-md:gap-12 mt-20 max-md:mt-14 relative">
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
      <section className="py-24 max-md:py-16 bg-[#f6f8fb] fade-up">
        <div className="max-w-7xl mx-auto px-6">
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
                className="feature-card max-md:px-6 max-md:py-6"
              >
                <div className="feature-icon">{category.icon}</div>
                <h3 className="feature-title">{category.title}</h3>
                <p className="feature-text">{category.text}</p>
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
