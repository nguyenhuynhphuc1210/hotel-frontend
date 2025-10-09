import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiAdmin } from "../../../api/axios";

export default function BookingDetail() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await apiAdmin.get(`/bookings/${id}`);
        setBooking(res.data);
      } catch (err) {
        console.error("Lỗi khi tải chi tiết booking:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  if (loading) return <p className="text-gray-500">⏳ Đang tải dữ liệu...</p>;
  if (!booking) return <p className="text-red-500">❌ Không tìm thấy booking.</p>;

  const calcNights = (checkin, checkout) => {
    const inDate = new Date(checkin);
    const outDate = new Date(checkout);
    const diff = outDate - inDate;
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const nights = calcNights(booking.checkin_date, booking.checkout_date);

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Chờ xác nhận</span>;
      case "deposit_paid":
        return <span className="bg-sky-100 text-sky-800 px-2 py-1 rounded">Đã cọc</span>;
      case "confirmed":
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Đã xác nhận</span>;
      case "cancelled":
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded">Đã hủy</span>;
      case "completed":
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Hoàn tất</span>;
      default:
        return status;
    }
  };

  return (
    <div className="bg-white shadow p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Chi tiết Booking #{booking.id}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Phòng */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold border-b pb-2">Thông tin phòng</h3>
          <p><strong>Số phòng:</strong> {booking.room?.room_number || booking.room_id}</p>
          <p><strong>Loại phòng:</strong> {booking.room?.type || "—"}</p>
          <p><strong>Giá phòng:</strong> {booking.room ? booking.room.price.toLocaleString("vi-VN") : "—"} ₫ / đêm</p>
          <p><strong>Số đêm ở:</strong> {nights} đêm</p>
        </div>

        {/* Khách hàng */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold border-b pb-2">Thông tin khách hàng</h3>
          <p><strong>Họ tên:</strong> {booking.customer?.name || booking.customer_id}</p>
          <p><strong>Email:</strong> {booking.customer?.email || "—"}</p>
          <p><strong>SĐT:</strong> {booking.customer?.phone || "—"}</p>
        </div>

        {/* Thời gian */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold border-b pb-2">Thời gian đặt phòng</h3>
          <p><strong>Check-in:</strong> {new Date(booking.checkin_date).toLocaleDateString("vi-VN")}</p>
          <p><strong>Check-out:</strong> {new Date(booking.checkout_date).toLocaleDateString("vi-VN")}</p>
          <p><strong>Trạng thái:</strong> {getStatusBadge(booking.status)}</p>
        </div>

        {/* Thanh toán */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold border-b pb-2">Thanh toán</h3>
          <p><strong>Tổng tiền:</strong> {booking.total_price.toLocaleString("vi-VN")} ₫</p>
          <p><strong>Tiền cọc:</strong> {booking.deposit_amount.toLocaleString("vi-VN")} ₫</p>
          <p><strong>Còn lại:</strong> {booking.remaining_amount.toLocaleString("vi-VN")} ₫</p>
        </div>
      </div>

      {/* Dịch vụ */}
      {booking.services && booking.services.length > 0 ? (
        <div className="mt-8">
          <h3 className="text-lg font-semibold border-b pb-2 mb-3">Dịch vụ đi kèm</h3>
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Tên dịch vụ</th>
                <th className="border px-4 py-2 text-right">Giá</th>
                <th className="border px-4 py-2 text-center">Số lượng</th>
                <th className="border px-4 py-2 text-right">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {booking.services.map((s, idx) => {
                const quantity = s.pivot?.quantity || 1;
                const total = s.price * quantity;
                return (
                  <tr key={idx}>
                    <td className="border px-4 py-2">{s.service_name}</td>
                    <td className="border px-4 py-2 text-right">{s.price.toLocaleString("vi-VN")} ₫</td>
                    <td className="border px-4 py-2 text-center">{quantity}</td>
                    <td className="border px-4 py-2 text-right">{total.toLocaleString("vi-VN")} ₫</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-8 italic text-gray-500">Không có dịch vụ đi kèm.</p>
      )}

      <div className="mt-6 border-t pt-4">
        <p><strong>Ghi chú:</strong> {booking.note || "Không có ghi chú"}</p>
        <p className="text-gray-500 text-sm mt-2">
          Ngày tạo: {new Date(booking.created_at).toLocaleString("vi-VN")}
        </p>
      </div>

      <div className="mt-6">
        <Link
          to="/admin/bookings"
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          ← Quay lại danh sách
        </Link>
      </div>
    </div>
  );
}
