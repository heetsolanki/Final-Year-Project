import React from "react";
import { jwtDecode } from "jwt-decode";
import { User } from "lucide-react";
import FileMessage from "./FileMessage";

const MessageBubble = ({ message }) => {
  const token = localStorage.getItem("token");
  const user = jwtDecode(token);

  const isMine = message.senderId === user.userId;
  const hasFile = !!message.fileUrl;
  const hasText = !!message.message;

  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  /* For image-only messages render without a colored pill so the preview
     shows cleanly. All other messages use the standard bubble style. */
  const isImageOnly =
    hasFile &&
    !hasText &&
    ["jpg", "jpeg", "png"].includes(message.fileType?.toLowerCase());

  return (
    <div
      className={`flex items-end gap-2 ${isMine ? "justify-end" : "justify-start"} mb-2`}
    >
      {!isMine && (
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold shrink-0">
          {message.senderName ? (
            message.senderName[0].toUpperCase()
          ) : (
            <User size={12} />
          )}
        </div>
      )}

      <div
        className={`
          rounded-2xl max-w-[75%] sm:max-w-[60%] text-sm shadow-md
          transition-all duration-300 ease-out
          animate-[fadeIn_0.25s_ease]
          ${
            isImageOnly
              ? "overflow-hidden p-0"
              : isMine
              ? "bg-indigo-600 text-white rounded-br-sm px-4 py-2"
              : "bg-white border rounded-bl-sm px-4 py-2"
          }
        `}
      >
        {/* File content */}
        {hasFile && (
          <div className={hasText && !isImageOnly ? "mb-2" : ""}>
            <FileMessage
              fileUrl={message.fileUrl}
              fileName={message.fileName}
              fileType={message.fileType}
              isMine={isMine}
            />
          </div>
        )}

        {/* Text content */}
        {hasText && <p className="break-words">{message.message}</p>}

        {/* Timestamp — only shown inside non-image-only bubbles */}
        {!isImageOnly && (
          <span className="text-[10px] opacity-70 block text-right mt-1">
            {time}
          </span>
        )}

        {/* Timestamp overlay for image-only messages */}
        {isImageOnly && (
          <div
            className={`text-[10px] text-right px-2 pb-1 ${
              isMine ? "text-indigo-200" : "text-gray-400"
            }`}
          >
            {time}
          </div>
        )}
      </div>

      {isMine && (
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-semibold shrink-0">
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
