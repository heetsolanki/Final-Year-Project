import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../../../api";
import { Bookmark, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardCard from "../DashboardCard";

const SavedTopics = () => {
  const [savedSections, setSavedSections] = useState([]);
  const navigate = useNavigate();

  const fetchSavedTopics = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_URL}/api/bookmarks/saved-laws`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const bookmarks = res.data;

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
          headers: { Authorization: `Bearer ${token}` },
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
    <DashboardCard title="Saved Topics" icon={Bookmark}>
      {savedSections.length === 0 ? (
        <p className="text-sm text-gray-500">
          You haven't saved any sections yet.
        </p>
      ) : (
        <div className="space-y-3">
          {savedSections.map((item, index) => (
            <div
              key={index}
              onClick={() =>
                navigate(`/laws/${item.lawId}`, {
                  state: { sectionAlias: item.sectionAlias },
                })
              }
              className="flex items-start justify-between p-4 border border-gray-200 rounded-xl cursor-pointer
              hover:bg-gray-50 transition"
            >
              {/* Left side */}
              <div className="flex-1 pr-4">
                <p className="font-medium text-[#1E3A8A]">
                  {item.sectionAlias}
                </p>

                <p className="text-gray-600 text-sm mt-1">
                  {item.shortDescription}
                </p>
              </div>

              {/* Remove button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeBookmark(item.lawId, item.sectionAlias);
                }}
                className="text-red-500 hover:text-red-700 flex-shrink-0"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
};

export default SavedTopics;
