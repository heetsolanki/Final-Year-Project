import React, { useEffect, useState } from "react";
import { Scale, ArrowRight, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackToTopButton from "../components/BackToTopButton";
import SearchBar from "../components/SearchBar";
import { iconMap } from "../data";

const API = "http://localhost:5000/api";

const ExploreRights = () => {
  const navigate = useNavigate();

  const [laws, setLaws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLaws = laws.filter((law) => {
    const search = searchTerm.toLowerCase();
    return JSON.stringify(law).toLowerCase().includes(search);
  });

  useEffect(() => {
    const fetchLaws = async () => {
      try {
        const res = await axios.get(`${API}/laws`);

        setLaws(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLaws();
  }, []);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-40 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="section-title">Explore Your Consumer Rights</h1>
            <div className="section-underline"></div>
            <p className="section-subtitle">
              Select a category below to understand your rights and learn how to
              take action when facing consumer problems.
            </p>
          </div>

          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Search consumer rights, laws, or issues..."
          />

          {searchTerm && (
            <p className="flex justify-center items-center gap-1 text-center text-gray-500 mb-8">
              <Search size={18} className="text-[#1E3A8A]" />
              Showing {filteredLaws.length} result
              {filteredLaws.length !== 1 ? "s" : ""} for "{searchTerm}"
            </p>
          )}

          {/* Loading */}
          {loading && (
            <p className="text-center text-gray-500">
              Loading consumer rights...
            </p>
          )}

          {/* Grid */}
          {!loading && (
            <div className="features-grid transition-all duration-300">
              {(searchTerm ? filteredLaws : laws).map((law) => (
                <div key={law._id} className="feature-card">
                  {/* Icon */}
                  <div className="feature-icon">
                    {iconMap[law.alias] || <Scale size={30} />}
                  </div>

                  {/* Title */}
                  <h3 className="feature-title">{law.alias}</h3>

                  {/* Description */}
                  <p className="feature-text">{law.description?.short}</p>

                  {/* Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/laws/${law._id}`, { state: { searchTerm } });
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="flex items-center gap-1 mt-6 text-sm font-medium text-[#0A1F44] hover:underline"
                  >
                    Learn More <ArrowRight size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {searchTerm && filteredLaws.length === 0 && (
            <p className="text-center text-gray-500 mt-8">
              No matching consumer rights found.
            </p>
          )}

          {/* Info Box */}
          <div className="mt-16 bg-blue-50 border border-blue-100 rounded-xl p-6 text-center">
            <p className="text-gray-700 max-w-3xl mx-auto">
              These simplified guides help you understand your rights as a
              consumer. If you face any issue, you can ask a question and get
              guidance from legal experts.
            </p>
          </div>
        </div>
      </div>

      <BackToTopButton />
      <Footer />
    </>
  );
};

export default ExploreRights;
