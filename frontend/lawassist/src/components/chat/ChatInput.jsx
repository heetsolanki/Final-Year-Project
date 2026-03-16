import React, { useState, useRef, useEffect } from "react";
import FileUploadButton from "./FileUploadButton";

const ChatInput = ({ consultationId, socketRef, disabled }) => {
  const [text, setText] = useState("");
  const [uploadError, setUploadError] = useState("");
  const typingTimeout = useRef(null);
  const errorTimeout = useRef(null);

  /* ================= CLEAR ERROR AFTER 4s ================= */

  useEffect(() => {
    if (!uploadError) return;
    errorTimeout.current = setTimeout(() => setUploadError(""), 4000);
    return () => clearTimeout(errorTimeout.current);
  }, [uploadError]);

  /* ================= SEND TEXT MESSAGE ================= */

  const sendMessage = () => {
    const socket = socketRef.current;
    if (!socket || !text.trim()) return;

    socket.emit("sendMessage", {
      consultationId,
      message: text,
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
          disabled={disabled}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />

        <button
          onClick={sendMessage}
          disabled={disabled || !text.trim()}
          className={`px-3 sm:px-5 py-2 rounded-xl transition shadow-sm text-sm sm:text-base ${
            disabled || !text.trim()
              ? "bg-gray-300 text-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
