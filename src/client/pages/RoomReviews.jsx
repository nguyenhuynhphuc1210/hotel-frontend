import { useEffect, useState } from "react";
import { apiClient } from "../../api/axios";

export default function RoomReviews({ roomId }) {
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await apiClient.get(`/rooms/${roomId}/reviews`);
        setReviews(res.data.reviews || []);
        setAvgRating(res.data.average_rating || 0);
      } catch (err) {
        console.error("Lỗi khi lấy đánh giá:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [roomId]);

  if (loading)
    return <p className="text-gray-500 text-center">Đang tải đánh giá...</p>;

  return (
    <div>
      {/* Trung bình sao */}
      <div className="mb-4">
        <span className="text-3xl text-yellow-400">
          {"★".repeat(Math.round(avgRating))}
          {"☆".repeat(5 - Math.round(avgRating))}
        </span>
        <span className="ml-2 text-lg font-semibold text-gray-700">
          {avgRating.toFixed(1)} / 5
        </span>
      </div>

      {/* Danh sách review */}
      {reviews.length === 0 ? (
        <p className="text-gray-500">Chưa có đánh giá nào cho phòng này.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-gray-800">{r.user}</h4>
                <span className="text-yellow-400 text-lg">
                  {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                </span>
              </div>
              <p className="text-gray-700 mb-1">{r.comment}</p>
              <small className="text-gray-500">{r.created_at}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
