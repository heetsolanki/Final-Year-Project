import React, { useEffect, useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import API_URL from "../../api";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, ArrowLeft, Scale, BookmarkIcon, Sparkles, RefreshCw } from "lucide-react";

import AskQueryForm from "../queries/AskQueryForm";
import AlertPopup from "../ui/AlertPopup";
import ToastPopup from "../ui/ToastPopup";
import BackToTopButton from "../layout/BackToTopButton";
import { summarizeLaw } from "../../services/aiService";

const LawDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [showFormBySection, setShowFormBySection] = useState({});
  const [law, setLaw] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const [bookmarkedSections, setBookmarkedSections] = useState([]);

  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [showBookmarkPopup, setShowBookmarkPopup] = useState(false);

  // AI summarization — keyed by section index
  const [summaries, setSummaries] = useState({});
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [summaryErrors, setSummaryErrors] = useState({});

  const token = localStorage.getItem("token");

  const sectionAlias = location.state?.sectionAlias || null;

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
  }, [id, sectionAlias]);

  const fetchBookmarks = useCallback(async () => {
    try {
      if (!token) return;

      const decoded = jwtDecode(token);

      // Experts don't have bookmarks
      if (decoded.role === "legalExpert") return;

      const res = await axios.get(`${API_URL}/api/bookmarks/saved-laws`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sectionsForThisLaw = res.data
        .filter((item) => item.lawId === id)
        .map((item) => item.sectionAlias);

      setBookmarkedSections(sectionsForThisLaw);
    } catch (error) {
      console.log("Bookmark fetch error:", error);
    }
  }, [id, token]);

  useEffect(() => {
    fetchLaw();
    fetchBookmarks();
  }, [fetchLaw, fetchBookmarks]);

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
        setToastMessage("Bookmark removed");
        setToastType("remove");
        setShowToast(true);
      } else {
        await axios.post(
          `${API_URL}/api/bookmarks/save-law`,
          { lawId: id, sectionAlias },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setBookmarkedSections((prev) => [...prev, sectionAlias]);
        setToastMessage("Bookmark saved");
        setToastType("success");
        setShowToast(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleCard = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleSummarize = async (index, technicalText) => {
    setSummaryErrors((prev) => ({ ...prev, [index]: "" }));
    setLoadingIndex(index);
    try {
      const summary = await summarizeLaw(technicalText);
      setSummaries((prev) => ({ ...prev, [index]: summary }));
    } catch {
      setSummaryErrors((prev) => ({
        ...prev,
        [index]: "Failed to generate summary. Please try again.",
      }));
    } finally {
      setLoadingIndex(null);
    }
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [showToast]);

  if (!law) return null;

  return (
    <>
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
              const showForm = Boolean(showFormBySection[index]);

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
                      className={`transition-transform duration-300 ease-in-out ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100 overflow-visible"
                        : "grid-rows-[0fr] opacity-0 overflow-hidden"
                    }`}
                  >
                    <div
                      className={`space-y-6 ${
                        isOpen
                          ? "border-t px-6 py-5 md:py-6 overflow-visible"
                          : "border-0 p-0 overflow-hidden"
                      }`}
                    >
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

                      <div className="overflow-visible">
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

                      {/* ── AI Summarization ── */}
                      <div>
                        {!summaries[index] && loadingIndex !== index && (
                          <button
                            onClick={() =>
                              handleSummarize(index, section.description.technical)
                            }
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition"
                          >
                            <Sparkles size={15} />
                            Summarize with AI
                          </button>
                        )}

                        {loadingIndex === index && (
                          <div className="flex items-center gap-2 text-sm text-indigo-600">
                            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                            Generating summary...
                          </div>
                        )}

                        {summaryErrors[index] && (
                          <p className="text-xs text-red-500 mt-1">
                            {summaryErrors[index]}
                          </p>
                        )}

                        {summaries[index] && loadingIndex !== index && (
                          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                            <h4 className="font-semibold text-indigo-800 mb-2 text-sm">
                              ✨ AI Summary
                            </h4>
                            <p className="text-sm text-indigo-900">
                              {summaries[index]}
                            </p>
                            <button
                              onClick={() =>
                                handleSummarize(index, section.description.technical)
                              }
                              className="mt-3 flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 transition"
                            >
                              <RefreshCw size={12} />
                              Regenerate Summary
                            </button>
                          </div>
                        )}
                      </div>

                      {!showForm && userRole !== "legalExpert" && (
                        <button
                          className="mt-4 bg-[#1E3A8A] text-white px-6 py-2 rounded-lg"
                          onClick={() =>
                            setShowFormBySection((prev) => ({ ...prev, [index]: true }))
                          }
                        >
                          + Ask a Question
                        </button>
                      )}

                      {showForm && (
                        <div className="mt-4">
                          <AskQueryForm
                            defaultCategory={law.category}
                            defaultSubcategory={law.alias}
                            onClose={() =>
                              setShowFormBySection((prev) => ({ ...prev, [index]: false }))
                            }
                          />
                        </div>
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
          description={popupMessage}
          type="warning"
          redirectTo="/login"
          onClose={() => setShowBookmarkPopup(false)}
        />
        <ToastPopup show={showToast} message={toastMessage} type={toastType} />
      </div>

      <BackToTopButton />
    </>
  );
};

export default LawDetails;
