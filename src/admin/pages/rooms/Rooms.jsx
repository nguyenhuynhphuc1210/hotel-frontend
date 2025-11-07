import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiAdmin } from "../../../api/axios";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

export default function Rooms() {
  const [allRooms, setAllRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Fetch tất cả phòng 1 lần
  const fetchAllRooms = async () => {
    try {
      const res = await apiAdmin.get("/rooms?all=true");
      setAllRooms(res.data);
    } catch (err) {
      console.error("Lỗi tải phòng:", err);
      toast.error("Không thể tải danh sách phòng!");
    }
  };

  useEffect(() => {
    fetchAllRooms();
  }, []);

  // Lọc và tìm kiếm khi thay đổi search / filter
  useEffect(() => {
    let rooms = [...allRooms];

    if (searchQuery.trim()) {
      rooms = rooms.filter((r) =>
        r.room_number.toString().includes(searchQuery.trim())
      );
    }

    if (statusFilter !== "all") {
      rooms = rooms.filter((r) => r.status === statusFilter);
    }

    if (typeFilter !== "all") {
      rooms = rooms.filter((r) => r.type === typeFilter);
    }

    setFilteredRooms(rooms);
    setCurrentPage(1); // reset page khi lọc
  }, [allRooms, searchQuery, statusFilter, typeFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa phòng này?")) return;
    try {
      await apiAdmin.delete(`/rooms/${id}`);
      toast.success("Xóa phòng thành công!");
      fetchAllRooms();
    } catch (err) {
      console.error("Lỗi khi xóa phòng:", err);
      toast.error("Không thể xóa phòng!");
    }
  };

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

  const getRoomTypeDisplay = (type) => {
    switch (type) {
      case "single":
        return "Phòng đơn";
      case "double":
        return "Phòng đôi";
      case "suite":
        return "Phòng VIP";
      default:
        return "Không xác định";
    }
  };

  const handleImportExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (!jsonData.length) {
        toast.error("File Excel trống hoặc sai định dạng!");
        return;
      }

      // Kiểm tra và chuyển dữ liệu
      const formattedRooms = jsonData.map((r) => ({
        room_number: r.room_number || r["Số phòng"],
        type: r.type || r["Loại phòng"]?.toLowerCase(),
        price: r.price || r["Giá"],
        status: r.status || r["Trạng thái"]?.toLowerCase() || "available",
      }));

      // Gửi lên server
      const res = await apiAdmin.post("/rooms/import", formattedRooms);

      if (res.status === 200) {
        toast.success(`Import thành công ${formattedRooms.length} phòng!`);
        fetchAllRooms(); // reload lại danh sách
      } else {
        toast.error("Lỗi khi import phòng!");
      }
    } catch (err) {
      console.error("Lỗi import Excel:", err);
      toast.error("Không thể đọc file Excel!");
    }

    // reset input để lần sau chọn cùng file vẫn trigger
    e.target.value = "";
  };

  // Phân trang frontend
  const lastPage = Math.ceil(filteredRooms.length / pageSize);
  const paginatedRooms = filteredRooms.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= lastPage) setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(currentPage - 2, 1);
    let end = Math.min(start + maxVisible - 1, lastPage);

    if (end - start < maxVisible - 1) start = Math.max(end - maxVisible + 1, 1);

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

      <div className="flex flex-wrap gap-4 mb-4 items-center">
        {/* Nút thêm phòng */}
        <Link
          to="/admin/rooms/add"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Thêm phòng
        </Link>

        {/* Import Excel */}
        <input
          type="file"
          accept=".xlsx, .xls"
          id="excelInput"
          className="hidden"
          onChange={handleImportExcel}
        />
        <label
          htmlFor="excelInput"
          className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
        >
          📁 Import Excel
        </label>

        {/* Bộ lọc */}
        <input
          type="text"
          placeholder="Tìm kiếm theo số phòng..."
          className="px-3 py-2 border rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className="px-3 py-2 border rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="available">Còn trống</option>
          <option value="booked">Đã đặt</option>
          <option value="cleaning">Đang dọn</option>
        </select>

        <select
          className="px-3 py-2 border rounded"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">Tất cả loại phòng</option>
          <option value="single">Phòng đơn</option>
          <option value="double">Phòng đôi</option>
          <option value="suite">Phòng VIP</option>
        </select>
      </div>

      <div className="mb-2 text-gray-600">
        Tổng cộng: <strong>{filteredRooms.length}</strong> phòng
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
          {paginatedRooms.length > 0 ? (
            paginatedRooms.map((room) => (
              <tr key={room.id}>
                <td className="border px-4 py-2">{room.id}</td>
                <td className="border px-4 py-2">
                  {room.images?.length > 0 ? (
                    <img
                      src={room.images[0].image_path}
                      alt={room.room_number}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-400">Chưa có ảnh</span>
                  )}
                </td>
                <td className="border px-4 py-2">{room.room_number}</td>
                <td className="border px-4 py-2">
                  {getRoomTypeDisplay(room.type)}
                </td>
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

      {lastPage > 1 && renderPagination()}
    </div>
  );
}
