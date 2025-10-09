import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiAdmin } from "../../../api/axios";
import { toast } from "react-toastify";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  // 🟢 Lấy danh sách phòng (phân trang)
  const fetchRooms = async (page = 1) => {
    try {
      const res = await apiAdmin.get(`/rooms?page=${page}`);
      setRooms(res.data.data);
      setCurrentPage(res.data.current_page);
      setLastPage(res.data.last_page);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Lỗi khi tải phòng:", err);
      toast.error("Không thể tải danh sách phòng!");
    }
  };

  useEffect(() => {
    fetchRooms(currentPage);
  }, [currentPage]);

  // 🟢 Xử lý xóa phòng
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa phòng này?")) return;
    try {
      await apiAdmin.delete(`/rooms/${id}`);
      toast.success("Xóa phòng thành công!");
      fetchRooms(currentPage);
    } catch (err) {
      console.error("Lỗi khi xóa phòng:", err);
      toast.error("Không thể xóa phòng!");
    }
  };

  // 🟢 Hiển thị trạng thái phòng
  const getStatusDisplay = (status) => {
    switch (status) {
      case "available":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            Còn trống
          </span>
        );
      case "booked":
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
            Đã đặt
          </span>
        );
      case "cleaning":
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            Đang dọn
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
            Không xác định
          </span>
        );
    }
  };

  // 🟢 Chuyển trang
  const handlePageChange = (page) => {
    if (page >= 1 && page <= lastPage && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  // 🟢 Hiển thị nút phân trang (1, 2, 3, ...)
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
      <h2 className="text-2xl font-bold mb-4">Quản lý phòng</h2>

      <Link
        to="/admin/rooms/add"
        className="inline-block mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + Thêm phòng
      </Link>

      <div className="mb-2 text-gray-600">
        Tổng cộng: <strong>{total}</strong> phòng
      </div>

      <table className="w-full border-collapse bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Hình ảnh</th>
            <th className="border px-4 py-2">Số phòng</th>
            <th className="border px-4 py-2">Loại</th>
            <th className="border px-4 py-2">Giá (VNĐ)</th>
            <th className="border px-4 py-2">Trạng thái</th>
            <th className="border px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <tr key={room.id}>
                <td className="border px-4 py-2">{room.id}</td>
                <td className="border px-4 py-2">
                  {room.images && room.images.length > 0 ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL}/storage/${
                        room.images[0].image_path
                      }`}
                      alt={room.room_number}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-400">Chưa có ảnh</span>
                  )}
                </td>
                <td className="border px-4 py-2">{room.room_number}</td>
                <td className="border px-4 py-2">{room.type}</td>
                <td className="border px-4 py-2">
                  {Number(room.price).toLocaleString("vi-VN")} đ
                </td>
                <td className="border px-4 py-2">
                  {getStatusDisplay(room.status)}
                </td>
                <td className="border px-4 py-2 space-x-2">
                  <Link
                    to={`/admin/rooms/edit/${room.id}`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Sửa
                  </Link>
                  <button
                    onClick={() => handleDelete(room.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="7"
                className="border px-4 py-2 text-center text-gray-500"
              >
                Không có phòng nào
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 🟢 Phân trang */}
      {lastPage > 1 && renderPagination()}
    </div>
  );
}
