import { useEffect, useState } from "react";
import { apiAdmin } from "../../../api/axios";
import { useNavigate } from "react-router-dom";

export default function BookingServiceForm({
  initialData = {},
  onSubmit,
  isSubmitting,
}) {
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);

  const [bookingId, setBookingId] = useState(initialData.booking_id || "");
  const [serviceId, setServiceId] = useState(initialData.service_id || "");
  const [quantity, setQuantity] = useState(initialData.quantity || 1);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resBookings = await apiAdmin.get("/bookings/all");
        const resServices = await apiAdmin.get("/services/all");
        setBookings(resBookings.data);
        setServices(resServices.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ booking_id: bookingId, service_id: serviceId, quantity });
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
        <label className="block">Dịch vụ</label>
        <select
          className="w-full border px-3 py-2 rounded"
          value={serviceId}
          onChange={(e) => setServiceId(e.target.value)}
          required
        >
          <option value="">-- Chọn dịch vụ --</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.service_name} ({Number(s.price).toLocaleString()}đ)
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block">Số lượng</label>
        <input
          type="number"
          min="1"
          className="w-full border px-3 py-2 rounded"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
      </div>

            <div className="flex space-x-3">
        <button
          type="button"
          onClick={() => navigate("/admin/booking-services")}
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
