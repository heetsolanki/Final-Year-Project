import { useEffect, useState } from "react";
import axios from "axios";
import { Star } from "lucide-react";
import API_URL from "../../../api";
import DashboardCard from "../DashboardCard";

const ClientReviewsTab = ({ expertUserId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        if (!expertUserId) return;
        const res = await axios.get(`${API_URL}/api/reviews/expert/${expertUserId}`);
        setReviews(res.data || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [expertUserId]);

  return (
    <DashboardCard title="Client Reviews" icon={Star}>
      {loading ? (
        <div className="py-8 text-sm text-gray-500">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="py-8 text-sm text-gray-500">No client reviews yet.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm"
            >
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-800">
                  {review.username || "Client"}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="mb-2 flex gap-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Star
                    key={value}
                    size={14}
                    className={
                      value <= review.rating
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>

              <p className="text-sm text-gray-600">
                {review.comment || "No written feedback."}
              </p>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
};

export default ClientReviewsTab;
