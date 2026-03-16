const { GoogleGenerativeAI } = require("@google/generative-ai");

/*
 * Generates a professional 80–100 word bio for a legal expert.
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
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `Generate a professional short bio for a legal expert.

Details:
Name: ${name}
Field of Law: ${specialization}
Areas of Expertise: ${Array.isArray(expertiseAreas) ? expertiseAreas.join(", ") : expertiseAreas}
Languages Spoken: ${Array.isArray(languages) ? languages.join(", ") : languages}
Experience: ${experience} years
Location: ${city}, ${state}

Write a professional bio suitable for a legal consultation platform.
Length: 80–100 words
Tone: professional and trustworthy

Return plain text only.`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Gemini generateContent error:", error);
    throw error;
  }
};

/*
 * Converts dense legal text into a plain-language summary (max 80 words).
 */
const summarizeLawText = async (lawText) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `You are a legal assistant helping simplify legal language.

Convert the following legal text into a clear and simple explanation that a normal citizen can understand.

Rules:
- Keep meaning accurate
- Avoid legal jargon
- Use simple language
- Maximum 80 words

Legal Text:
${lawText}

Return only the simplified explanation.`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Gemini generateContent error:", error);
    throw error;
  }
};

module.exports = { generateExpertBio, summarizeLawText };