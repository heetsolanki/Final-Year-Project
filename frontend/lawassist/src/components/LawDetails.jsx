import React, { useEffect, useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import API_URL from "../api";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, ArrowLeft, Scale, BookmarkIcon } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AskQueryForm from "../components/AskQueryForm";
import AlertPopup from "../components/AlertPopup";
import BackToTopButton from "./BackToTopButton";

const LawDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [showForm, setShowForm] = useState(false);
  const [law, setLaw] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  const [bookmarkedSections, setBookmarkedSections] = useState([]);

  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [showBookmarkPopup, setShowBookmarkPopup] = useState(false);

  const token = localStorage.getItem("token");

  const sectionAlias = location.state?.sectionAlias || null;
  const searchTerm = location.state?.searchTerm || "";

  let userRole = null;

  if (token) {
    const decoded = jwtDecode(token);
    userRole = decoded.role;
  }

  const fetchLaw = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/laws/${id}`);
      const fetchedLaw = res.data;

      setLaw(fetchedLaw);

      if (sectionAlias) {
        const index = fetchedLaw.sections.findIndex(
          (section) => section.alias === sectionAlias,
        );

        if (index !== -1) {
          setActiveIndex(index);

          setTimeout(() => {
            const el = document.getElementById(`section-${index}`);
            if (el) {
              el.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
          }, 300);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [id, searchTerm, sectionAlias]);

  const fetchBookmarks = async () => {
    try {
      if (!token) return;

      const res = await axios.get(`${API_URL}/api/bookmarks/saved-laws`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sectionsForThisLaw = res.data
        .filter((item) => item.lawId === id)
        .map((item) => item.sectionAlias);

      setBookmarkedSections(sectionsForThisLaw);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLaw();
    fetchBookmarks();
  }, [fetchLaw]);

  const toggleBookmark = async (sectionAlias) => {
    try {
      if (!token) {
        setPopupTitle("Login Required");
        setPopupMessage("Please login to bookmark rights.");
        setShowBookmarkPopup(true);
        return;
      }

      const isSaved = bookmarkedSections.includes(sectionAlias);

      if (isSaved) {
        await axios.delete(
          `${API_URL}/api/bookmarks/remove-law/${id}/${sectionAlias}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setBookmarkedSections((prev) => prev.filter((s) => s !== sectionAlias));
      } else {
        await axios.post(
          `${API_URL}/api/bookmarks/save-law`,
          { lawId: id, sectionAlias },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setBookmarkedSections((prev) => [...prev, sectionAlias]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleCard = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  if (!law) return null;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-36 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <button
            onClick={() => navigate(-1)}
            className="text-[#1e3a8a] font-semibold flex items-center gap-2 mb-6 hover:text-yellow-500"
          >
            <ArrowLeft size={20} /> Back
          </button>

          <div className="text-center mb-14">
            <h1 className="section-title">{law.alias}</h1>
            <div className="section-underline"></div>
            <p className="section-subtitle">{law.description.short}</p>
          </div>

          <div className="space-y-6">
            {law.sections.map((section, index) => {
              const isOpen = activeIndex === index;

              return (
                <div
                  id={`section-${index}`}
                  key={index}
                  className={`border rounded-xl transition ${
                    isOpen
                      ? "border-[#0A1F44] shadow-lg"
                      : "border-gray-200 hover:shadow-md"
                  }`}
                >
                  <button
                    onClick={() => toggleCard(index)}
                    className="w-full flex justify-between p-6 text-left"
                  >
                    <div className="flex gap-4">
                      <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg">
                        <Scale size={18} />
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-[#0A1F44]">
                          {section.alias}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {section.description.short}
                        </p>
                      </div>
                    </div>

                    <ChevronDown
                      size={20}
                      className={isOpen ? "rotate-180" : ""}
                    />
                  </button>

                  <div
                    className={`transition-all overflow-hidden ${
                      isOpen ? "max-h-[900px]" : "max-h-0"
                    }`}
                  >
                    <div className="border-t p-6 space-y-6">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-semibold mb-2">
                            Simple Explanation
                          </h4>

                          <p className="text-gray-700 text-sm">
                            {section.description.layman}
                          </p>
                        </div>

                        {userRole !== "legalExpert" && (
                          <button onClick={() => toggleBookmark(section.alias)}>
                            <BookmarkIcon
                              size={22}
                              className={
                                bookmarkedSections.includes(section.alias)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : ""
                              }
                            />
                          </button>
                        )}
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Common Issues</h4>

                        <div className="flex flex-wrap gap-2">
                          {section.keywords.map((keyword, i) => (
                            <span
                              key={i}
                              className="text-xs px-3 py-1 bg-gray-100 rounded-full"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg border">
                        <h4 className="font-semibold mb-2">Legal Reference</h4>

                        <p className="text-sm text-gray-600">
                          {section.description.technical}
                        </p>
                      </div>

                      {!showForm && userRole !== "legalExpert" && (
                        <button
                          className="bg-[#1E3A8A] text-white px-6 py-2 rounded-lg"
                          onClick={() => setShowForm(true)}
                        >
                          + Ask a Question
                        </button>
                      )}

                      {showForm && (
                        <AskQueryForm
                          defaultCategory={law.category}
                          defaultSubcategory={law.alias}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <AlertPopup
          show={showBookmarkPopup}
          title={popupTitle}
          message={popupMessage}
          onClose={() => {
            setShowBookmarkPopup(false);
            navigate("/login");
          }}
        />
      </div>

      <BackToTopButton />
      <Footer />
    </>
  );
};

export default LawDetails;
