import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import API_URL from "../api";
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatWindow from "../components/chat/ChatWindow";
import useSocket from "../hooks/useSocket";
import { ArrowLeft } from "lucide-react";

const ChatPage = () => {
  const { consultationId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const role = decoded.role;

  const socketRef = useSocket(token);

  const [messages, setMessages] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [typing, setTyping] = useState(false);
  const [chatClosed, setChatClosed] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);
  const [currentConsultation, setCurrentConsultation] = useState(null);
  const [blockedReason, setBlockedReason] = useState("");

  const unreadCounts = {};

  /* ================= SOCKET EVENTS ================= */

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.emit("joinConsultation", consultationId);

    const receiveHandler = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    const typingHandler = () => setTyping(true);
    const stopTypingHandler = () => setTyping(false);
    const foulLanguageHandler = (payload) => {
      if (payload?.isBlocked) {
        setBlockedReason(payload.blockReason || "Used inappropriate language multiple times");
      }
    };

    const blockedHandler = (reason) => {
      setBlockedReason(reason || "Used inappropriate language multiple times");
    };

    socket.on("receiveMessage", receiveHandler);
    socket.on("typing", typingHandler);
    socket.on("stopTyping", stopTypingHandler);
    socket.on("foulLanguageDetected", foulLanguageHandler);
    socket.on("messageBlocked", blockedHandler);
    socket.on("chatClosed", (id) => {
      if (id === consultationId) {
        setChatClosed(true);
      }

      setConsultations((prev) =>
        prev.map((c) =>
          c.consultationId === id
            ? { ...c, status: "closed", isActive: false }
            : c,
        ),
      );
    });

    return () => {
      socket.off("receiveMessage", receiveHandler);
      socket.off("typing", typingHandler);
      socket.off("stopTyping", stopTypingHandler);
      socket.off("foulLanguageDetected", foulLanguageHandler);
      socket.off("messageBlocked", blockedHandler);
      socket.off("chatClosed");
    };
  }, [consultationId, socketRef]);

  /* ================= FETCH MESSAGES ================= */

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/chat/${consultationId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMessages(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMessages();
  }, [consultationId, token]);

  /* ================= FETCH CONSULTATIONS ================= */

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const decoded = jwtDecode(token);

        const endpoint =
          decoded.role === "legalExpert"
            ? "/api/consultations/expert"
            : "/api/consultations/user";

        const res = await axios.get(`${API_URL}${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setConsultations(res.data);
        const selectedConsultation = res.data.find(
          (item) => item.consultationId === consultationId,
        );
        setCurrentConsultation(selectedConsultation || null);
      } catch (error) {
        console.log(error);
      }
    };

    fetchConsultations();
  }, [role, token]);

  /* ================= FETCH CHAT STATUS ================= */

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/consultations/${consultationId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setChatClosed(!res.data.isActive || res.data.status === "closed");
        setCurrentConsultation((prev) => ({ ...prev, ...res.data }));
      } catch (error) {
        console.log(error);
      }
    };

    fetchStatus();
  }, [consultationId, token]);

  useEffect(() => {
    const fetchAccountStatus = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/auth/check-status`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.status === "blocked") {
          setBlockedReason(
            res.data?.blockReason || "Used inappropriate language multiple times",
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAccountStatus();
  }, [token]);

  return (
    <>
      <div className="pt-28 sm:pt-32 pb-4 sm:pb-6 min-h-screen bg-gray-50 flex justify-center px-2 sm:px-3">
        <div className="w-full max-w-[1200px] flex flex-col gap-3">
          {/* Back Button */}
          <button
            onClick={() => navigate("/user-dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>

          {/* Chat Container */}
          <div className="w-full h-[calc(100vh-7rem)] md:h-[82vh] bg-white rounded-2xl shadow-xl flex overflow-hidden border relative">
            <div
              className={`w-full md:w-[320px] border-r ${
                chatOpen ? "hidden md:block" : "block"
              }`}
            >
              <ChatSidebar
                consultations={consultations}
                selected={consultationId}
                unreadCounts={unreadCounts}
                openChat={() => setChatOpen(true)}
              />
            </div>

            {chatOpen && (
              <ChatWindow
                consultationId={consultationId}
                messages={messages}
                typing={typing}
                socketRef={socketRef}
                chatClosed={chatClosed}
                setChatClosed={setChatClosed}
                role={role}
                chatTitle={currentConsultation?.chatTitle}
                onTitleUpdated={(newTitle) => {
                  setCurrentConsultation((prev) => ({ ...prev, chatTitle: newTitle }));
                  setConsultations((prev) =>
                    prev.map((item) =>
                      item.consultationId === consultationId
                        ? { ...item, chatTitle: newTitle }
                        : item,
                    ),
                  );
                }}
                onClose={() => setChatOpen(false)}
                blockedReason={blockedReason}
                expertName={currentConsultation?.expertName}
                consumerName={currentConsultation?.consumerName}
              />
            )}

            {!chatOpen && (
              <div className="hidden md:flex flex-1 items-center justify-center text-gray-400 text-sm">
                Chat closed. Select a conversation to reopen.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPage;
