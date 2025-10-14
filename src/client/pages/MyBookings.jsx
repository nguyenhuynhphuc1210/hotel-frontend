import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { apiClient } from "../../api/axios";
import { toast } from "react-toastify";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const location = useLocation();

  // Lấy danh sách đặt phòng
  const fetchBookings = async () => {
    try {
      const res = await apiClient.get("/my-bookings");
      setBookings(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Lấy danh sách đặt phòng thất bại!");
    }
  };

  // Khi component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  // Làm mới khi thanh toán hoặc hủy phòng
  useEffect(() => {
    if (location.state?.refresh) {
      fetchBookings();
    }
  }, [location.state]);

  const formatCurrency = (amount) =>
    Number(amount || 0).toLocaleString("vi-VN") + " đ";

  // Hủy phòng
  const handleCancel = async (id) => {
    if (!window.confirm("Bạn có chắc muốn hủy phòng này?")) return;

    try {
      const res = await apiClient.delete(`/bookings/${id}/cancel`);
      toast.success(res.data.message || "Hủy phòng thành công!");
      setBookings((prev) =>
        prev.map((b) =>
          b.id === id
            ? {
                ...b,
                status: "cancelled",
                invoice: { ...b.invoice, status: "cancelled" },
              }
            : b
        )
      );
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Hủy phòng thất bại!");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Đặt phòng của tôi</h2>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-500">Bạn chưa có đặt phòng nào.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse shadow rounded-lg bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2 text-left text-sm">ID</th>
                <th className="border px-3 py-2 text-left text-sm">Phòng</th>
                <th className="border px-3 py-2 text-right text-sm">
                  Tổng tiền
                </th>
                <th className="border px-3 py-2 text-right text-sm">Đã cọc</th>
                <th className="border px-3 py-2 text-right text-sm">Còn lại</th>
                <th className="border px-3 py-2 text-center text-sm">
                  Thanh toán
                </th>
                <th className="border px-3 py-2 text-center text-sm">
                  Tình trạng
                </th>
                <th className="border px-3 py-2 text-center text-sm">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => {
                const deposit = Number(b.deposit_amount || 0);
                const isPaid = b.invoice?.status === "paid";
                const remain = isPaid
                  ? 0
                  : Math.max(Number(b.total_price || 0) - deposit, 0);

                return (
                  <tr
                    key={b.id}
                    className="hover:bg-gray-50 border-b last:border-b-0"
                  >
                    <td className="border px-3 py-2 text-sm">{b.id}</td>
                    <td className="border px-3 py-2 text-sm">
                      {b.room?.room_number || "Không xác định"}
                    </td>
                    <td className="border px-3 py-2 text-sm text-right font-medium">
                      {formatCurrency(b.total_price)}
                    </td>
                    <td className="border px-3 py-2 text-sm text-right text-blue-600 font-semibold">
                      {formatCurrency(deposit)}
                    </td>
                    <td
                      className={`border px-3 py-2 text-sm text-right font-semibold ${
                        remain > 0 ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {formatCurrency(remain)}
                    </td>

                    {/* Trạng thái thanh toán */}
                    <td
                      className={`border px-3 py-2 text-center text-sm font-semibold ${
                        isPaid
                          ? "text-green-700"
                          : b.invoice?.status === "cancelled"
                          ? "text-gray-500"
                          : "text-yellow-600"
                      }`}
                    >
                      {isPaid
                        ? "Đã thanh toán"
                        : b.invoice?.status === "cancelled"
                        ? "Đã hủy"
                        : "Chưa thanh toán"}
                    </td>

                    {/* Trạng thái đặt phòng */}
                    <td
                      className={`border px-3 py-2 text-center text-sm ${
                        b.status === "completed"
                          ? "text-green-600"
                          : b.status === "cancelled"
                          ? "text-gray-500"
                          : b.status === "confirmed"
                          ? "text-blue-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {b.status === "completed"
                        ? "Hoàn thành"
                        : b.status === "cancelled"
                        ? "Đã hủy"
                        : b.status === "confirmed"
                        ? "Đã xác nhận"
                        : "Đang xử lý"}
                    </td>

                    {/* Hành động */}
                    <td className="border px-3 py-2 text-center text-sm flex flex-wrap justify-center gap-1">
                      <Link
                        to={`/my-bookings/${b.id}`}
                        className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 text-xs"
                      >
                        Chi tiết
                      </Link>

                      {!isPaid && remain > 0 && (
                        <Link
                          to="/pay"
                          state={{
                            room: b.room,
                            form: b,
                            total: b.total_price,
                            deposit: remain,
                            invoiceId: b.invoice?.id,
                          }}
                          className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 text-xs"
                        >
                          Thanh toán
                        </Link>
                      )}

                      {!isPaid && b.status !== "cancelled" && (
                        <button
                          onClick={() => handleCancel(b.id)}
                          className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-xs"
                        >
                          Hủy phòng
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
