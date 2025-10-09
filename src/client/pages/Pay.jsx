import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiClient } from "../../api/axios"; // axios đã config token

export default function Pay() {
  const location = useLocation();
  const navigate = useNavigate();
  const { room, form, total, deposit, invoiceId } = location.state || {};

  const handlePay = async () => {
    if (!invoiceId) {
      toast.error("Không tìm thấy hóa đơn để thanh toán!");
      return;
    }

    try {
      await apiClient.patch(`/invoices/${invoiceId}/pay`);

      toast.success("Thanh toán thành công!");

      // Quay về MyBookings và yêu cầu refresh danh sách
      navigate("/my-bookings", { state: { refresh: true } });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Thanh toán thất bại!");
    }
  };

  if (!form) return <p>Không có dữ liệu thanh toán!</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Thanh toán phòng {room?.room_number}</h2>
      <p>Tổng tiền: {total.toLocaleString("vi-VN")} đ</p>
      <p>Số tiền còn lại cần thanh toán: {deposit.toLocaleString("vi-VN")} đ</p>
      <button
        onClick={handlePay}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Thanh toán
      </button>
    </div>
  );
}
