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
  const [searchQuery, setSearchQuery] = useState("");
  const [allRooms, setAllRooms] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();

  // ================== FETCH PAGINATED ROOMS ==================
  const fetchPaginatedRooms = async (page = 1) => {
    try {
      const res = await apiClient.get(`/rooms?status=available&page=${page}`);
      setCurrentPage(res.data.current_page || 1);
      setLastPage(res.data.last_page || 1);
      return Array.isArray(res.data.data) ? res.data.data : [];
    } catch (err) {
      console.error("Fetch paginated rooms error:", err);
      return [];
    }
  };

  // ================== FETCH ALL AVAILABLE ROOMS ==================
  const fetchAllAvailableRooms = async () => {
    try {
      const res = await apiClient.get("/rooms?status=available&all=true");
      setAllRooms(Array.isArray(res.data) ? res.data : []);
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      console.error("Fetch all available rooms error:", err);
      setAllRooms([]);
      return [];
    }
  };

  // ================== FETCH ALL ROOM TYPES ==================
  const fetchAllRoomTypes = async () => {
    try {
      const res = await apiClient.get("/rooms?all=true");
      const types = [...new Set(res.data.map((r) => r.type))];
      setAllRoomTypes(types);
    } catch (err) {
      console.error("Fetch all room types error:", err);
    }
  };

  // ================== HANDLE FILTER ==================
  const handleFilterType = async (type) => {
    setFilterType(type);
    setCurrentPage(1);
    setSearchQuery("");
    setLoading(true);

    try {
      if (type === "all") {
        setRooms(await fetchPaginatedRooms(1));
      } else {
        const res = await apiClient.get(
          `/rooms?status=available&type=${type}&page=1`
        );
        setRooms(Array.isArray(res.data.data) ? res.data.data : []);
        setCurrentPage(res.data.current_page || 1);
        setLastPage(res.data.last_page || 1);
      }
    } catch (err) {
      console.error("Fetch by type error:", err);
      setRooms([]);
      setCurrentPage(1);
      setLastPage(1);
    } finally {
      setLoading(false);
    }
  };

  const removeVietnameseTones = (str) => {
    return str
      .normalize("NFD") // tách ký tự + dấu
      .replace(/[\u0300-\u036f]/g, "") // loại bỏ các dấu
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  const getDisplayRooms = () => {
    if (searchQuery.trim()) {
      const query = removeVietnameseTones(searchQuery.toLowerCase().trim());

      const typeMap = {
        "phong don": "single",
        "phong doi": "double",
        "phong vip": "suite",
      };

      const searchedRooms = allRooms.filter((room) => {
        const roomNum = removeVietnameseTones(
          String(room.room_number).toLowerCase()
        );
        const roomType = removeVietnameseTones(
          room.type ? String(room.type).toLowerCase() : ""
        );
        const fullRoomName = removeVietnameseTones(`phòng ${roomNum}`);

        const mappedType = typeMap[query];

        return (
          fullRoomName.includes(query) ||
          roomNum.includes(query) ||
          (mappedType ? roomType === mappedType : false)
        );
      });

      const sorted = [...searchedRooms].sort((a, b) => {
        if (sortBy === "price-asc") return Number(a.price) - Number(b.price);
        if (sortBy === "price-desc") return Number(b.price) - Number(a.price);
        if (sortBy === "name")
          return a.room_number.localeCompare(b.room_number);
        return 0;
      });

      return sorted;
    }

    const sorted = [...rooms].sort((a, b) => {
      if (sortBy === "price-asc") return Number(a.price) - Number(b.price);
      if (sortBy === "price-desc") return Number(b.price) - Number(a.price);
      if (sortBy === "name") return a.room_number.localeCompare(b.room_number);
      return 0;
    });

    return sorted;
  };

  const sortedRooms = getDisplayRooms();
  const isSearching = searchQuery.trim() !== "";

  const getTypeLabel = (type) => {
    switch (type) {
      case "single":
        return "Phòng Đơn";
      case "double":
        return "Phòng Đôi";
      case "suite":
        return "Phòng VIP";
      default:
        return type;
    }
  };

  // ================== INITIAL LOAD ==================
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchAllAvailableRooms();
      const paginatedRooms = await fetchPaginatedRooms(1);
      setRooms(paginatedRooms);
      fetchAllRoomTypes();
      setLoading(false);
    };
    init();
  }, []);

  const handlePageChange = async (page) => {
    setLoading(true);
    try {
      let res;
      if (filterType === "all") {
        res = await apiClient.get(`/rooms?status=available&page=${page}`);
      } else {
        res = await apiClient.get(
          `/rooms?status=available&type=${filterType}&page=${page}`
        );
      }
      const roomsData = Array.isArray(res.data.data) ? res.data.data : [];
      setRooms(roomsData);
      setCurrentPage(res.data.current_page || page);
      setLastPage(res.data.last_page || 1);
    } catch (err) {
      console.error("Fetch rooms error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================== LOADING UI ==================
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

  // ================== RENDER ==================
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
        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="relative flex gap-2">
            <input
              type="text"
              placeholder="Nhập tìm kiếm"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSearchQuery(inputValue);
                  setCurrentPage(1);
                }
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />

            <button
              onClick={() => {
                setSearchQuery(inputValue);
                setCurrentPage(1);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Filter & Sort */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
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

        {/* Room list */}
        {sortedRooms.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🏨</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Không tìm thấy phòng phù hợp
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery
                ? `Không có phòng nào khớp với tìm kiếm "${searchQuery}"`
                : "Hiện tại không có phòng trống với bộ lọc đã chọn"}
            </p>
            <button
              onClick={() => {
                handleFilterType("all");
                setSearchQuery("");
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Xem tất cả phòng
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Tìm thấy{" "}
              <span className="font-semibold text-gray-900">
                {sortedRooms.length}
              </span>{" "}
              phòng
              {isSearching && ` (tìm kiếm: "${searchQuery}")`}
            </div>

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
                        src={room.images[0].image_path}
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
                      <span className="text-gray-500 text-sm">/ Đêm</span>
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

            {/* Pagination - chỉ hiển thị khi không search */}
            {/* Pagination - hiển thị khi không search và lastPage > 1 */}
            {!isSearching && lastPage > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                {/* Nút Previous */}
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  &lt;
                </button>

                {/* Hiển thị giới hạn số trang */}
                {(() => {
                  const pages = [];
                  const maxVisible = 5; // Số nút hiển thị tối đa
                  let start = Math.max(
                    1,
                    currentPage - Math.floor(maxVisible / 2)
                  );
                  let end = Math.min(lastPage, start + maxVisible - 1);

                  if (end - start < maxVisible - 1) {
                    start = Math.max(1, end - maxVisible + 1);
                  }

                  if (start > 1) {
                    pages.push(
                      <button
                        key={1}
                        onClick={() => handlePageChange(1)}
                        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                      >
                        1
                      </button>
                    );
                    if (start > 2)
                      pages.push(<span key="start-ellipsis">...</span>);
                  }

                  for (let page = start; page <= end; page++) {
                    pages.push(
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-lg ${
                          page === currentPage
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  }

                  if (end < lastPage) {
                    if (end < lastPage - 1)
                      pages.push(<span key="end-ellipsis">...</span>);
                    pages.push(
                      <button
                        key={lastPage}
                        onClick={() => handlePageChange(lastPage)}
                        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                      >
                        {lastPage}
                      </button>
                    );
                  }

                  return pages;
                })()}

                {/* Nút Next */}
                <button
                  disabled={currentPage === lastPage}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === lastPage
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  &gt;
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
