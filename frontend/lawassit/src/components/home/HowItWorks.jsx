import { UserPlus, FileText, Upload, Gavel } from "lucide-react";

function HowItWorks() {
  return (
    <section className="how-section fade-up">
      <div className="container-custom text-center">

        {/* Heading */}
        <h2 className="text-3xl font-bold text-[#0A1F44]">
          How It Works
        </h2>

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
  );
}

export default HowItWorks;