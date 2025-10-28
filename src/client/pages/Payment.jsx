import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import { apiClient } from "../../api/axios";

export default function Payment() {
  const location = useLocation();
  const { room, form, total, deposit = 0, bookingId } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState("");

  if (!form || !room || !bookingId) {
    toast.error("Không có dữ liệu thanh toán!");
    return null;
  }

  const remaining = total - deposit;

  const formatCurrency = (amount) =>
    Number(amount || 0).toLocaleString("vi-VN") + " đ";

  const handlePay = async () => {
    if (!paymentMethod) {
      toast.error("Vui lòng chọn phương thức thanh toán!");
      return;
    }

    try {
      let response;
      if (paymentMethod === "momo") {
        response = await apiClient.post("/payment/momo/pay-remaining", { booking_id: bookingId });
      } else if (paymentMethod === "vnpay") {
        response = await apiClient.post("/payment/vnpay/pay-remaining", { booking_id: bookingId });
      }

      if (response?.data?.payUrl) {
        window.location.href = response.data.payUrl;
      } else {
        toast.error("Không thể tạo link thanh toán");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi khởi tạo thanh toán");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Thanh toán số tiền còn lại</h2>

      {/* Thanh toán */}
      <div className="border-b pb-4 mb-4">
        <h3 className="text-xl font-semibold mb-3 text-blue-600">Số tiền cần thanh toán</h3>
        <p><strong>Tổng tiền:</strong> {formatCurrency(total)}</p>
        <p><strong>Đã cọc:</strong> {formatCurrency(deposit)}</p>
        <p className="text-red-600 font-bold"><strong>Còn lại:</strong> {formatCurrency(remaining)}</p>
      </div>

      {/* Chọn phương thức thanh toán */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3 text-blue-600">Chọn phương thức thanh toán</h3>

        <div className="space-y-3">
          {/* MoMo */}
          <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition 
            ${paymentMethod === "momo" ? "border-pink-500 bg-pink-50" : "border-gray-300 hover:border-pink-400"}`}>
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
                <p className="font-semibold text-gray-800">Thanh toán qua MoMo</p>
                <p className="text-sm text-gray-500">Thanh toán nhanh chóng qua ví MoMo</p>
              </div>
            </div>
          </label>

          {/* VNPay */}
          <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition 
            ${paymentMethod === "vnpay" ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"}`}>
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
                <p className="font-semibold text-gray-800">Thanh toán qua VNPay</p>
                <p className="text-sm text-gray-500">Thanh toán an toàn qua VNPay</p>
              </div>
            </div>
          </label>
        </div>
      </div>

      <button
        onClick={handlePay}
        className="mt-4 w-full py-3 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition"
      >
        Thanh toán số tiền còn lại
      </button>
    </div>
  );
}
