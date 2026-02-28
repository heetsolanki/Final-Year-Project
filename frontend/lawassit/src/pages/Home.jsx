import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/home.css";
import {
  Scale,
  Shield,
  FileText,
  Users,
  MessageSquare,
  Search,
  LayoutDashboard,
  ClipboardList,
  UserPlus,
  Upload,
  Gavel,
  ShoppingCart,
  Landmark,
  Package,
  ShieldCheck,
  Building,
} from "lucide-react";

import useScrollReveal from "../hooks/useScrollReveal";
import BackToTopButton from "../components/BackToTopButton";

const miniCards = [
  {
    id: 1,
    icon: <Scale size={30} />,
    title: "Justice",
  },
  {
    id: 2,
    icon: <Shield size={30} />,
    title: "Protection",
  },
  {
    id: 3,
    icon: <FileText size={30} />,
    title: "Documents",
  },
  {
    id: 4,
    icon: <Users size={30} />,
    title: "Experts",
  },
];

const features = [
  {
    id: 1,
    icon: <MessageSquare size={22} />,
    title: "Submit Legal Query",
    text: "Easily submit your consumer complaints and legal questions through our streamlined form.",
  },
  {
    id: 2,
    icon: <Upload size={22} />,
    title: "Upload Documents",
    text: "Easily upload and manage your legal documents securely.",
  },
  {
    id: 3,
    icon: <ShieldCheck size={22} />,
    title: "Secure Storage",
    text: "All your documents are securely stored and protected.",
  },
  {
    id: 4,
    icon: <Search size={22} />,
    title: "Search Legal Resources",
    text: "Find relevant legal resources and information quickly.",
  },
  {
    id: 5,
    icon: <LayoutDashboard size={22} />,
    title: "Dashboard Overview",
    text: "View your legal queries and documents in one centralized dashboard.",
  },
  {
    id: 6,
    icon: <ClipboardList size={22} />,
    title: "Track Legal Progress",
    text: "Monitor the status of your legal queries and documents.",
  },
];

const steps = [
  {
    id: 1,
    icon: <UserPlus size={22} />,
    title: "Register / Login",
    text: "Create your secure account to get started with LawAssist.",
  },
  {
    id: 2,
    icon: <FileText size={22} />,
    title: "Submit Complaint",
    text: "Describe your consumer issue using our guided query form.",
  },
  {
    id: 3,
    icon: <Upload size={22} />,
    title: "Upload Documents",
    text: "Attach supporting evidence like receipts and contracts.",
  },
  {
    id: 4,
    icon: <Gavel size={22} />,
    title: "Get Expert Guidance",
    text: "Receive personalized legal advice from verified experts.",
  },
];

const categories = [
  {
    id: 1,
    icon: <ShoppingCart size={22} />,
    title: "E-commerce & Online Shopping",
    text: "Disputes with online purchases, refunds, and delivery issues.",
  },
  {
    id: 2,
    icon: <Landmark size={22} />,
    title: "Banking & Financial Issues",
    text: "Unfair charges, loan disputes, and financial fraud complaints.",
  },
  {
    id: 3,
    icon: <Package size={22} />,
    title: "Product Defects",
    text: "Manufacturing defects, warranty claims, and faulty goods.",
  },
  {
    id: 4,
    icon: <ShieldCheck size={22} />,
    title: "Insurance Complaints",
    text: "Claim rejections, delays, and unfair policy practices.",
  },
  {
    id: 5,
    icon: <Building size={22} />,
    title: "Real Estate Issues",
    text: "Property disputes, builder defaults, and tenant rights.",
  },
];

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
              <button className="home-btn-primary">Submit a Query</button>

              <button className="home-btn-outline">Explore Your Rights</button>
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
            {categories.map((category) => (
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
