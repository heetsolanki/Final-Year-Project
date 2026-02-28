import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackToTopButton from "../components/BackToTopButton";
import "../styles/about.css";
import {
  Scale,
  Shield,
  ShieldCheck,
  Lightbulb,
  Eye,
  ClipboardList,
  Lock,
  MessageSquare,
  Upload,
  Activity,
  Users,
  Search,
  Code2,
  User,
  Linkedin,
  Github,
} from "lucide-react";

const missions = [
  {
    id: 1,
    icon: <Lightbulb />,
    title: "Simplify Legal Access",
    text: "Break down complex legal processes into simple, actionable steps for every consumer.",
  },
  {
    id: 2,
    icon: <Eye />,
    title: "Increase Consumer Awareness",
    text: "Educate users about their fundamental rights through accessible resources and guidance.",
  },
  {
    id: 3,
    icon: <ClipboardList />,
    title: "Structured Query Management",
    text: "Provide an organized system to submit, track, and resolve legal queries efficiently.",
  },
  {
    id: 4,
    icon: <Lock />,
    title: "Secure Document Handling",
    text: "Ensure all uploaded documents and personal data are handled with industry-grade security.",
  },
];

const offers = [
  {
    id: 1,
    icon: <Shield />,
    title: "Secure User Accounts",
    text: "Protected sign-up and login with encrypted credentials.",
  },
  {
    id: 2,
    icon: <MessageSquare />,
    title: "Submit Legal Queries",
    text: "Easy-to-use form to describe your consumer complaint.",
  },
  {
    id: 3,
    icon: <Upload />,
    title: "Upload Supporting Documents",
    text: "Attach invoices, receipts, and evidence securely.",
  },
  {
    id: 4,
    icon: <Activity />,
    title: "Track Query Status",
    text: "Real-time updates on the progress of your complaint.",
  },
  {
    id: 5,
    icon: <Users />,
    title: "Expert Panel Access",
    text: "Connect with verified legal professionals for guidance.",
  },
  {
    id: 6,
    icon: <Search />,
    title: "Smart Legal Search",
    text: "Search consumer laws, acts, and legal precedents instantly.",
  },
];

function About() {
  return (
    <>
      <Navbar />

      <main className="pt-40">
        {/* HERO SECTION */}
        <section className="about-hero">
          <div className="about-hero-layout">
            {/* LEFT CONTENT */}
            <div>
              <h1 className="about-hero-title">
                Making Consumer <br />
                Rights Simple <br />& Accessible
              </h1>

              <div className="about-hero-underline"></div>

              <p className="about-hero-text">
                A structured digital platform designed to simplify consumer
                legal guidance. Know your rights, take action, and get the help
                you deserve.
              </p>
            </div>

            {/* RIGHT GRAPHIC */}
            <div className="about-hero-graphic">
              <div className="hero-ring-1"></div>
              <div className="hero-ring-2"></div>
              <div className="hero-ring-3"></div>

              <div className="hero-circle-main">
                <Scale />
                <div className="hero-circle-badge">
                  <Shield />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHO WE ARE */}
        <section className="who-section">
          <div className="who-layout">
            {/* LEFT CONTENT */}
            <div>
              <h2 className="section-title">Who We Are</h2>
              <div className="who-underline"></div>
              <p className="who-text">
                LawAssist is a consumer-rights-focused legal help platform that
                allows users to submit legal queries, upload documents, and
                track responses in an organized system. We bridge the gap
                between consumers and the legal support they need.
              </p>
              <p className="who-text">
                Our platform is designed with simplicity in mind, ensuring that
                anyone can navigate the complexities of consumer law without
                needing prior legal knowledge.
              </p>
            </div>

            {/* RIGHT CARD */}
            <div className="who-card">
              <div className="who-card-icon">
                <ShieldCheck />
              </div>
              <h3 className="who-card-title">Focused on Consumer Protection</h3>
              <p className="who-card-text">
                Every feature we build is centered around empowering consumers
                to understand and exercise their legal rights with confidence
                and clarity.
              </p>
            </div>
          </div>
        </section>

        {/* MISSION */}
        <section className="mission-section">
          <div className="container-custom">
            <h2 className="mission-title">Our Mission</h2>
            <div className="mission-underline"></div>

            <p className="mission-subtitle">
              We are committed to making legal support transparent, accessible,
              and structured for every consumer.
            </p>

            <div className="mission-grid">
              {missions.map((mission) => (
                <div key={mission.id} className="mission-card">
                  <div className="mission-icon-box">{mission.icon}</div>
                  <h3 className="mission-card-title">{mission.title}</h3>
                  <p className="mission-card-text">{mission.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHAT WE OFFER */}
        <section className="offer-section">
          <div className="container-custom">
            <h2 className="section-title">What We Offer</h2>
            <div className="section-underline"></div>

            <p className="section-subtitle">
              A comprehensive suite of tools designed to help you navigate
              consumer rights with ease.
            </p>

            <div className="offer-grid">
              {offers.map((offer) => (
                <div key={offer.id} className="feature-card">
                  <div className="feature-icon">{offer.icon}</div>
                  <h3 className="feature-title">{offer.title}</h3>
                  <p className="feature-text">{offer.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DEVELOPER SECTION */}
        <section className="dev-section">
          <h2 className="section-title">About the Developers</h2>
          <div className="section-underline"></div>

          <div className="dev-layout">
            {/* LEFT SIDE */}
            <div>
              <div className="dev-icon-box">
                <Code2 />
              </div>

              <h3 className="dev-left-title">Built as a BCA Major Project</h3>

              <p className="dev-left-text">
                This project was developed as a BCA Major Project with the aim
                of solving real-world consumer legal problems through
                technology. Built using the MERN Stack (MongoDB, Express.js,
                React.js, Node.js), it demonstrates full-stack development
                skills applied to a practical legal-tech use case.
              </p>

              <p className="dev-left-text">
                The focus throughout development has been on practical
                usability, structured system design, and delivering a platform
                that consumers can rely on for organized legal guidance.
              </p>

              <div className="dev-badges">
                <span className="dev-badge">MongoDB</span>
                <span className="dev-badge">Express.js</span>
                <span className="dev-badge">React.js</span>
                <span className="dev-badge">Node.js</span>
                <span className="dev-badge">JWT</span>
                <span className="dev-badge">REST API</span>
              </div>
            </div>

            {/* RIGHT SIDE CARD */}
            <div className="dev-card">
              <div className="dev-profile">
                <div className="dev-avatar">
                  <User />
                </div>

                <div>
                  <h4 className="dev-name">Heet Solanki</h4>
                  <p className="dev-role">Full Stack Developer</p>

                  <p className="dev-description">
                    Passionate about computer and related stuff.
                  </p>

                  <div className="dev-socials">
                    <a
                      href="https://www.linkedin.com/in/heetsolanki"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="dev-social-icon"
                    >
                      <Linkedin size={18} />
                    </a>

                    <a
                      href="https://github.com/heetsolanki"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="dev-social-icon"
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

      <Footer />
    </>
  );
}

export default About;
