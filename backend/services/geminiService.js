const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const Law = require("../models/Law");

const GEMINI_MODEL = "gemini-3.1-flash-lite-preview";

const getAiClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
  }

  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
};

const generateText = async (prompt) => {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
  });

  return String(response?.text || "").trim();
};

// =========================
// 🔥 FINAL KEYWORD CLASSIFIER (FIXED)
// =========================
const GENERIC_KEYWORDS = [
  "problem",
  "issue",
  "not good",
  "bad quality",
  "complaint",
  "not working",
  "not satisfied",
  "poor service",
  "help needed",
  "support issue",
  "customer problem",
  "delay",
  "not responding",
];

const getCategoryFromKeywords = async (query) => {
  try {
    const laws = await Law.find();

    query = query.toLowerCase().replace(/[^\w\s]/g, "");
    const words = query.split(" ");

    const categoryScores = {};

    for (const act of laws) {
      let totalScore = 0;

      for (const section of act.sections || []) {
        for (const keyword of section.keywords || []) {
          const cleanKeyword = keyword.toLowerCase().trim();

          if (GENERIC_KEYWORDS.includes(cleanKeyword)) continue;

          if (
            words.some((word) => cleanKeyword.includes(word)) ||
            cleanKeyword.includes(query)
          ) {
            totalScore += 2;
          }
        }
      }

      if (Array.isArray(act.keywords)) {
        for (const keyword of act.keywords) {
          const cleanKeyword = keyword.toLowerCase().trim();

          if (
            words.some((word) => cleanKeyword.includes(word)) ||
            cleanKeyword.includes(query)
          ) {
            totalScore += 5;
          }
        }
      }

      if (!categoryScores[act.category]) {
        categoryScores[act.category] = 0;
      }

      categoryScores[act.category] += totalScore;
    }

    let bestCategory = null;
    let maxScore = 0;

    for (const category in categoryScores) {
      if (categoryScores[category] > maxScore) {
        maxScore = categoryScores[category];
        bestCategory = category;
      }
    }

    if (maxScore < 3) return null;

    return bestCategory;
  } catch (err) {
    console.error("Keyword classification error:", err.message);
    return null;
  }
};

const extractFirstJSONObject = (text = "") => {
  const cleaned = String(text)
    .replace(/`json|`/gi, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) return null;

    try {
      return JSON.parse(cleaned.slice(start, end + 1));
    } catch {
      return null;
    }
  }
};

const normalizeText = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s&]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getCategoriesFromDataFile = () => {
  try {
    const dataFilePath = path.resolve(
      __dirname,
      "../../frontend/lawassist/src/data.js",
    );
    const dataFileContent = fs.readFileSync(dataFilePath, "utf8");
    const categoriesMatch = dataFileContent.match(
      /export\s+const\s+categories\s*=\s*({[\s\S]*?})\s*;/,
    );

    if (!categoriesMatch || !categoriesMatch[1]) return {};

    const parsed = vm.runInNewContext(`(${categoriesMatch[1]})`, {});
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    console.error("Failed to load categories from data.js:", error.message);
    return {};
  }
};

const getClosestValidItem = (candidate, validItems = [], fallbackItem = "") => {
  if (!Array.isArray(validItems) || validItems.length === 0)
    return fallbackItem;

  const normalizedCandidate = normalizeText(candidate);
  if (!normalizedCandidate) {
    return validItems.includes(fallbackItem) ? fallbackItem : validItems[0];
  }

  const exact = validItems.find(
    (item) => normalizeText(item) === normalizedCandidate,
  );
  if (exact) return exact;

  const ranked = validItems
    .map((item) => {
      const normalizedItem = normalizeText(item);
      const itemTokens = normalizedItem.split(" ");
      const candidateTokens = normalizedCandidate.split(" ");
      const overlap = candidateTokens.filter((token) =>
        itemTokens.includes(token),
      ).length;
      return { item, overlap };
    })
    .sort((a, b) => b.overlap - a.overlap);

  if (ranked[0] && ranked[0].overlap > 0) return ranked[0].item;

  return validItems.includes(fallbackItem) ? fallbackItem : validItems[0];
};

/*

* Generates a professional 80-100 word bio for a legal expert.
  */
const generateExpertBio = async ({
  name,
  specialization,
  expertiseAreas,
  languages,
  experience,
  city,
  state,
}) => {
  const prompt = `Generate a professional short bio for a legal expert.

Details:
Name: ${name}
Field of Law: ${specialization}
Areas of Expertise: ${Array.isArray(expertiseAreas) ? expertiseAreas.join(", ") : expertiseAreas}
Languages Spoken: ${Array.isArray(languages) ? languages.join(", ") : languages}
Experience: ${experience} years
Location: ${city}, ${state}

Write a professional bio suitable for a legal consultation platform.
Length: 80-100 words
Tone: professional and trustworthy

Return plain text only.`;

  try {
    return await generateText(prompt);
  } catch (error) {
    console.error("Gemini generateExpertBio error:", error);
    throw error;
  }
};

/*

* Converts dense legal text into a plain-language summary (max 80 words).
  */
