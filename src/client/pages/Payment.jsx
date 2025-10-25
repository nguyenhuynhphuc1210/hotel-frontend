import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import { apiClient } from "../../api/axios";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { room, form, selectedServices = [], total } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState("");

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

  const getTypeLabel = (type) => {
    switch (type) {
      case "single":
        return "Phòng đơn";
      case "double":
        return "Phòng đôi";
      case "suite":
        return "Phòng VIP";
      default:
        return type;
    }
  };

  const deposit = Math.round(total * 0.2);

  const handleConfirmPayment = async () => {
    if (!paymentMethod) {
      toast.error("Vui lòng chọn phương thức thanh toán");
      return;
    }

    if (paymentMethod === "momo") {
      try {
        const customerId = localStorage.getItem("customer_id"); // hoặc lấy từ user context
        const response = await apiClient.post("/payment/momo", {
          amount: deposit,
          orderInfo: `Đặt cọc phòng ${room.room_number}`,
          room_id: room.id,
          customer_id: customerId,
          checkin_date: form.checkin_date,
          checkout_date: form.checkout_date,
          total: total,
        });

        if (response.data && response.data.payUrl) {
          window.location.href = response.data.payUrl;
        } else {
          toast.error("Không thể khởi tạo thanh toán MoMo");
        }
      } catch (error) {
        console.error(error);
        toast.error("Lỗi khi khởi tạo thanh toán MoMo");
      }
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Xác nhận đặt cọc</h2>

      {/* Thông tin phòng */}
      <div className="border-b pb-4 mb-4">
        <h3 className="text-xl font-semibold mb-3 text-blue-600">
          Thông tin phòng
        </h3>
        <p>
          <strong>Số phòng:</strong> {room.room_number}
        </p>
        <p>
          <strong>Loại phòng:</strong> {getTypeLabel(room.type)}
        </p>
        <p>
          <strong>Giá / đêm:</strong> {room.price.toLocaleString("vi-VN")} ₫
        </p>
      </div>

      {/* Thông tin khách */}
      <div className="border-b pb-4 mb-4">
        <h3 className="text-xl font-semibold mb-3 text-blue-600">
          Thông tin khách đặt
        </h3>
        <p>
          <strong>Họ tên:</strong> {form.fullname}
        </p>
        <p>
          <strong>Số điện thoại:</strong> {form.phone}
        </p>
        <p>
          <strong>Email:</strong> {form.email}
        </p>
        <p>
          <strong>CCCD/CMND:</strong> {form.cccd}
        </p>
        <p>
          <strong>Ngày nhận phòng:</strong> {formatDate(form.checkin_date)}
        </p>
        <p>
          <strong>Ngày trả phòng:</strong> {formatDate(form.checkout_date)}
        </p>
      </div>

      {/* Dịch vụ bổ sung */}
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

      {/* Tổng tiền */}
      <div className="text-right mb-6">
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

      {/* Chọn phương thức thanh toán */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3 text-blue-600">
          Chọn phương thức thanh toán
        </h3>

        <div className="space-y-3">
          {/* MoMo */}
          <label
            className={`flex items-center p-4 border rounded-lg cursor-pointer transition 
        ${
          paymentMethod === "momo"
            ? "border-pink-500 bg-pink-50"
            : "border-gray-300 hover:border-pink-400"
        }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="momo"
              checked={paymentMethod === "momo"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-3 accent-pink-500"
            />
            <div className="flex items-center space-x-3">
              <img
                src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
                alt="MoMo"
                className="w-10 h-10"
              />
              <div>
                <p className="font-semibold text-gray-800">
                  Thanh toán qua MoMo
                </p>
                <p className="text-sm text-gray-500">
                  Thanh toán nhanh chóng qua ví MoMo
                </p>
              </div>
            </div>
          </label>

          {/* VNPay */}
          <label
            className={`flex items-center p-4 border rounded-lg cursor-pointer transition 
        ${
          paymentMethod === "vnpay"
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-400"
        }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="vnpay"
              checked={paymentMethod === "vnpay"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-3 accent-blue-500"
            />
            <div className="flex items-center space-x-3">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/1/16/VNPAY_logo.png"
                alt="VNPay"
                className="w-10 h-10"
              />
              <div>
                <p className="font-semibold text-gray-800">
                  Thanh toán qua VNPay
                </p>
                <p className="text-sm text-gray-500">
                  Thanh toán an toàn qua VNPay
                </p>
              </div>
            </div>
          </label>
        </div>
      </div>

      <button
        onClick={handleConfirmPayment}
        className="mt-4 w-full py-3 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition"
      >
        Xác nhận đặt cọc
      </button>
    </div>
  );
}
