import {
  MessageSquare,
  UploadCloud,
  Users,
  Search,
  LayoutDashboard,
  ClipboardList,
} from "lucide-react";

function Features() {
  return (
    <section className="features-section fade-up">
      <div className="container-custom">

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-[#0A1F44]">
            Our Key Features
          </h2>

          <p className="mt-4 text-gray-600 text-lg">
            Everything you need to navigate consumer rights and get the legal help you deserve.
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
              Easily submit your consumer complaints and legal questions through our streamlined form.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <UploadCloud size={22} />
            </div>
            <h3 className="feature-title">Upload Supporting Documents</h3>
            <p className="feature-text">
              Attach receipts, contracts, or any evidence to strengthen your case.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Users size={22} />
            </div>
            <h3 className="feature-title">Expert Consultation</h3>
            <p className="feature-text">
              Connect with verified legal professionals who specialize in consumer rights.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Search size={22} />
            </div>
            <h3 className="feature-title">Smart Legal Search</h3>
            <p className="feature-text">
              Search through our comprehensive database of consumer laws and precedents.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <LayoutDashboard size={22} />
            </div>
            <h3 className="feature-title">Secure Dashboard</h3>
            <p className="feature-text">
              Manage all your queries, documents, and consultations from one secure dashboard.
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
  );
}

export default Features;