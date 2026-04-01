const FOUL_WORDS = [
  // English
  "shit",
  "sh1t",
  "shyt",
  "fuck",
  "fck",
  "fcuk",
  "fuk",
  "f*ck",
  "bitch",
  "b1tch",
  "b!tch",
  "asshole",
  "ass",
  "bastard",
  "motherfucker",
  "slut",
  "whore",
  "dick",
  "piss",
  "idiot",
  "stupid",
  "loser",

  // Hindi / Hinglish (Roman)
  "kutta",
  "saala",
  "saala",
  "kamina",
  "chutiya",
  "chu tiya",
  "chutya",
  "chutiyapa",
  "madarchod",
  "maa ki chut",
  "bhenchod",
  "behenchod",
  "gandu",
  "harami",
  "randi",

  // Marathi (Roman)
  "makad tondya",
  "lavda",
  "chutya",
  "झव्या",
  "भडवा",
  "आईघाल्या",

  // Gujarati (Roman)
  "kutro",
  "ચુતિયા",
  "ભેંચોદ",
  "માદરચોદ",
  "ગાંડુ",

  // Tamil / Telugu phonetic slang (Roman)
  "thevdiya",
  "punda",
  "pundai",
  "lanja",
  "dengey",
  "pukku",

  // Existing native-script entries kept
  "चूतिया",
  "मादरचोद",
  "बहनचोद",
  "हरामी",
  "रंडी",
  "தேவடியா",
  "புண்டை",
  "மயிரு",
  "లంజా",
  "దెంగే",
  "పుక్క",
];

const normalizeRepeatedLetters = (value = "") =>
  String(value).replace(/(.)\1{2,}/g, "$1");

const normalizeInput = (text = "") =>
  normalizeRepeatedLetters(String(text))
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "");

const normalizedFoulWords = FOUL_WORDS.map((word) => normalizeInput(word));

const hasFoulLanguage = (text = "") => {
  const raw = String(text || "").toLowerCase().trim();
  const normalizedText = normalizeInput(raw);

  return FOUL_WORDS.some((word) => raw.includes(word.toLowerCase())) ||
    normalizedFoulWords.some((word) => word && normalizedText.includes(word));
};

module.exports = {
  FOUL_WORDS,
  normalizeRepeatedLetters,
  normalizeInput,
  hasFoulLanguage,
};
