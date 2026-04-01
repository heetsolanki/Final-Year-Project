import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import API_URL from "../../api";
import AlertPopup from "../ui/AlertPopup";
import { categories } from "../../data";
import { suggestQuerySubcategory } from "../../services/aiService";

const SparkleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2l2.4 7.4L22 12l-7.6 2.6L12 22l-2.4-7.4L2 12l7.6-2.6L12 2z" />
  </svg>
);

const SpinnerIcon = () => (
  <svg
    className="animate-spin"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
    <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
  </svg>
);

const AskQueryForm = ({
  onClose,
  onSuccess,
  defaultCategory = "",
  defaultSubcategory = "",
  initialData = null,
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    category: initialData?.category || defaultCategory,
    subcategory: initialData?.subcategory || defaultSubcategory,
    description: initialData?.description || "",
  });

  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showModerationPopup, setShowModerationPopup] = useState(false);
  const [moderationMessage, setModerationMessage] = useState("");
  const [categoryCorrection, setCategoryCorrection] = useState(null);
  const [suggestedSubcategory, setSuggestedSubcategory] = useState("");
  const [isSuggestingSubcategory, setIsSuggestingSubcategory] = useState(false);

  const suggestionRequestCounter = useRef(0);
  const lastSuggestedSubcategory = useRef("");
  const isSubcategoryManuallyChanged = useRef(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "category" || name === "title" || name === "description") {
      setCategoryCorrection(null);
    }

    if (name === "subcategory") {
      isSubcategoryManuallyChanged.current = true;
    }
  };

  const triggerSubcategorySuggestion = useCallback(
    async ({ category, title, description, currentSubcategory }) => {
      if (!category) return;

      const requestId = ++suggestionRequestCounter.current;

      try {
        setIsSuggestingSubcategory(true);
        const suggested = await suggestQuerySubcategory({
          title,
          description,
          selectedCategory: category,
          selectedSubcategory: currentSubcategory,
        });

        if (suggestionRequestCounter.current !== requestId) return;
        if (!suggested) return;

        setSuggestedSubcategory(suggested);

        const shouldAutoFill =
          !isSubcategoryManuallyChanged.current
          || !currentSubcategory
          || currentSubcategory === lastSuggestedSubcategory.current;

        if (shouldAutoFill) {
          setFormData((prev) => ({ ...prev, subcategory: suggested }));
        }

        lastSuggestedSubcategory.current = suggested;
      } catch (error) {
        if (suggestionRequestCounter.current !== requestId) return;
        console.error("Subcategory suggestion failed:", error);
      } finally {
        if (suggestionRequestCounter.current === requestId) {
          setIsSuggestingSubcategory(false);
        }
      }
    },
    [],
  );

  // Trigger subcategory suggestion when category changes (not on every description keystroke)
  useEffect(() => {
    if (!formData.category) {
      setSuggestedSubcategory("");
      setIsSuggestingSubcategory(false);
      return;
    }

    const timer = setTimeout(() => {
      triggerSubcategorySuggestion({
        category: formData.category,
        title: formData.title,
        description: formData.description,
        currentSubcategory: formData.subcategory,
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [formData.category, triggerSubcategorySuggestion]);

  // Trigger subcategory suggestion on description blur (not on every keystroke)
  const handleDescriptionBlur = () => {
    triggerSubcategorySuggestion({
      category: formData.category,
      title: formData.title,
      description: formData.description,
      currentSubcategory: formData.subcategory,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        localStorage.setItem("pendingQuery", JSON.stringify({
          title: formData.title,
          category: formData.category,
          subcategory: formData.subcategory,
          description: formData.description,
          savedAt: new Date().toISOString(),
        }));
        setShowLoginPopup(true);
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/queries/create`,
        {
          title: formData.title,
          description: formData.description,
          selectedCategory: formData.category,
          selectedSubcategory: formData.subcategory,
          category: formData.category,
          subcategory: formData.subcategory,
          status: "Pending",
          consultRequested: false,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response?.data?.requiresCategoryChange) {
        setCategoryCorrection({
          selectedCategory: response.data.selectedCategory || formData.category,
          correctCategory: response.data.correctCategory,
          message: response.data.message || "",
        });
        return;
      }

      if (response?.data?.isFlagged) {
        setModerationMessage(
          response.data.moderationReason
          || "This query contains inappropriate content and was flagged by moderation.",
        );
        setShowModerationPopup(true);
        return;
      }

      setCategoryCorrection(null);
      localStorage.removeItem("pendingQuery");
      setFormData({
        title: "",
        category: "",
        subcategory: "",
        description: "",
      });
      setSuggestedSubcategory("");
      lastSuggestedSubcategory.current = "";
      isSubcategoryManuallyChanged.current = false;
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (error) {
      console.error(error);
      setShowErrorPopup(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="query-card">
      <div className="form-header">
        <h2 className="form-title">Ask a Consumer Rights Question</h2>
        <button onClick={onClose} className="close-btn">
          ✕
        </button>
      </div>

      <p className="form-subtitle">
        Do not include personal details like phone number, order ID, or bank details.
      </p>

      {categoryCorrection && (
        <div
          style={{
            background: "#fffbeb",
            border: "1px solid #d97706",
            borderRadius: "8px",
            padding: "10px 14px",
            marginBottom: "12px",
            color: "#92400e",
            fontSize: "0.875rem",
            lineHeight: "1.4",
          }}
        >
          <>
            This query appears to belong to{" "}
            <strong style={{ color: "#78350f", fontWeight: "bold" }}>{categoryCorrection.correctCategory}</strong>
            {categoryCorrection.selectedCategory ? (
              <>
                {" "}instead of{" "}
                <strong style={{ color: "#78350f", fontWeight: "bold" }}>{categoryCorrection.selectedCategory}</strong>
                .
              </>
            ) : "."}{" "}
            Please select the correct category.
          </>
        </div>
      )}

      <form className="query-form" onSubmit={handleSubmit}>
        <div style={{ position: "relative" }}>
          <input
            type="text"
            name="title"
            placeholder="Enter question title"
            className="form-input"
            value={formData.title}
            onChange={handleChange}
            required
            style={{ paddingRight: "44px" }}
          />
        </div>

        {/* Category select */}
        <select
          name="category"
          className="form-input"
          value={formData.category}
          onChange={(e) => {
            const nextCategory = e.target.value;
            setCategoryCorrection(null);
            setSuggestedSubcategory("");
            lastSuggestedSubcategory.current = "";
            isSubcategoryManuallyChanged.current = false;
            setFormData((prev) => ({
              ...prev,
              category: nextCategory,
              subcategory: "",
            }));
          }}
          disabled={defaultCategory}
          required
        >
          <option value="">Select Category</option>
          {Object.keys(categories).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Subcategory select + suggestion hint */}
        {formData.category && (
          <>
            <select
              name="subcategory"
              className="form-input"
              value={formData.subcategory}
              onChange={handleChange}
              disabled={defaultSubcategory}
              required
            >
              <option value="">Select Sub Category</option>
              {categories[formData.category].map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>

            {(isSuggestingSubcategory || suggestedSubcategory) && (
              <p style={{ fontSize: "0.78rem", color: "#6b7280", marginTop: "2px", marginBottom: "4px", paddingLeft: "2px" }}>
                {isSuggestingSubcategory
                  ? "Detecting best subcategory..."
                  : `Suggested: ${suggestedSubcategory}`}
              </p>
            )}
          </>
        )}

        <div style={{ position: "relative" }}>
          <textarea
            name="description"
            rows="4"
            placeholder="Describe your issue in detail (100-1000 characters)"
            className="form-input"
            value={formData.description}
            onChange={handleChange}
            onBlur={handleDescriptionBlur}
            required
            style={{ paddingRight: "44px" }}
          />
        </div>

        {/* Submit or Change Category button */}
        {categoryCorrection ? (
          <button
            type="button"
            className="primary-btn"
            onClick={() => {
              setFormData((prev) => ({
                ...prev,
                category: categoryCorrection.correctCategory,
                subcategory: "",
              }));
              setSuggestedSubcategory("");
              lastSuggestedSubcategory.current = "";
              isSubcategoryManuallyChanged.current = false;
              setCategoryCorrection(null);
            }}
          >
            Switch to Suggested Category
          </button>
        ) : (
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Submitting..." : "Post Question"}
          </button>
        )}
      </form>

      <AlertPopup
        show={showSuccessModal}
        title="Query Submitted"
        description="Your query has been submitted successfully. You can track its progress from your dashboard."
        onClose={() => {
          setShowSuccessModal(false);
          if (onClose) onClose();
          if (onSuccess) onSuccess();
        }}
      />
      <AlertPopup
        show={showLoginPopup}
        title="Please Login"
        description="You need to be logged in to submit a query."
        type="warning"
        redirectTo="/login"
        onClose={() => setShowLoginPopup(false)}
      />
      <AlertPopup
        show={showModerationPopup}
        title="Query Flagged"
        description={moderationMessage || "This query was flagged by content moderation."}
        type="warning"
        onClose={() => setShowModerationPopup(false)}
      />
      <AlertPopup
        show={showErrorPopup}
        title="Something went wrong"
        description="Failed to submit your query. Please try again."
        type="error"
        onClose={() => setShowErrorPopup(false)}
      />
    </div>
  );
};

export default AskQueryForm;
