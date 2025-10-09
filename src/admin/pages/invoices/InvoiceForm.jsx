import { useEffect, useState } from "react";
import { apiAdmin } from "../../../api/axios";
import { useNavigate } from "react-router-dom";

export default function InvoiceForm({ initialData = {}, onSubmit, isSubmitting }) {
  const [bookings, setBookings] = useState([]);

  const [bookingId, setBookingId] = useState(initialData.booking_id || "");
  const [totalAmount, setTotalAmount] = useState(initialData.total_amount || "");
  const [paymentDate, setPaymentDate] = useState(initialData.payment_date || "");
  const [status, setStatus] = useState(initialData.status || "unpaid");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await apiAdmin.get("/bookings/all");
        setBookings(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBookings();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      booking_id: bookingId,
      total_amount: totalAmount,
      payment_date: paymentDate || null,
      status,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded p-4 space-y-4">
      <div>
        <label className="block">Booking</label>
        <select
          className="w-full border px-3 py-2 rounded"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
          required
        >
          <option value="">-- Chọn booking --</option>
          {bookings.map((b) => (
            <option key={b.id} value={b.id}>
              #{b.id} - Phòng {b.room?.room_name || b.room_id}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block">Tổng tiền</label>
        <input
          type="number"
          min="0"
          className="w-full border px-3 py-2 rounded"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block">Ngày thanh toán</label>
        <input
          type="datetime-local"
          className="w-full border px-3 py-2 rounded"
          value={paymentDate || ""}
          onChange={(e) => setPaymentDate(e.target.value)}
        />
      </div>

      <div>
        <label className="block">Trạng thái</label>
        <select
          className="w-full border px-3 py-2 rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="unpaid">Chưa thanh toán</option>
          <option value="paid">Đã thanh toán</option>
          <option value="cancelled">Đã hủy</option>
        </select>
      </div>

            <div className="flex space-x-3">
        <button
          type="button"
          onClick={() => navigate("/admin/invoices")}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Trở về
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Đang lưu..." : "Lưu"}
        </button>
      </div>
    </form>
  );
}
