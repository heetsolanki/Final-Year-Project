import Navbar from "./Navbar";

const LegalPageLayout = ({ title, description, children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* Header Section - uses same heading classes as other pages */}
      <div className="pt-28 sm:pt-32 lg:pt-40 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[900px] mx-auto text-center">
          <h1 className="section-title">{title}</h1>
          <div className="section-underline"></div>
          <p className="section-subtitle">{description}</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-10 md:py-14 px-4 md:px-6">
        <div className="max-w-[900px] mx-auto">
          {/* Content Sections */}
          <div className="space-y-6 md:space-y-8">
            {children}
          </div>

          {/* Footer CTA */}
          <div className="mt-14 md:mt-20 pt-8 md:pt-12 border-t border-gray-200">
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Have questions about our policies?
              </p>
              <p className="text-gray-600 text-sm mt-2">
                Contact us at{" "}
                <span className="font-semibold text-[#1E3A8A]">lawassist@gmail.com</span>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const LegalSection = ({ number, heading, icon: Icon, children }) => {
  return (
    <div className="group bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300">
      <div className="flex items-start gap-4 md:gap-5">
        {/* Section Number or Icon */}
        <div className="shrink-0">
          {Icon ? (
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[#1E3A8A]/5 flex items-center justify-center group-hover:bg-[#1E3A8A]/10 transition-all duration-300">
              <Icon size={24} className="text-[#1E3A8A] group-hover:text-[#C9A227] transition-colors duration-300" />
            </div>
          ) : (
            <span className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[#C9A227]/10 text-[#C9A227] text-base md:text-lg font-bold group-hover:bg-[#C9A227]/20 transition-all duration-300">
              {number}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl md:text-2xl font-bold text-[#1E3A8A] mb-3 group-hover:text-[#2D4A9E] transition-colors duration-300">
            {heading}
          </h2>
          <div className="text-[#1F2937] leading-[1.8] text-sm md:text-base space-y-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export { LegalPageLayout, LegalSection };
