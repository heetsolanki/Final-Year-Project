import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import axios from "axios";
import API_URL from "../../api";
import { Edit2, Save } from "lucide-react";

const ChatWindow = ({
  consultationId,
  messages,
  typing,
  socketRef,
  chatClosed,
  setChatClosed,
  role,
  chatTitle,
  onTitleUpdated,
  onClose,
  blockedReason,
  expertName,
  consumerName,
}) => {
  const bottomRef = useRef();
  const [editingTitle, setEditingTitle] = React.useState(false);
  const [titleInput, setTitleInput] = React.useState(chatTitle || "");
  const [savingTitle, setSavingTitle] = React.useState(false);

  useEffect(() => {
    setTitleInput(chatTitle || "");
  }, [chatTitle]);

  /* ================= AUTO SCROLL ================= */

  useEffect(() => {
    const container = bottomRef.current?.parentElement;
    if (!container) return;

    container.scrollTop = container.scrollHeight;
  }, [messages]);

  /* ================= END CHAT ================= */

  const endChat = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `${API_URL}/api/consultations/close/${consultationId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const socket = socketRef.current;

      socket.emit("consultationClosed", consultationId);

      setChatClosed(true);
    } catch (error) {
      console.log(error);
    }
  };

  const saveTitle = async () => {
    if (!titleInput.trim()) return;

    try {
      setSavingTitle(true);
      const token = localStorage.getItem("token");

      await axios.patch(
        `${API_URL}/api/consultations/${consultationId}/title`,
        { chatTitle: titleInput.trim() },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      onTitleUpdated?.(titleInput.trim());
      setEditingTitle(false);
    } catch (error) {
      window.alert(error?.response?.data?.message || "Failed to update chat title");
    } finally {
      setSavingTitle(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      {/* HEADER */}

      <div className="p-3 sm:p-4 border-b bg-white flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            {editingTitle ? (
              <input
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
                maxLength={120}
              />
            ) : (
              <h2 className="font-semibold text-gray-800 text-sm sm:text-base">
                {chatTitle || `Consultation ${consultationId}`}
              </h2>
            )}

            {role === "consumer" && (
              <button
                onClick={() => (editingTitle ? saveTitle() : setEditingTitle(true))}
                disabled={savingTitle}
                className="text-gray-500 hover:text-[#1E3A8A]"
                title={editingTitle ? "Save title" : "Edit title"}
              >
                {editingTitle ? <Save size={16} /> : <Edit2 size={16} />}
              </button>
            )}
          </div>

          <p className="text-xs text-gray-500 mt-1">
            {role === "legalExpert"
              ? `Consumer: ${consumerName || "-"}`
              : `Expert: ${expertName || "-"}`}
          </p>
        </div>

        <div className="flex gap-3 items-center justify-between">
        {!chatClosed && (
          <button
            onClick={endChat}
            className="text-xs sm:text-sm bg-red-500 text-white px-2 sm:px-3 py-1 rounded-lg hover:bg-red-600 transition"
          >
            End Chat
          </button>
        )}
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-100 hover:text-red-500"
        >
          <X size={20} />
        </button>
        </div>
      </div>

      {/* MESSAGES */}

      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6 md:py-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-300">
        {messages.map((msg) => (
          <MessageBubble key={msg._id} message={msg} />
        ))}

        {typing && (
          <div className="flex items-center gap-1 text-gray-400">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      {/* CLOSED BANNER */}

      {chatClosed && (
        <div className="bg-yellow-100 text-yellow-800 text-xs sm:text-sm p-2 text-center px-3">
          This consultation has ended. Messaging is disabled.
        </div>
      )}

      {blockedReason && (
        <div className="bg-red-100 text-red-700 text-xs sm:text-sm p-2 text-center px-3">
          {blockedReason}
        </div>
      )}

      {/* INPUT */}

      <ChatInput
        consultationId={consultationId}
        socketRef={socketRef}
        disabled={chatClosed || Boolean(blockedReason)}
      />
    </div>
  );
};

export default ChatWindow;
