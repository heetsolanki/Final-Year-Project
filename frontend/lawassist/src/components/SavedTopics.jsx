import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../api";
import { Bookmark, ArrowLeft, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SavedTopics = ({ onClose }) => {
  const [savedSections, setSavedSections] = useState([]);
  const navigate = useNavigate();

  const fetchSavedTopics = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_URL}/api/bookmarks/saved-laws`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const bookmarks = res.data;

      // Fetch law details to get section descriptions
      const detailedSections = await Promise.all(
        bookmarks.map(async (item) => {
          const lawRes = await axios.get(`${API_URL}/api/laws/${item.lawId}`);

          const section = lawRes.data.sections.find(
            (sec) => sec.alias === item.sectionAlias,
          );

          return {
            lawId: item.lawId,
            sectionAlias: item.sectionAlias,
            shortDescription: section?.description?.short || "",
          };
        }),
      );

      setSavedSections(detailedSections);
    } catch (error) {
      console.error(error);
    }
  };

  const removeBookmark = async (lawId, sectionAlias) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${API_URL}/api/bookmarks/remove-law/${lawId}/${sectionAlias}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSavedSections((prev) =>
        prev.filter(
          (item) =>
            !(item.lawId === lawId && item.sectionAlias === sectionAlias),
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSavedTopics();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* Back Button */}
      <button
        onClick={onClose}
        className="flex items-center gap-2 text-sm font-medium text-[#1E3A8A] hover:underline mb-6"
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      {/* Header */}
      <h2 className="text-xl font-semibold text-[#0A1F44] mb-6 flex items-center gap-2">
        <Bookmark size={20} /> Saved Topics
      </h2>

      {/* Empty State */}
      {savedSections.length === 0 ? (
        <p className="text-gray-500 text-sm">No bookmarked sections yet.</p>
      ) : (
        <div className="space-y-4">
          {savedSections.map((item, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 hover:shadow-md transition flex justify-between items-start"
            >
              {/* Left Side (clickable content) */}
              <div
                className="cursor-pointer"
                onClick={() =>
                  navigate(`/laws/${item.lawId}`, {
                    state: { sectionAlias: item.sectionAlias },
                  })
                }
              >
                <p className="font-medium text-[#1E3A8A]">
                  {item.sectionAlias}
                </p>
                <p className="text-gray-600 text-sm">{item.shortDescription}</p>
              </div>

              {/* Remove Bookmark Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // prevent navigation
                  removeBookmark(item.lawId, item.sectionAlias);
                }}
                className="text-red-500 hover:text-red-700"
                title="Remove Bookmark"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedTopics;
