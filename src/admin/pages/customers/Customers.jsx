import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiAdmin } from "../../../api/axios";
import { toast } from "react-toastify";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  // 🟢 Lấy danh sách khách hàng (phân trang)
  const fetchCustomers = async (page = 1) => {
    try {
      const res = await apiAdmin.get(`/customers?page=${page}`);
      setCustomers(res.data.data);
      setCurrentPage(res.data.current_page);
      setLastPage(res.data.last_page);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Lỗi khi tải khách hàng:", err);
      toast.error("Không thể tải danh sách khách hàng!");
    }
  };

  useEffect(() => {
    fetchCustomers(currentPage);
  }, [currentPage]);

  // 🟢 Xử lý xóa
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa khách hàng này?")) return;
    try {
      await apiAdmin.delete(`/customers/${id}`);
      toast.success("Xóa khách hàng thành công!");
      fetchCustomers(currentPage);
    } catch (err) {
      console.error(err);
      toast.error("Xóa khách hàng thất bại!");
    }
  };

  // 🟢 Chuyển trang
  const handlePageChange = (page) => {
    if (page >= 1 && page <= lastPage && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  // 🟢 Hiển thị nút phân trang (1, 2, 3,…)
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
      <h2 className="text-2xl font-bold mb-4">Quản lý khách hàng</h2>

      <Link
        to="add"
        className="inline-block mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + Thêm khách hàng
      </Link>

      <div className="mb-2 text-gray-600">
        Tổng cộng: <strong>{total}</strong> khách hàng
      </div>

      <table className="w-full border-collapse bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Họ tên</th>
            <th className="border px-4 py-2">SĐT</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">CCCD</th>
            <th className="border px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {customers.length > 0 ? (
            customers.map((c) => (
              <tr key={c.id}>
                <td className="border px-4 py-2">{c.id}</td>
                <td className="border px-4 py-2">{c.fullname}</td>
                <td className="border px-4 py-2">{c.phone || "-"}</td>
                <td className="border px-4 py-2">{c.email || "-"}</td>
                <td className="border px-4 py-2">{c.cccd}</td>
                <td className="border px-4 py-2 space-x-2">
                  <Link
                    to={`/admin/customers/edit/${c.id}`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Sửa
                  </Link>
                  <button
                    onClick={() => handleDelete(c.id)}
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
                colSpan="6"
                className="border px-4 py-2 text-center text-gray-500"
              >
                Không có khách hàng nào
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Phân trang */}
      {lastPage > 1 && renderPagination()}
    </div>
  );
}
