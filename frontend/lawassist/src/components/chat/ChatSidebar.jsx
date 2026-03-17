import React from "react";
import { useNavigate } from "react-router-dom";

const ChatSidebar = ({ consultations, selected, openChat }) => {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col overflow-y-auto bg-white px-4 py-5 md:py-6">
      <div className="px-2 pb-4 mb-4 border-b font-semibold text-gray-800 text-lg">
        Chats
      </div>

      <div className="p-3 sm:p-3 border-b cursor-pointer hover:bg-gray-50 transition overflow-y-auto flex-1">
        {consultations.map((c) => (
          <div
            key={c.consultationId}
            onClick={() => {
              openChat();
              navigate(`/chat/${c.consultationId}`);
            }}
            className={`p-3 my-3 sm:my-4 rounded-xl border cursor-pointer transition shadow-sm hover:shadow-md
          ${
            selected === c.consultationId
              ? "bg-indigo-100 border border-indigo-300"
              : "bg-white hover:bg-gray-100"
          }`}
          >
            <p className="font-medium text-gray-800 text-[15px]">
              {c.chatTitle || `Consultation ${c.consultationId}`}
            </p>

            <span
              className={`text-xs px-2.5 py-1 rounded-full mt-1 inline-block ${
                c.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {c.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
