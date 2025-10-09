import { useState, useEffect } from "react";
import { apiAdmin } from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function BookingForm({
  onSubmit,
  isSubmitting,
  initialData = null,
}) {
  const navigate = useNavigate();

  // Rooms & services
  const [rooms, setRooms] = useState([]);
  const [services, setServices] = useState([]);

  // Thông tin khách hàng
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [cccd, setCccd] = useState("");

  // Thông tin booking
  const [roomId, setRoomId] = useState("");
  const [checkinDate, setCheckinDate] = useState("");
  const [checkoutDate, setCheckoutDate] = useState("");
  const [status, setStatus] = useState("pending");

  // Dịch vụ chọn kèm
  const [selectedServices, setSelectedServices] = useState([]);

  // Fetch rooms & services
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resRooms, resServices] = await Promise.all([
          apiAdmin.get("/rooms/all"),
          apiAdmin.get("/services/all"),
        ]);

        const roomsData = Array.isArray(resRooms.data)
          ? resRooms.data
          : resRooms.data.rooms || [];
        const servicesData = Array.isArray(resServices.data)
          ? resServices.data
          : resServices.data.services || [];

        setRooms(roomsData);
        setServices(servicesData);
      } catch (err) {
        console.error("Fetch rooms/services error:", err);
        toast.error("Lấy danh sách phòng/dịch vụ thất bại!");
      }
    };
    fetchData();
  }, []);

  // Set initialData khi edit
  useEffect(() => {
    if (initialData) {
      const formatDateLocal = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0"); // tháng từ 0-11
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      setFullname(initialData.customer?.fullname || "");
      setPhone(initialData.customer?.phone || "");
      setEmail(initialData.customer?.email || "");
      setCccd(initialData.customer?.cccd || "");
      setRoomId(initialData.room_id || "");
      setCheckinDate(formatDateLocal(initialData.checkin_date));
      setCheckoutDate(formatDateLocal(initialData.checkout_date));
      setStatus(initialData.status || "pending");
      setSelectedServices(
        initialData.services?.map((s) => ({
          id: s.id,
          quantity: s.pivot?.quantity || 1,
        })) || []
      );
    }
  }, [initialData]);

  const handleServiceChange = (id, quantity) => {
    if (quantity < 0) quantity = 0;
    setSelectedServices((prev) => {
      const existing = prev.find((s) => s.id === id);
      if (existing) {
        return prev.map((s) => (s.id === id ? { ...s, quantity } : s));
      } else {
        return [...prev, { id, quantity }];
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate trước submit
    if (!roomId) return toast.error("Vui lòng chọn phòng!");
    if (!checkinDate || !checkoutDate)
      return toast.error("Vui lòng chọn ngày check-in và check-out!");
    if (new Date(checkoutDate) <= new Date(checkinDate))
      return toast.error("Ngày trả phòng phải sau ngày nhận phòng!");

    onSubmit({
      fullname,
      phone,
      email,
      cccd,
      room_id: roomId,
      checkin_date: checkinDate,
      checkout_date: checkoutDate,
      status,
      services: selectedServices.filter((s) => s.quantity > 0),
    });
  };

  return (
    <form
      className="bg-white shadow rounded p-6 space-y-5"
      onSubmit={handleSubmit}
    >
      <h2 className="text-xl font-semibold">Thông tin khách hàng</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Họ tên</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Số điện thoại</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>CCCD</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={cccd}
            onChange={(e) => setCccd(e.target.value)}
            required
          />
        </div>
      </div>

      <h2 className="text-xl font-semibold pt-4">Thông tin đặt phòng</h2>
      <div>
        <label>Phòng</label>
        <select
          className="w-full border px-3 py-2 rounded"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          required
        >
          <option value="">-- Chọn phòng --</option>
          {Array.isArray(rooms)
            ? rooms
                .filter((room) =>
                  initialData?.room_id === room.id
                    ? true
                    : room.status === "available"
                )
                .map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.room_number} - {room.type} (
                    {room.price.toLocaleString()}₫/đêm)
                  </option>
                ))
            : null}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Check-in</label>
          <input
            type="date"
            className="w-full border px-3 py-2 rounded"
            value={checkinDate}
            onChange={(e) => setCheckinDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Check-out</label>
          <input
            type="date"
            className="w-full border px-3 py-2 rounded"
            value={checkoutDate}
            onChange={(e) => setCheckoutDate(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <label>Trạng thái</label>
        <select
          className="w-full border px-3 py-2 rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <h2 className="text-xl font-semibold pt-4">Dịch vụ kèm theo</h2>
      <div className="space-y-2">
        {Array.isArray(services) && services.length > 0 ? (
          services.map((s) => {
            const selected = selectedServices.find((sel) => sel.id === s.id);
            return (
              <div
                key={s.id}
                className="flex items-center justify-between border p-2 rounded"
              >
                <span>
                  {s.service_name} ({s.price.toLocaleString()}₫)
                </span>
                <input
                  type="number"
                  min="0"
                  placeholder="Số lượng"
                  className="border rounded px-2 py-1 w-24 text-center"
                  value={selected?.quantity || 0}
                  onChange={(e) =>
                    handleServiceChange(s.id, parseInt(e.target.value) || 0)
                  }
                />
              </div>
            );
          })
        ) : (
          <p>Không có dịch vụ nào.</p>
        )}
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={() => navigate("/admin/bookings")}
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
