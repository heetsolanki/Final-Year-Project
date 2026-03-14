import React, { useState, useRef } from "react";

const ChatInput = ({ consultationId, socketRef, disabled }) => {
  const [text, setText] = useState("");
  const typingTimeout = useRef(null);

  const sendMessage = () => {
    const socket = socketRef.current;

    if (!socket || !text.trim()) return;

    socket.emit("sendMessage", {
      consultationId,
      message: text,
    });

    setText("");
  };

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
    <div className="px-4 py-3 bg-white border-t flex gap-3 items-center">
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
        className={`bg-indigo-600 text-white px-3 sm:px-5 py-2 rounded-xl hover:bg-indigo-700 transition shadow-sm text-sm sm:text-base
        ${
        disabled
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700 text-white"
        }
        `}
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;