const summarizeLawText = async (lawText) => {
  const prompt = `You are a legal assistant helping simplify legal language.

Convert the following legal text into a clear and simple explanation that a normal citizen can understand.

Rules:

* Keep meaning accurate
* Avoid legal jargon
* Use simple language
* Maximum 80 words

Legal Text:
${lawText}

Return only the simplified explanation.`;

  try {
    return await generateText(prompt);
  } catch (error) {
    console.error("Gemini summarizeLawText error:", error);
    throw error;
  }
};

/*

* Generates a concise consultation chat title.
  */
const generateConsultationTitle = async ({ specialization, city, state }) => {
  const prompt = `Generate a short title for a legal consultation chat.

Context:
Specialization: ${specialization || "General Consumer Law"}
Location: ${city || ""}${city && state ? ", " : ""}${state || ""}

Rules:

* Maximum 6 words
* Professional and clear
* No quotation marks
* Return plain text only`;

  try {
    const text = await generateText(prompt);
    return text.replace(/[\n\r]+/g, " ").slice(0, 120);
  } catch (error) {
    console.error("Gemini generateConsultationTitle error:", error);
    throw error;
  }
};

/*

* Checks if a user query is appropriate for the consumer-rights platform.
  */
const analyzeUserQuery = async (queryText) => {
  const fallback = { isAppropriate: true, reason: "Query accepted" };

  const prompt = `Check if the following query is appropriate for a consumer rights platform.

Reject if it contains:

* abusive language
* spam
* irrelevant content
* illegal or harmful intent

Return ONLY JSON:
{
"isAppropriate": true/false,
"reason": "short explanation"
}

Query: ${queryText}`;

  const text = await generateText(prompt);
  const parsed = extractFirstJSONObject(text);

  if (!parsed || typeof parsed.isAppropriate !== "boolean") {
    return fallback;
  }

  return {
    isAppropriate: parsed.isAppropriate,
    reason:
      typeof parsed.reason === "string" && parsed.reason.trim()
        ? parsed.reason.trim()
        : fallback.reason,
  };
};

/*

* 🔥 VALIDATES CATEGORY (UPDATED WITH KEYWORD LOGIC)
  */
const validateQueryCategory = async (
  queryText,
  selectedCategory,
  categoriesList = [],
) => {
  const categoriesMap = getCategoriesFromDataFile();
  const validCategories =
    Array.isArray(categoriesList) && categoriesList.length > 0
      ? categoriesList
      : Object.keys(categoriesMap);

  const safeSelectedCategory = validCategories.includes(selectedCategory)
    ? selectedCategory
    : validCategories[0] || selectedCategory || "";

  // 🔥 KEYWORD MATCH FIRST
  const keywordCategory = await getCategoryFromKeywords(queryText);

  if (keywordCategory) {
    return {
      isMatch: keywordCategory === selectedCategory,
      correctCategory: keywordCategory,
    };
  }

  // 🤖 AI FALLBACK
  const fallback = { isMatch: true, correctCategory: safeSelectedCategory };

  const prompt = `Check whether the selected category matches the query.

Allowed categories:
${JSON.stringify(validCategories)}

IMPORTANT:

* Prioritize context over generic words like refund.

Return ONLY JSON:
{
"isMatch": true/false,
"correctCategory": "Category Name"
}

Query: ${queryText}
Selected Category: ${selectedCategory}`;

  const text = await generateText(prompt);
  const parsed = extractFirstJSONObject(text);

  if (!parsed || typeof parsed.isMatch !== "boolean") {
    return fallback;
  }

  const aiCategory =
    typeof parsed.correctCategory === "string"
      ? parsed.correctCategory.trim()
      : "";

  const correctCategory = validCategories.includes(aiCategory)
    ? aiCategory
    : getClosestValidItem(aiCategory, validCategories, safeSelectedCategory);

  return {
    isMatch: parsed.isMatch,
    correctCategory,
  };
};

/*

* Suggests subcategory (UNCHANGED)
  */
const detectSubcategory = async (queryText, category, subcategoryList = []) => {
  const categoriesMap = getCategoriesFromDataFile();
  const validSubcategories =
    Array.isArray(subcategoryList) && subcategoryList.length > 0
      ? subcategoryList
      : Array.isArray(categoriesMap[category])
        ? categoriesMap[category]
        : [];

  const fallback = { subcategory: validSubcategories[0] || "" };

  if (validSubcategories.length === 0) {
    return fallback;
  }

  const prompt = `Select the most appropriate subcategory for the query.

Allowed subcategories:
${JSON.stringify(validSubcategories)}

Return ONLY JSON:
{
"subcategory": "Subcategory Name"
}

Query: ${queryText}
Category: ${category}`;

  const text = await generateText(prompt);
  const parsed = extractFirstJSONObject(text);

  const aiSubcategory =
    typeof parsed?.subcategory === "string" ? parsed.subcategory.trim() : "";

  const subcategory = validSubcategories.includes(aiSubcategory)
    ? aiSubcategory
    : getClosestValidItem(
        aiSubcategory,
        validSubcategories,
        fallback.subcategory,
      );

  return { subcategory };
};

module.exports = {
  generateExpertBio,
  summarizeLawText,
  generateConsultationTitle,
  analyzeUserQuery,
  validateQueryCategory,
  detectSubcategory,
  getCategoriesFromDataFile,
};
