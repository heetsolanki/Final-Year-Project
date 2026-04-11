import axios from "axios";
import API_URL from "../api";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

/*
 * Calls the backend to generate a professional expert bio via Gemini.
 * Returns the generated bio string.
 */
export const generateBio = async ({
  name,
  specialization,
  expertiseAreas,
  languages,
  experience,
  city,
  state,
}) => {
  const res = await axios.post(
    `${API_URL}/api/ai/generate-bio`,
    { name, specialization, expertiseAreas, languages, experience, city, state },
    { headers: authHeader() },
  );
  return res.data.data;
};

/*
 * Calls the backend to summarize dense legal text via Gemini.
 * Returns the plain-language summary string.
 */
export const summarizeLaw = async (lawText) => {
  const res = await axios.post(`${API_URL}/api/ai/summarize-law`, { lawText });
  return res.data.data;
};
/*
 * Calls the backend to suggest a subcategory for a query.
 * Returns suggested subcategory string.
 */
export const suggestQuerySubcategory = async ({
  title,
  description,
  selectedCategory,
  selectedSubcategory,
}) => {
  const res = await axios.post(`${API_URL}/api/queries/suggest-subcategory`, {
    title,
    description,
    selectedCategory,
    selectedSubcategory,
  });

  return res.data?.suggestedSubcategory || "";
};

/*
 * Calls backend category validator and returns AI match details.
 */
export const validateQueryCategoryAI = async ({
  title,
  description,
  selectedCategory,
}) => {
  const res = await axios.post(`${API_URL}/api/queries/validate-category`, {
    title,
    description,
    selectedCategory,
  });

  return {
    detectedCategory: res.data?.detectedCategory || selectedCategory || "",
    isMatch: typeof res.data?.isMatch === "boolean" ? res.data.isMatch : true,
    confidence:
      typeof res.data?.confidence === "number"
        ? res.data.confidence
        : 0,
  };
};

