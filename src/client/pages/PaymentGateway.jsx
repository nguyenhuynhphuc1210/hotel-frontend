import { useLocation, useNavigate } from "react-router-dom";
import { apiClient } from "../../api/axios";
import { toast } from "react-toastify";

export default function PaymentGateway() {
  const location = useLocation();
  const navigate = useNavigate();
  const { room, form, selectedServices, total, deposit } = location.state || {};

  const handleFakeTransfer = async () => {
    try {
      const res = await apiClient.post("/bookings", {
        ...form,
        room_id: room.id,
        total_price: total,
        deposit_amount: deposit,
        services: selectedServices.map((s) => ({
          id: s.id,
          quantity: s.quantity,
        })),
      });
      toast.success("Thanh toán & đặt cọc thành công!");
      navigate("/my-bookings", {
        state: { paidBookingId: res.data.booking.id },
      });
    } catch (err) {
      console.error(err);
      toast.error("Thanh toán thất bại!");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow text-center">
      <h2 className="text-xl font-bold mb-4">Ứng dụng Chuyển Tiền Ảo</h2>
      <p className="mb-2">
        Bạn cần chuyển: {deposit.toLocaleString("vi-VN")} ₫
      </p>
      <button
        onClick={handleFakeTransfer}
        className="mt-4 py-2 px-4 bg-blue-600 text-white rounded"
      >
        ✅ Chuyển tiền thành công
      </button>
      <button
        onClick={() => navigate(-1)}
        className="mt-4 ml-2 py-2 px-4 bg-gray-400 text-white rounded"
      >
        ❌ Hủy
      </button>
    </div>
  );
}
