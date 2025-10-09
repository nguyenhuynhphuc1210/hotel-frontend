import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiAdmin } from "../../../api/axios";
import { toast } from "react-toastify";

export default function Services() {
  const [services, setServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  // 🟢 Fetch danh sách dịch vụ có phân trang
  const fetchServices = async (page = 1) => {
    try {
      const res = await apiAdmin.get(`/services?page=${page}`);
      setServices(res.data.data); // Laravel API resource
      setCurrentPage(res.data.current_page);
      setLastPage(res.data.last_page);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Lỗi khi tải dịch vụ:", err);
      toast.error("Không thể tải danh sách dịch vụ!");
    }
  };

  useEffect(() => {
    fetchServices(currentPage);
  }, [currentPage]);

  // 🟢 Xóa dịch vụ
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa dịch vụ này?")) return;
    try {
      await apiAdmin.delete(`/services/${id}`);
      toast.success("Xóa dịch vụ thành công");
      fetchServices(currentPage); // load lại trang hiện tại
    } catch (err) {
      console.error("Lỗi khi xóa dịch vụ:", err);
      toast.error("Xóa dịch vụ thất bại");
    }
  };

  // 🟢 Chuyển trang
  const handlePageChange = (page) => {
    if (page >= 1 && page <= lastPage && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  // 🟢 Render phân trang (hiển thị 1 2 3 ...)
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
      <h2 className="text-2xl font-bold mb-4">Quản lý dịch vụ</h2>

      <Link
        to="/admin/services/add"
        className="inline-block mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + Thêm dịch vụ
      </Link>

      <div className="mb-2 text-gray-600">
        Tổng cộng: <strong>{total}</strong> dịch vụ
      </div>

      <table className="w-full border-collapse bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Tên dịch vụ</th>
            <th className="border px-4 py-2">Giá</th>
            <th className="border px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {services.length > 0 ? (
            services.map((s) => (
              <tr key={s.id}>
                <td className="border px-4 py-2">{s.id}</td>
                <td className="border px-4 py-2">{s.service_name}</td>
                <td className="border px-4 py-2">
                  {Number(s.price).toLocaleString()} đ
                </td>
                <td className="border px-4 py-2 space-x-2">
                  <Link
                    to={`/admin/services/edit/${s.id}`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Sửa
                  </Link>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="border px-4 py-2 text-center text-gray-500">
                Không có dịch vụ nào
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Hiển thị phân trang */}
      {lastPage > 1 && renderPagination()}
    </div>
  );
}
