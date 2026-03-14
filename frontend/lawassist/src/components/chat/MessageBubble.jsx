import React from "react";
import { jwtDecode } from "jwt-decode";
import { User } from "lucide-react";

const MessageBubble = ({ message }) => {
  const token = localStorage.getItem("token");
  const user = jwtDecode(token);

  const isMine = message.senderId === user.userId;

  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex items-end gap-2 ${isMine ? "justify-end" : "justify-start"} mb-2`}
    >
      {!isMine && (
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold">
          {message.senderName ? (
            message.senderName[0].toUpperCase()
          ) : (
            <User size={12} />
          )}
        </div>
      )}

      <div
        className={`
px-4 py-2 rounded-2xl max-w-[75%] sm:max-w-[60%] text-sm shadow-md
transition-all duration-300 ease-out
animate-[fadeIn_0.25s_ease]
${
  isMine
    ? "bg-indigo-600 text-white rounded-br-sm"
    : "bg-white border rounded-bl-sm"
}
`}
      >
        <p className="break-words">{message.message}</p>

        <span className="text-[10px] opacity-70 block text-right mt-1">
          {time}
        </span>
      </div>

      {isMine && (
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-semibold">
          {message.senderName ? (
            message.senderName[0].toUpperCase()
          ) : (
            <User size={12} />
          )}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
