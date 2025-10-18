import { useParams } from "react-router-dom";

export default function ReviewBooking() {
  const { bookingId } = useParams();

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Đánh giá booking #{bookingId}</h2>
      <form>
        <textarea className="w-full border p-2 rounded mb-2" rows={4} placeholder="Nhập đánh giá..." />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Gửi đánh giá
        </button>
      </form>
    </div>
  );
}
