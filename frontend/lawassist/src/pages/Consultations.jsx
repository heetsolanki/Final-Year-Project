import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../api";
import { useNavigate } from "react-router-dom";
import { Edit2, Save, X } from "lucide-react";

const Consultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [processingFor, setProcessingFor] = useState("");
  const [editingTitleFor, setEditingTitleFor] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [savingTitleFor, setSavingTitleFor] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const fetchConsultations = async () => {
    try {
      const endpoint =
        role === "legalExpert"
          ? "/api/consultations/expert"
          : "/api/consultations/user";

      const res = await axios.get(`${API_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setConsultations(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, [role, token]);

  const handleStartFollowUp = async (consultationId) => {
    try {
      setProcessingFor(consultationId);
      const res = await axios.post(
        `${API_URL}/api/consultations/followup`,
        { consultationId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      navigate(`/payment?followUpConsultationId=${res.data.followUpConsultationId}`);
    } catch (error) {
      window.alert(error?.response?.data?.message || "Unable to start follow-up");
    } finally {
      setProcessingFor("");
      fetchConsultations();
    }
  };

  const startTitleEdit = (consultation) => {
    setEditingTitleFor(consultation.consultationId);
    setTitleInput(consultation.chatTitle || "");
  };

  const cancelTitleEdit = () => {
    setEditingTitleFor("");
    setTitleInput("");
  };

  const saveTitle = async (consultationId) => {
    if (!titleInput.trim()) return;

    try {
      setSavingTitleFor(consultationId);
      await axios.patch(
        `${API_URL}/api/consultations/${consultationId}/title`,
        { chatTitle: titleInput.trim() },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setConsultations((prev) =>
        prev.map((item) => ({
          ...item,
          chatTitle:
            item.consultationId === consultationId ||
            item.parentConsultationId === consultationId ||
            consultationId === item.parentConsultationId
              ? titleInput.trim()
              : item.chatTitle,
        })),
      );

      cancelTitleEdit();
    } catch (error) {
      window.alert(error?.response?.data?.message || "Failed to update title");
    } finally {
      setSavingTitleFor("");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          My Consultations
        </h1>

        <div className="bg-white rounded-xl shadow-md divide-y">
          {consultations.map((c) => (
            <div
              key={c.consultationId}
              onClick={() => navigate(`/chat/${c.consultationId}`)}
              className="p-4 hover:bg-gray-50 cursor-pointer flex justify-between"
            >
              <div>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  {editingTitleFor === c.consultationId ? (
                    <>
                      <input
                        value={titleInput}
                        onChange={(e) => setTitleInput(e.target.value)}
                        className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
                        maxLength={120}
                      />
                      <button
                        onClick={() => saveTitle(c.consultationId)}
                        disabled={savingTitleFor === c.consultationId}
                        className="text-green-600"
                      >
                        <Save size={14} />
                      </button>
                      <button onClick={cancelTitleEdit} className="text-gray-500">
                        <X size={14} />
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-gray-800">
                        {c.chatTitle || `Consultation ${c.consultationId}`}
                      </p>
                      {role === "consumer" && !c.isFollowUp && (
                        <button
                          onClick={() => startTitleEdit(c)}
                          className="text-gray-500 hover:text-[#1E3A8A]"
                          title="Edit title"
                        >
                          <Edit2 size={14} />
                        </button>
                      )}
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-500">{c.status}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {role === "legalExpert"
                    ? `Consumer: ${c.consumerName || "-"}`
                    : `Expert: ${c.expertName || "-"}`}
                </p>
                {!c.isFollowUp && c.availableFollowUpFee !== null && c.availableFollowUpFee !== undefined && (
                  <p className="text-xs text-indigo-700 mt-1">Follow-up fee: ₹{c.availableFollowUpFee}</p>
                )}
              </div>

              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                {role === "consumer" && !c.isFollowUp && c.status === "closed" && !c.isActive && (
                  c.hasPendingFollowUpPayment ? (
                    <button
                      onClick={() =>
                        navigate(
                          `/payment?followUpConsultationId=${c.consultationId}`,
                        )
                      }
                      className="text-xs px-3 py-1 rounded-lg bg-amber-100 text-amber-700"
                    >
                      Complete Follow-Up Payment
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartFollowUp(c.consultationId)}
                      disabled={
                        processingFor === c.consultationId ||
                        c.availableFollowUpFee === null ||
                        c.availableFollowUpFee === undefined
                      }
                      className="text-xs px-3 py-1 rounded-lg bg-[#1E3A8A] text-white disabled:bg-gray-300"
                    >
                      {processingFor === c.consultationId ? "Starting..." : "Start Follow-Up"}
                    </button>
                  )
                )}

                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    c.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {c.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Consultations;