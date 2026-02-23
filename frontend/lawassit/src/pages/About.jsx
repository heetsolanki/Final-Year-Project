import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
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
              <h2 className="who-title">Who We Are</h2>
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
              <div className="mission-card">
                <div className="mission-icon-box">
                  <Lightbulb />
                </div>
                <h3 className="mission-card-title">Simplify Legal Access</h3>
                <p className="mission-card-text">
                  Break down complex legal processes into simple, actionable
                  steps for every consumer.
                </p>
              </div>

              <div className="mission-card">
                <div className="mission-icon-box">
                  <Eye />
                </div>
                <h3 className="mission-card-title">
                  Increase Consumer Awareness
                </h3>
                <p className="mission-card-text">
                  Educate users about their fundamental rights through
                  accessible resources and guidance.
                </p>
              </div>

              <div className="mission-card">
                <div className="mission-icon-box">
                  <ClipboardList />
                </div>
                <h3 className="mission-card-title">
                  Structured Query Management
                </h3>
                <p className="mission-card-text">
                  Provide an organized system to submit, track, and resolve
                  legal queries efficiently.
                </p>
              </div>

              <div className="mission-card">
                <div className="mission-icon-box">
                  <Lock />
                </div>
                <h3 className="mission-card-title">Secure Document Handling</h3>
                <p className="mission-card-text">
                  Ensure all uploaded documents and personal data are handled
                  with industry-grade security.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT WE OFFER */}
        <section className="offer-section">
          <div className="container-custom">
            <h2 className="offer-title">What We Offer</h2>
            <div className="offer-underline"></div>

            <p className="offer-subtitle">
              A comprehensive suite of tools designed to help you navigate
              consumer rights with ease.
            </p>

            <div className="offer-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <Shield />
                </div>
                <h3 className="feature-title">Secure User Accounts</h3>
                <p className="feature-text">
                  Protected sign-up and login with encrypted credentials.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <MessageSquare />
                </div>
                <h3 className="feature-title">Submit Legal Queries</h3>
                <p className="feature-text">
                  Easy-to-use form to describe your consumer complaint.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <Upload />
                </div>
                <h3 className="feature-title">Upload Supporting Documents</h3>
                <p className="feature-text">
                  Attach invoices, receipts, and evidence securely.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <Activity />
                </div>
                <h3 className="feature-title">Track Query Status</h3>
                <p className="feature-text">
                  Real-time updates on the progress of your complaint.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <Users />
                </div>
                <h3 className="feature-title">Expert Panel Access</h3>
                <p className="feature-text">
                  Connect with verified legal professionals for guidance.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <Search />
                </div>
                <h3 className="feature-title">Smart Legal Search</h3>
                <p className="feature-text">
                  Search consumer laws, acts, and legal precedents instantly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* DEVELOPER SECTION */}
        <section className="dev-section">
          <h2 className="dev-title">About the Developers</h2>
          <div className="dev-underline"></div>

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
                  <h4 className="dev-name">Your Name</h4>
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

      <Footer />
    </>
  );
}

export default About;
