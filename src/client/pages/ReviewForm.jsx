import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "../../api/axios";
import { toast } from "react-toastify";

export default function ReviewForm() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [rating, setRating] = useState(5); // mặc định 5 sao
  const [hoverRating, setHoverRating] = useState(0); // hover effect
  const [comment, setComment] = useState("");

  // Lấy thông tin booking
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await apiClient.get(`/my-bookings/${bookingId}`);
        console.log("Booking data:", res.data);
        setBooking(res.data);
      } catch (err) {
        console.error("Fetch booking error:", err.response || err);
        toast.error("Không tìm thấy thông tin đặt phòng!");
      }
    };
    fetchBooking();
  }, [bookingId]);

  // Gửi đánh giá
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post(`/my-bookings/${bookingId}/review`, {
        rating,
        comment,
      });
      toast.success("Đánh giá đã được gửi!");
      navigate("/my-bookings");
    } catch (err) {
      console.error("Submit review error:", err.response || err);
      toast.error(err.response?.data?.message || "Gửi đánh giá thất bại!");
    }
  };

  if (!booking) return <p className="text-center mt-6">Đang tải...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        Đánh giá phòng {booking.room?.room_number || "chưa xác định"}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Star rating */}
        <div>
          <label className="block mb-1 font-semibold">Đánh giá</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-3xl cursor-pointer ${
                  (hoverRating || rating) >= star ? "text-yellow-400" : "text-gray-300"
                }`}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block mb-1 font-semibold">Nhận xét</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Viết nhận xét về phòng..."
            className="w-full border px-3 py-2 rounded"
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Gửi đánh giá
        </button>
      </form>
    </div>
  );
}
