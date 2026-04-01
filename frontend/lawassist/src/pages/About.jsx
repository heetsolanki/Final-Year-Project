import BackToTopButton from "../components/layout/BackToTopButton";
import { useState } from "react";
import {
  Scale,
  Shield,
  ShieldCheck,
  Code2,
  User,
  Linkedin,
  Github,
} from "lucide-react";
import { missions, offers } from "../data";
import profile from "../assets/profile.png";

function About() {
  const [flippedCards, setFlippedCards] = useState({});
  const [profileImageError, setProfileImageError] = useState(false);

  const toggleFlipCard = (key) => {
    if (typeof window !== "undefined" && window.innerWidth > 768) return;
    setFlippedCards((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const missionBackText = {
    "Simplify Legal Access": "Break complex legal language into simple action points.",
    "Increase Consumer Awareness": "Help users identify violations and take timely action.",
    "Structured Query Management": "Track each complaint from submission to final outcome.",
    "Secure Document Handling": "Keep legal evidence protected and accessible when needed.",
  };

  const offerBackText = {
    "Secure User Accounts": "Hardened login flow with role-based protection for safer access.",
    "Submit Legal Queries": "Guided form helps users submit focused and complete complaints.",
    "Upload Supporting Documents": "Evidence uploads improve clarity and strengthen legal review.",
    "Track Query Status": "Real-time status visibility with clear next-step communication.",
    "Expert Panel Access": "Connect with verified experts for practical legal direction.",
    "Smart Legal Search": "Quickly surface relevant rights and legal information by topic.",
  };

  return (
    <>
      <main className="pt-40">
        {/* HERO SECTION */}
        <section
          className="pt-24 max-md:pt-16 pb-24 max-md:pb-16 relative overflow-hidden"
          style={{
            backgroundColor: "#f9fafc",
            backgroundImage:
              "repeating-linear-gradient(135deg, rgba(10,31,68,0.03) 0px, rgba(10,31,68,0.03) 1px, transparent 1px, transparent 14px)",
          }}
        >
          <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-16 max-md:gap-10 max-md:text-center relative z-10">
            {/* LEFT CONTENT */}
            <div>
              <h1 className="text-6xl max-md:text-3xl font-bold text-[#0A1F44] leading-tight max-md:leading-snug max-md:text-center">
                Making Consumer <br />
                Rights Simple <br />& Accessible
              </h1>

              <div className="w-16 h-1 bg-[#C9A227] my-8 max-md:my-6 rounded-full max-md:mx-auto"></div>

              <p className="text-lg max-md:text-base text-gray-600 max-w-lg leading-relaxed max-md:text-center max-md:mx-auto">
                A structured digital platform designed to simplify consumer
                legal guidance. Know your rights, take action, and get the help
                you deserve.
              </p>
            </div>

            {/* RIGHT GRAPHIC */}
            <div className="relative flex items-center justify-center">
              <div
                className="absolute rounded-full max-md:w-[220px] max-md:h-[220px] w-[340px] h-[340px]"
                style={{ background: "rgba(10,31,68,0.05)" }}
              ></div>
              <div
                className="absolute rounded-full max-md:w-[180px] max-md:h-[180px] w-[280px] h-[280px]"
                style={{ background: "rgba(10,31,68,0.08)" }}
              ></div>
              <div
                className="absolute rounded-full max-md:w-[140px] max-md:h-[140px] w-[220px] h-[220px]"
                style={{ background: "rgba(10,31,68,0.12)" }}
              ></div>

              <div className="w-[180px] h-[180px] max-md:w-[120px] max-md:h-[120px] bg-[#0A1F44] rounded-full flex items-center justify-center relative z-10">
                <Scale className="w-16 h-16 max-md:w-10 max-md:h-10 text-[#C9A227]" />
                <div
                  className="absolute top-0 right-0 w-14 h-14 max-md:w-10 max-md:h-10 bg-[#C9A227] rounded-full flex items-center justify-center shadow-xl z-20"
                  style={{ transform: "translate(30%, -30%)" }}
                >
                  <Shield className="w-6 h-6 max-md:w-6 max-md:h-6 text-[#0A1F44]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHO WE ARE */}
        <section className="bg-[#f4f6f9] py-24">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 max-md:gap-12 items-center max-md:text-center">
            {/* LEFT CONTENT */}
            <div>
              <h2 className="section-title">Who We Are</h2>
              <div className="w-16 h-1 bg-[#C9A227] my-6 rounded-full max-md:mx-auto"></div>
              <p className="text-gray-600 leading-relaxed mb-6 max-w-xl">
                LawAssist is a consumer-rights-focused legal help platform that
                allows users to submit legal queries, upload documents, and
                track responses in an organized system. We bridge the gap
                between consumers and the legal support they need.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6 max-w-xl">
                Our platform is designed with simplicity in mind, ensuring that
                anyone can navigate the complexities of consumer law without
                needing prior legal knowledge.
              </p>
            </div>

            {/* RIGHT CARD */}
            <div
              className="bg-white rounded-2xl shadow-lg p-10 max-md:p-6 relative w-full h-full"
              style={{ borderTop: "4px solid #C9A227" }}
            >
              <div className="w-16 h-16 bg-[#0A1F44] rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8 text-[#C9A227]" />
              </div>
              <h3 className="text-xl font-semibold text-[#0A1F44] mb-4">
                Focused on Consumer Protection
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Every feature we build is centered around empowering consumers
                to understand and exercise their legal rights with confidence
                and clarity.
              </p>
            </div>
          </div>
        </section>

        {/* MISSION */}
        <section className="bg-[#0A1F44] py-24 text-center">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl max-md:text-2xl font-bold text-white">
              Our Mission
            </h2>
            <div className="w-16 h-1 bg-[#C9A227] mx-auto my-6 rounded-full"></div>

            <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
              We are committed to making legal support transparent, accessible,
              and structured for every consumer.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-10 max-md:gap-6 mt-20 max-md:mt-12">
              {missions.map((mission) => (
                <div
                  key={mission.id}
                  className={`info-flip-card bg-[#f3f4f6] rounded-2xl p-10 max-md:p-6 text-left shadow-lg relative ${flippedCards[`mission-${mission.id}`] ? "is-flipped" : ""}`}
                  onClick={() => toggleFlipCard(`mission-${mission.id}`)}
                  style={{ borderTop: "4px solid #C9A227" }}
                >
                  <div className="info-flip-inner">
                    <div className="info-flip-face">
                      <div className="w-14 h-14 bg-[#e9e3d2] rounded-xl flex items-center justify-center mb-6">
                        <span className="[&>svg]:w-6 [&>svg]:h-6 [&>svg]:text-[#C9A227]">
                          {mission.icon}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-[#0A1F44] mb-4">
                        {mission.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-sm">
                        {mission.text}
                      </p>
                    </div>
                    <div className="info-flip-face info-flip-back rounded-2xl border border-blue-100 bg-[#f8fafc] p-6 flex flex-col justify-center">
                      <p className="text-sm text-gray-700 leading-relaxed font-medium">
                        {missionBackText[mission.title] || mission.text}
                      </p>
                      <ul className="mt-3 space-y-1 text-xs text-gray-600 list-disc pl-4">
                        <li>Consumer-first legal guidance</li>
                        <li>Structured and trackable workflow</li>
                        <li>Practical outcomes over legal jargon</li>
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHAT WE OFFER */}
        <section className="bg-[#f4f6f9] py-24 text-center">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="section-title">What We Offer</h2>
            <div className="section-underline"></div>

            <p className="section-subtitle">
              A comprehensive suite of tools designed to help you navigate
              consumer rights with ease.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-md:gap-6 mt-20 max-md:mt-12 text-left">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className={`feature-card info-flip-card ${flippedCards[`offer-${offer.id}`] ? "is-flipped" : ""}`}
                  onClick={() => toggleFlipCard(`offer-${offer.id}`)}
                >
                  <div className="info-flip-inner">
                    <div className="info-flip-face">
                      <div className="feature-icon">{offer.icon}</div>
                      <h3 className="feature-title">{offer.title}</h3>
                      <p className="feature-text">{offer.text}</p>
                    </div>
                    <div className="info-flip-face info-flip-back rounded-2xl border border-blue-100 bg-[#f8fafc] p-6 flex flex-col justify-center">
                      <p className="feature-text text-gray-700 font-medium">{offerBackText[offer.title] || offer.text}</p>
                      <ul className="mt-3 space-y-1 text-xs text-gray-600 list-disc pl-4">
                        <li>Designed for real consumer disputes</li>
                        <li>Easy-to-understand user flow</li>
                        <li>Clear legal support pathway</li>
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DEVELOPER SECTION */}
        <section className="bg-white py-24 text-center">
          <h2 className="section-title">About the Developers</h2>
          <div className="section-underline"></div>

          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 max-md:gap-12 items-center mt-20 max-md:mt-12 text-left">
            {/* LEFT SIDE */}
            <div>
              <div className="w-16 h-16 bg-[#0A1F44] rounded-2xl flex items-center justify-center mb-6">
                <Code2 className="w-8 h-8 text-[#C9A227]" />
              </div>

              <h3 className="text-2xl font-semibold text-[#0A1F44] mb-6">
                Built as a BCA Major Project
              </h3>

              <p className="text-gray-600 leading-relaxed mb-6">
                This project was developed as a BCA Major Project with the aim
                of solving real-world consumer legal problems through
                technology. Built using the MERN Stack (MongoDB, Express.js,
                React.js, Node.js), it demonstrates full-stack development
                skills applied to a practical legal-tech use case.
              </p>

              <p className="text-gray-600 leading-relaxed mb-6">
                The focus throughout development has been on practical
                usability, structured system design, and delivering a platform
                that consumers can rely on for organized legal guidance.
              </p>

              <div className="flex flex-wrap gap-4 mt-8">
                {[
                  "MongoDB",
                  "Express.js",
                  "React.js",
                  "Node.js",
                  "JWT",
                  "REST API",
                ].map((badge) => (
                  <span
                    key={badge}
                    className="px-5 py-2 rounded-full bg-white border border-gray-300 text-sm text-[#0A1F44]"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* RIGHT SIDE CARD */}
            <div className="bg-white rounded-2xl shadow-xl p-10">
              <div className="flex items-start gap-6 max-md:flex-col max-md:items-center max-md:text-center">
                <div className="w-20 h-20 min-w-20 min-h-20 shrink-0 bg-gray-200 rounded-full flex items-center justify-center max-md:mx-auto overflow-hidden ring-2 ring-[#0A1F44]/10">
                  {!profileImageError ? (
                    <img
                      src={profile}
                      alt="Developer profile"
                      className="w-full h-full object-cover object-center"
                      onError={() => setProfileImageError(true)}
                    />
                  ) : (
                    <User className="w-10 h-10 text-gray-500" />
                  )}
                </div>

                <div>
                  <h4 className="text-xl font-semibold text-[#0A1F44]">
                    Heet Solanki
                  </h4>
                  <p className="text-[#C9A227] font-medium mt-1">
                    Full Stack Developer
                  </p>

                  <p className="text-gray-600 mt-4 leading-relaxed">
                    Passionate about computer and related stuff. Love to design the UI of the websites and make them look good. Always eager to learn new technologies and implement them in projects. Eager to solve real-world problems through technology and innovation.
                  </p>

                  <div className="flex gap-4 mt-6 max-md:justify-center">
                    <a
                      href="https://www.linkedin.com/in/heetsolanki"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer transition hover:bg-[#0A1F44] hover:text-white"
                    >
                      <Linkedin size={18} />
                    </a>

                    <a
                      href="https://github.com/heetsolanki"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer transition hover:bg-[#0A1F44] hover:text-white"
                    >
                      <Github size={18} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <BackToTopButton />
    </>
  );
}

export default About;
