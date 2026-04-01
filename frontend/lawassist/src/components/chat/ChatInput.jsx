import React, { useState, useRef, useEffect } from "react";
import FileUploadButton from "./FileUploadButton";
import ToastPopup from "../ui/ToastPopup";

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

const ChatInput = ({ consultationId, socketRef, disabled }) => {
  const [text, setText] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [blockedByModeration, setBlockedByModeration] = useState(false);
  const typingTimeout = useRef(null);
  const errorTimeout = useRef(null);

  /* ================= CLEAR ERROR AFTER 4s ================= */

  useEffect(() => {
    if (!uploadError) return;
    errorTimeout.current = setTimeout(() => setUploadError(""), 4000);
    return () => clearTimeout(errorTimeout.current);
  }, [uploadError]);

  useEffect(() => {
    if (!showToast) return;
    const timer = setTimeout(() => setShowToast(false), 2500);
    return () => clearTimeout(timer);
  }, [showToast]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const foulHandler = (payload) => {
      setToastMessage(payload?.message || "Foul language is not allowed.");
      setShowToast(true);
    };

    const blockedHandler = () => {
      setBlockedByModeration(true);
      setToastMessage("You are blocked from sending messages.");
      setShowToast(true);
    };

    socket.on("foulLanguageDetected", foulHandler);
    socket.on("messageBlocked", blockedHandler);

    return () => {
      socket.off("foulLanguageDetected", foulHandler);
      socket.off("messageBlocked", blockedHandler);
    };
  }, [socketRef]);

  /* ================= SEND TEXT MESSAGE ================= */

  const sendMessage = () => {
    const socket = socketRef.current;
    const textValue = text.trim();
    if (!socket || !textValue || blockedByModeration) return;

    if (hasFoulLanguage(textValue)) {
      setToastMessage("Foul language is not allowed.");
      setShowToast(true);
      return;
    }

    socket.emit("sendMessage", {
      consultationId,
      message: textValue,
    });

    setText("");
  };

  /* ================= HANDLE FILE UPLOAD SUCCESS ================= */

  const handleUploadSuccess = ({ fileUrl, fileName, fileType, fileSize }) => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.emit("sendMessage", {
      consultationId,
      message: null,
      fileUrl,
      fileName,
      fileType,
      fileSize,
    });
  };

  /* ================= TYPING INDICATORS ================= */

  const handleChange = (e) => {
    if (disabled) return;

    const value = e.target.value;
    setText(value);

    const socket = socketRef.current;
    if (!socket) return;

    socket.emit("typing", consultationId);

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("stopTyping", consultationId);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-white border-t">
      {/* Error banner */}
      {uploadError && (
        <div className="px-4 pt-2">
          <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5">
            {uploadError}
          </p>
        </div>
      )}

      {/* Input row */}
      <div className="px-4 py-3 flex gap-2 items-center">
        <FileUploadButton
          onUploadSuccess={handleUploadSuccess}
          onError={setUploadError}
          disabled={disabled}
        />

        <input
          className="flex-1 border border-gray-200 rounded-xl px-3 sm:px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition"
          placeholder="Type a message..."
          disabled={disabled || blockedByModeration}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />

        <button
          onClick={sendMessage}
          disabled={disabled || blockedByModeration || !text.trim()}
          className={`px-3 sm:px-5 py-2 rounded-xl transition shadow-sm text-sm sm:text-base ${
            disabled || blockedByModeration || !text.trim()
              ? "bg-gray-300 text-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          Send
        </button>
      </div>

      <ToastPopup show={showToast} message={toastMessage} type="error" />
    </div>
  );
};

export default ChatInput;
