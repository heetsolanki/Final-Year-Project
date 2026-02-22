import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Scale,
  Shield,
  FileText,
  Users,
  MessageSquare,
  UploadCloud,
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
              <button className="btn-primary">Submit a Query</button>

              <button className="btn-outline">Explore Your Rights</button>
            </div>
          </div>

          {/* RIGHT MINI CARDS */}
          <div className="hero-grid">
            <div className="hero-card">
              <Scale size={30} />
              <h3 className="mt-3 font-semibold text-[#0A1F44]">Justice</h3>
            </div>

            <div className="hero-card">
              <Shield size={30} />
              <h3 className="mt-3 font-semibold text-[#0A1F44]">Protection</h3>
            </div>

            <div className="hero-card">
              <FileText size={30} />
              <h3 className="mt-3 font-semibold text-[#0A1F44]">Documents</h3>
            </div>

            <div className="hero-card">
              <Users size={30} />
              <h3 className="mt-3 font-semibold text-[#0A1F44]">Experts</h3>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features-section fade-up">
        <div className="container-custom">
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-[#0A1F44]">
              Our Key Features
            </h2>

            <p className="mt-4 text-gray-600 text-lg">
              Everything you need to navigate consumer rights and get the legal
              help you deserve.
            </p>
          </div>

          {/* Features Grid */}
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <MessageSquare size={22} />
              </div>
              <h3 className="feature-title">Submit Legal Query</h3>
              <p className="feature-text">
                Easily submit your consumer complaints and legal questions
                through our streamlined form.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <UploadCloud size={22} />
              </div>
              <h3 className="feature-title">Upload Supporting Documents</h3>
              <p className="feature-text">
                Attach receipts, contracts, or any evidence to strengthen your
                case.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Users size={22} />
              </div>
              <h3 className="feature-title">Expert Consultation</h3>
              <p className="feature-text">
                Connect with verified legal professionals who specialize in
                consumer rights.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Search size={22} />
              </div>
              <h3 className="feature-title">Smart Legal Search</h3>
              <p className="feature-text">
                Search through our comprehensive database of consumer laws and
                precedents.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <LayoutDashboard size={22} />
              </div>
              <h3 className="feature-title">Secure Dashboard</h3>
              <p className="feature-text">
                Manage all your queries, documents, and consultations from one
                secure dashboard.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <ClipboardList size={22} />
              </div>
              <h3 className="feature-title">Track Complaint Status</h3>
              <p className="feature-text">
                Stay updated with real-time tracking of your complaint progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="how-section fade-up">
        <div className="container-custom text-center">
          {/* Heading */}
          <h2 className="text-3xl font-bold text-[#0A1F44]">How It Works</h2>

          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Four simple steps to get the legal help you need.
          </p>

          {/* Steps */}
          <div className="how-grid">
            {/* Horizontal line */}
            <div className="how-line"></div>

            {/* Step 1 */}
            <div className="relative">
              <div className="how-number">1</div>
              <div className="how-icon">
                <UserPlus size={22} />
              </div>
              <h3 className="how-title">Register / Login</h3>
              <p className="how-text">
                Create your secure account to get started with LawAssist.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="how-number">2</div>
              <div className="how-icon">
                <FileText size={22} />
              </div>
              <h3 className="how-title">Submit Complaint</h3>
              <p className="how-text">
                Describe your consumer issue using our guided query form.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="how-number">3</div>
              <div className="how-icon">
                <Upload size={22} />
              </div>
              <h3 className="how-title">Upload Documents</h3>
              <p className="how-text">
                Attach supporting evidence like receipts and contracts.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative">
              <div className="how-number">4</div>
              <div className="how-icon">
                <Gavel size={22} />
              </div>
              <h3 className="how-title">Get Expert Guidance</h3>
              <p className="how-text">
                Receive personalized legal advice from verified experts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="section-padding bg-[#f6f8fb] fade-up">
        <div className="container-custom">
          {/* Heading */}
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-[#0A1F44]">
              Consumer Rights Categories
            </h2>

            <p className="mt-4 text-lg text-gray-600">
              Select a category to learn about your rights and find relevant
              legal guidance.
            </p>
          </div>

          {/* Grid */}
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <ShoppingCart size={22} />
              </div>
              <h3 className="feature-title">E-commerce & Online Shopping</h3>
              <p className="feature-text">
                Disputes with online purchases, refunds, and delivery issues.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Landmark size={22} />
              </div>
              <h3 className="feature-title">Banking & Financial Issues</h3>
              <p className="feature-text">
                Unfair charges, loan disputes, and financial fraud complaints.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Package size={22} />
              </div>
              <h3 className="feature-title">Product Defects</h3>
              <p className="feature-text">
                Manufacturing defects, warranty claims, and faulty goods.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <ShieldCheck size={22} />
              </div>
              <h3 className="feature-title">Insurance Complaints</h3>
              <p className="feature-text">
                Claim rejections, delays, and unfair policy practices.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Building size={22} />
              </div>
              <h3 className="feature-title">Real Estate Issues</h3>
              <p className="feature-text">
                Property disputes, builder defaults, and tenant rights.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;
