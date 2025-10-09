import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { room, form, selectedServices = [], total } = location.state || {};

  if (!room || !form) {
    toast.error("Không có thông tin thanh toán");
    navigate("/rooms");
    return null;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    return date.toLocaleDateString("vi-VN");
  };


  const deposit = Math.round(total * 0.2);

  const handleConfirmPayment = () => {
    navigate("/payment-gateway", {
      state: { room, form, selectedServices, total, deposit },
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Xác nhận thanh toán</h2>

      {/* Thông tin phòng */}
      <div className="border-b pb-4 mb-4">
        <h3 className="text-xl font-semibold mb-3 text-blue-600">
          Thông tin phòng
        </h3>
        <p><strong>Số phòng:</strong> {room.room_number}</p>
        <p><strong>Loại phòng:</strong> {room.type}</p>
        <p><strong>Giá / đêm:</strong> {room.price.toLocaleString("vi-VN")} ₫</p>
        <p><strong>Mô tả:</strong> {room.description || "Không có mô tả"}</p>
      </div>

      {/* Thông tin khách đặt */}
      <div className="border-b pb-4 mb-4">
        <h3 className="text-xl font-semibold mb-3 text-blue-600">
          Thông tin khách đặt
        </h3>
        <p><strong>Họ tên:</strong> {form.fullname}</p>
        <p><strong>Số điện thoại:</strong> {form.phone}</p>
        <p><strong>Email:</strong> {form.email}</p>
        <p><strong>CCCD/CMND:</strong> {form.cccd}</p>
        <p><strong>Ngày nhận phòng:</strong> {formatDate(form.checkin_date)}</p>
        <p><strong>Ngày trả phòng:</strong> {formatDate(form.checkout_date)}</p>
      </div>

      {/* Dịch vụ đã chọn */}
      {selectedServices.length > 0 && (
        <div className="border-b pb-4 mb-4">
          <h3 className="text-xl font-semibold mb-3 text-blue-600">
            Dịch vụ bổ sung
          </h3>
          <ul className="list-disc ml-6 space-y-1">
            {selectedServices.map((s) => (
              <li key={s.id}>
                {s.service_name} x{s.quantity} ={" "}
                {(s.price * s.quantity).toLocaleString("vi-VN")} ₫
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tổng tiền và cọc */}
      <div className="text-right">
        <p className="text-lg">
          <strong>Tổng tiền:</strong>{" "}
          <span className="text-gray-800 font-semibold">
            {total.toLocaleString("vi-VN")} ₫
          </span>
        </p>
        <p className="text-lg text-red-600 font-bold">
          Tiền cọc (20%): {deposit.toLocaleString("vi-VN")} ₫
        </p>
      </div>

      <button
        onClick={handleConfirmPayment}
        className="mt-6 w-full py-3 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition"
      >
        Xác nhận đặt cọc
      </button>
    </div>
  );
}
