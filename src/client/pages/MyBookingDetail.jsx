import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { apiClient } from "../../api/axios";
import { toast } from "react-toastify";

export default function MyBookingDetail() {
  const { id } = useParams(); // Lấy id booking từ URL
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);

  // Lấy chi tiết booking của khách hàng hiện tại
  const fetchBookingDetail = async () => {
    try {
      const res = await apiClient.get(`/my-bookings/${id}`);
      setBooking(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Lấy chi tiết đặt phòng thất bại!");
      navigate("/my-bookings"); // Trở về danh sách nếu lỗi
    }
  };

  useEffect(() => {
    fetchBookingDetail();
  }, [id]);

  const formatCurrency = (amount) =>
    Number(amount || 0).toLocaleString("vi-VN") + " đ";

  if (!booking) {
    return <p className="text-center mt-6">Đang tải chi tiết...</p>;
  }

  const deposit = Number(booking.deposit_amount || 0);
  const isPaid = booking.invoice?.status === "paid";
  const remain = isPaid ? 0 : Math.max(Number(booking.total_price || 0) - deposit, 0);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Chi tiết đặt phòng #{booking.id}
      </h2>

      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <div className="flex justify-between">
          <span className="font-semibold">Phòng:</span>
          <span>{booking.room?.room_number || "Không xác định"}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold">Tổng tiền:</span>
          <span>{formatCurrency(booking.total_price)}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold">Đã cọc:</span>
          <span className="text-blue-600 font-semibold">{formatCurrency(deposit)}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold">Còn lại:</span>
          <span className={`font-semibold ${remain > 0 ? "text-red-600" : "text-green-600"}`}>
            {formatCurrency(remain)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold">Thanh toán:</span>
          <span
            className={`font-semibold ${
              isPaid
                ? "text-green-700"
                : booking.invoice?.status === "cancelled"
                ? "text-gray-500"
                : "text-yellow-600"
            }`}
          >
            {isPaid
              ? "Đã thanh toán"
              : booking.invoice?.status === "cancelled"
              ? "Đã hủy"
              : "Chưa thanh toán"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold">Tình trạng đặt phòng:</span>
          <span
            className={`font-semibold ${
              booking.status === "completed"
                ? "text-green-600"
                : booking.status === "cancelled"
                ? "text-gray-500"
                : "text-yellow-600"
            }`}
          >
            {booking.status === "completed"
              ? "Hoàn thành"
              : booking.status === "cancelled"
              ? "Đã hủy"
              : "Đang xử lý"}
          </span>
        </div>

        {/* Thông tin ngày nhận/trả */}
        <div className="flex justify-between">
          <span className="font-semibold">Ngày nhận:</span>
          <span>{booking.checkin_date || "-"}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold">Ngày trả:</span>
          <span>{booking.checkout_date || "-"}</span>
        </div>

        {/* Thông tin khách hàng */}
        <div className="flex justify-between">
          <span className="font-semibold">Khách hàng:</span>
          <span>{booking.customer?.fullname || "Không xác định"}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold">Email:</span>
          <span>{booking.customer?.email || "-"}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold">Số điện thoại:</span>
          <span>{booking.customer?.phone || "-"}</span>
        </div>

        {/* Danh sách dịch vụ nếu có */}
        {booking.services && booking.services.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Dịch vụ:</h3>
            <ul className="list-disc list-inside">
              {booking.services.map((s) => (
                <li key={s.id}>
                  {s.service_name} x {s.pivot.quantity} = {formatCurrency(s.pivot.total_price)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-6 text-center">
        <Link
          to="/my-bookings"
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Quay lại danh sách
        </Link>
      </div>
    </div>
  );
}
