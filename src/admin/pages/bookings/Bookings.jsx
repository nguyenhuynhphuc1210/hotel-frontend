import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiAdmin } from "../../../api/axios";
import { toast } from "react-toastify";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  // 🟢 Lấy danh sách bookings có phân trang
  const fetchBookings = async (page = 1) => {
    try {
      const res = await apiAdmin.get(`/bookings?page=${page}`);
      setBookings(res.data.data);
      setCurrentPage(res.data.current_page);
      setLastPage(res.data.last_page);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách booking!");
    }
  };

  useEffect(() => {
    fetchBookings(currentPage);
  }, [currentPage]);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa booking này?")) return;
    try {
      await apiAdmin.delete(`/bookings/${id}`);
      toast.success("Xóa booking thành công!");
      fetchBookings(currentPage);
    } catch (err) {
      console.error("Lỗi khi xóa booking:", err);
      toast.error("Xóa booking thất bại!");
    }
  };

  const handleConfirm = async (id) => {
    if (!window.confirm("Xác nhận đặt phòng này?")) return;
    try {
      await apiAdmin.put(`/bookings/${id}/confirm`);
      toast.success("Đã xác nhận đặt phòng!");
      fetchBookings(currentPage);
    } catch (err) {
      console.error("Lỗi khi xác nhận:", err);
      toast.error("Không thể xác nhận booking!");
    }
  };

  // ✅ Hiển thị trạng thái có màu & tiếng Việt
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
            Chờ xác nhận
          </span>
        );
      case "confirmed":
        return (
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
            Đã xác nhận
          </span>
        );
      case "cancelled":
        return (
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
            Đã hủy
          </span>
        );
      case "completed":
        return (
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
            Hoàn tất
          </span>
        );
      default:
        return status;
    }
  };

  // 🟢 Chuyển trang
  const handlePageChange = (page) => {
    if (page >= 1 && page <= lastPage && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  // 🟢 Tạo phân trang hiển thị tối đa 5 số
  const renderPagination = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(currentPage - 2, 1);
    let end = Math.min(start + maxVisible - 1, lastPage);

    if (end - start < maxVisible - 1) {
      start = Math.max(end - maxVisible + 1, 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded ${
            currentPage === i
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
        >
          ←
        </button>
        {start > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              1
            </button>
            {start > 2 && <span className="px-2">...</span>}
          </>
        )}
        {pages}
        {end < lastPage && (
          <>
            {end < lastPage - 1 && <span className="px-2">...</span>}
            <button
              onClick={() => handlePageChange(lastPage)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              {lastPage}
            </button>
          </>
        )}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === lastPage}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
        >
          →
        </button>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Quản lý Booking</h2>

      <Link
        to="/admin/bookings/add"
        className="inline-block mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + Thêm booking
      </Link>

      <div className="mb-2 text-gray-600">
        Tổng cộng: <strong>{total}</strong> booking
      </div>

      <table className="w-full border-collapse bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Phòng</th>
            <th className="border px-4 py-2">Khách hàng</th>
            <th className="border px-4 py-2">Check-in</th>
            <th className="border px-4 py-2">Check-out</th>
            <th className="border px-4 py-2">Tổng tiền</th>
            <th className="border px-4 py-2">Trạng thái</th>
            <th className="border px-4 py-2 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length > 0 ? (
            bookings.map((b) => (
              <tr key={b.id}>
                <td className="border px-4 py-2">{b.id}</td>
                <td className="border px-4 py-2">
                  {b.room?.room_number || b.room_id}
                </td>
                <td className="border px-4 py-2">
                  {b.customer?.name || b.customer_id}
                </td>
                <td className="border px-4 py-2">
                  {new Date(b.checkin_date).toLocaleDateString("vi-VN")}
                </td>
                <td className="border px-4 py-2">
                  {new Date(b.checkout_date).toLocaleDateString("vi-VN")}
                </td>
                <td className="border px-4 py-2">
                  {Number(b.total_price).toLocaleString("vi-VN")} ₫
                </td>
                <td className="border px-4 py-2">{getStatusBadge(b.status)}</td>
                <td className="border px-4 py-2 space-x-2 text-center">
                  <button
                    onClick={() => navigate(`/admin/bookings/detail/${b.id}`)}
                    className="bg-sky-500 text-white px-3 py-1 rounded hover:bg-sky-600"
                  >
                    Chi tiết
                  </button>

                  <Link
                    to={`/admin/bookings/edit/${b.id}`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Sửa
                  </Link>

                  <button
                    onClick={() => handleDelete(b.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Xóa
                  </button>

                  {b.status === "pending" && (
                    <button
                      onClick={() => handleConfirm(b.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Xác nhận
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="8"
                className="border px-4 py-2 text-center text-gray-500"
              >
                Không có booking nào
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 🟢 Hiển thị phân trang */}
      {lastPage > 1 && renderPagination()}
    </div>
  );
}
