import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiClient } from "../../api/axios";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [allRoomTypes, setAllRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("price-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const navigate = useNavigate();

  const fetchRooms = async (page = 1) => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/rooms?status=available&page=${page}`);
      setRooms(res.data.data);
      setCurrentPage(res.data.current_page);
      setLastPage(res.data.last_page);
    } catch (err) {
      console.error("Fetch rooms error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllRoomTypes = async () => {
    try {
      const res = await apiClient.get("/rooms?all=true");
      const types = [...new Set(res.data.map((r) => r.type))];
      setAllRoomTypes(types);
    } catch (err) {
      console.error("Fetch all room types error:", err);
    }
  };

  useEffect(() => {
    fetchRooms(1);
    fetchAllRoomTypes();
  }, []);

  const handleFilterType = async (type) => {
    setFilterType(type);
    setLoading(true);

    if (type === "all") {
      await fetchRooms(1);
    } else {
      try {
        const res = await apiClient.get(`/rooms?type=${type}`);
        setRooms(res.data);
        setLastPage(1);
        setCurrentPage(1);
      } catch (err) {
        console.error("Fetch by type error:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const availableRooms = rooms.filter((room) => room.status === "available");

  // 🟢 Sắp xếp
  const sortedRooms = [...availableRooms].sort((a, b) => {
    if (sortBy === "price-asc") return Number(a.price) - Number(b.price);
    if (sortBy === "price-desc") return Number(b.price) - Number(a.price);
    if (sortBy === "name") return a.room_number.localeCompare(b.room_number);
    return 0;
  });

  // 🟢 Chuyển loại phòng sang tiếng Việt
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải danh sách phòng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Khám phá phòng nghỉ</h1>
          <p className="text-blue-100">
            Tìm phòng hoàn hảo cho kỳ nghỉ của bạn
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bộ lọc & sắp xếp */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Filter by Type */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-gray-700 font-medium">Loại phòng:</span>
              {["all", ...allRoomTypes].map((type) => (
                <button
                  key={type}
                  onClick={() => handleFilterType(type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    filterType === type
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {type === "all" ? "Tất cả" : getTypeLabel(type)}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-medium">Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="name">Tên phòng</option>
              </select>
            </div>
          </div>
        </div>

        {/* Danh sách phòng */}
        {sortedRooms.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🏨</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Không tìm thấy phòng phù hợp
            </h3>
            <p className="text-gray-600 mb-4">
              Hiện tại không có phòng trống với bộ lọc đã chọn
            </p>
            <button
              onClick={() => handleFilterType("all")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Xem tất cả phòng
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedRooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <Link
                    to={`/rooms/${room.id}`}
                    className="block relative overflow-hidden"
                  >
                    {room.images && room.images.length > 0 ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL}/storage/${
                          room.images[0].image_path
                        }`}
                        alt={room.room_number}
                        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-56 flex items-center justify-center bg-gray-100">
                        <p className="text-gray-400">Chưa có hình ảnh</p>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Còn trống
                    </div>
                  </Link>

                  <div className="p-5">
                    <div className="mb-3">
                      <Link
                        to={`/rooms/${room.id}`}
                        className="text-xl font-bold text-gray-900 hover:text-blue-600 transition"
                      >
                        Phòng {room.room_number}
                      </Link>
                      <div className="mt-1">
                        <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">
                          {getTypeLabel(room.type)}
                        </span>
                      </div>
                    </div>

                    <div className="border-t pt-4 mb-4">
                      <span className="text-2xl font-bold text-blue-600">
                        {Number(room.price).toLocaleString("vi-VN")}₫
                      </span>{" "}
                      <span className="text-gray-500 text-sm">/ đêm</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/rooms/${room.id}`)}
                        className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
                      >
                        Đặt phòng ngay
                      </button>
                      <Link
                        to={`/rooms/${room.id}`}
                        className="px-4 py-3 border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 text-gray-700 font-semibold rounded-lg transition-colors duration-200"
                      >
                        Chi tiết
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ✅ Phân trang */}
            {filterType === "all" && lastPage > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: lastPage }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => fetchRooms(page)}
                      className={`px-4 py-2 rounded-lg ${
                        page === currentPage
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
