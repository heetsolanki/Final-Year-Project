import { useState } from "react";
import axios from "axios";
import { Star, X } from "lucide-react";
import API_URL from "../api";

const ReviewModal = ({ query, onClose }) => {
  const [rating, setRating] = useState(0);
  const [alert, setAlert] = useState("");
  const [comment, setComment] = useState("");

  const submitReview = async () => {
    if (rating === 0) {
      setAlert("Please select a rating.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API_URL}/api/reviews/add`,
        {
          expertId: query.expertId,
          queryId: query._id,
          rating,
          comment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-bold text-[#0A1F44] mb-4">
          Review Your Expert
        </h2>

        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={28}
              className={`cursor-pointer ${
                star <= rating
                  ? "text-yellow-500 fill-yellow-500"
                  : "text-gray-300"
              }`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
        {alert && <p className="text-red-500 text-sm mb-4">{alert}</p>}

        <textarea
          placeholder="Write your review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border rounded-lg p-3 text-sm mb-4"
        />

        <button
          onClick={submitReview}
          className="w-full bg-[#1E3A8A] text-white py-2.5 rounded-xl font-medium hover:bg-[#1E3A8A]/90"
        >
          Submit Review
        </button>
      </div>
    </div>
  );
};

export default ReviewModal;
