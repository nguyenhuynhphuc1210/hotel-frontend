import { useEffect, useState } from "react";
import { apiClient } from "../../api/axios";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // 🟢 Lấy danh sách dịch vụ có phân trang
  useEffect(() => {
    setLoading(true);
    apiClient
      .get(`/services?page=${currentPage}`)
      .then((res) => {
        setServices(res.data.data);
        setCurrentPage(res.data.current_page);
        setLastPage(res.data.last_page);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [currentPage]);

  // 🧩 Icon hiển thị theo dịch vụ
  const getServiceIcon = (serviceName) => {
    const name = serviceName.toLowerCase();
    if (name.includes("spa") || name.includes("massage")) return "💆";
    if (name.includes("gym") || name.includes("fitness")) return "🏋️";
    if (name.includes("pool") || name.includes("bể bơi") || name.includes("hồ bơi")) return "🏊";
    if (name.includes("ăn") || name.includes("bữa") || name.includes("food") || name.includes("bar")) return "🍽️";
    if (name.includes("giặt")) return "🧺";
    if (name.includes("taxi") || name.includes("xe") || name.includes("đưa đón")) return "🚗";
    if (name.includes("wifi") || name.includes("internet")) return "📶";
    if (name.includes("phòng")) return "🛎️";
    if (name.includes("parking") || name.includes("đỗ xe")) return "🅿️";
    return "✨";
  };

  // 🏷️ Danh mục dịch vụ tiếng Việt
  const categories = [
    { key: "all", label: "Tất cả dịch vụ" },
    { key: "F&B", label: "Ẩm thực (F&B)" },
    { key: "Wellness", label: "Sức khỏe & Giải trí" },
    { key: "Transportation", label: "Di chuyển" },
    { key: "Laundry", label: "Giặt ủi" },
    { key: "Other", label: "Khác" },
  ];

  // 🧠 Phân loại tự động theo tên dịch vụ
  const getCategoryFromService = (service) => {
    const name = service.service_name.toLowerCase();

    if (name.includes("ăn") || name.includes("bữa") || name.includes("food") || name.includes("bar"))
      return "Ẩm thực (F&B)";
    if (name.includes("spa") || name.includes("massage") || name.includes("gym") || name.includes("hồ bơi") || name.includes("pool"))
      return "Sức khỏe & Giải trí";
    if (name.includes("xe") || name.includes("taxi") || name.includes("đưa đón"))
      return "Di chuyển";
    if (name.includes("giặt"))
      return "Giặt ủi";
    return "Khác";
  };

  const filteredServices =
    selectedCategory === "all"
      ? services
      : services.filter(
          (s) => getCategoryFromService(s).includes(categories.find((c) => c.key === selectedCategory)?.label)
        );

  // 🟢 Phân trang
  const handlePageChange = (page) => {
    if (page >= 1 && page <= lastPage && page !== currentPage) {
      setCurrentPage(page);
    }
  };

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
      <div className="flex justify-center items-center mt-8 space-x-2">
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

  // 🟡 Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dịch vụ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Dịch vụ khách sạn cao cấp
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Trải nghiệm các dịch vụ đẳng cấp để làm cho kỳ nghỉ của bạn trở nên hoàn hảo
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Bộ lọc danh mục */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === cat.key
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Danh sách dịch vụ */}
        {filteredServices.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Không tìm thấy dịch vụ
            </h3>
            <p className="text-gray-600">
              Không có dịch vụ nào trong danh mục này
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group relative"
                >
                  {/* Icon Header */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 flex items-center justify-center group-hover:from-blue-100 group-hover:to-purple-100 transition-colors">
                    <div className="text-6xl transform group-hover:scale-110 transition-transform duration-300">
                      {getServiceIcon(service.service_name)}
                    </div>
                  </div>

                  {/* Service Info */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
                      {service.service_name}
                    </h3>

                    {service.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {service.description}
                      </p>
                    )}

                    {/* Price */}
                    <div className="flex items-baseline justify-between pt-4 border-t border-gray-100">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          {service.price.toLocaleString("vi-VN")}₫
                        </div>
                        <div className="text-xs text-gray-500">
                          {service.unit || "theo lần"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                      {getCategoryFromService(service)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {lastPage > 1 && renderPagination()}
          </>
        )}
      </div>
    </div>
  );
}
