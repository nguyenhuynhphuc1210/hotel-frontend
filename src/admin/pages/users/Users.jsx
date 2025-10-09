import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiAdmin } from "../../../api/axios";
import { toast } from "react-toastify";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const user = JSON.parse(localStorage.getItem("admin_user"));

  // 🟢 Fetch users có phân trang
  const fetchUsers = async (page = 1) => {
    try {
      const res = await apiAdmin.get(`/users?page=${page}`);
      setUsers(res.data.data);
      setCurrentPage(res.data.current_page);
      setLastPage(res.data.last_page);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách người dùng!");
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  // 🟢 Hiển thị vai trò
  const renderRole = (role) => {
    switch (role) {
      case 0:
        return <span className="px-2 py-1 rounded bg-red-500 text-white">Admin</span>;
      case 1:
        return <span className="px-2 py-1 rounded bg-green-500 text-white">Staff</span>;
      case 2:
        return <span className="px-2 py-1 rounded bg-blue-500 text-white">Customer</span>;
      default:
        return <span className="px-2 py-1 rounded bg-gray-500 text-white">Unknown</span>;
    }
  };

  // 🟢 Xóa người dùng
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) return;
    try {
      await apiAdmin.delete(`/users/${id}`);
      toast.success("Xóa người dùng thành công");
      fetchUsers(currentPage); // reload lại trang hiện tại
    } catch (err) {
      console.error(err);
      toast.error("Xóa thất bại, vui lòng thử lại");
    }
  };

  // 🟢 Chặn nếu không phải admin
  if (user?.role !== 0) {
    return (
      <div className="text-red-600 font-bold text-xl">
        Bạn không có quyền truy cập trang này
      </div>
    );
  }

  // 🟢 Chuyển trang
  const handlePageChange = (page) => {
    if (page >= 1 && page <= lastPage && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  // 🟢 Tạo danh sách số trang
  const renderPagination = () => {
    const pages = [];
    const maxVisible = 5; // số trang hiển thị tối đa
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
      <h2 className="text-2xl font-bold mb-4">Quản lý người dùng</h2>

      <Link
        to="/admin/users/add"
        className="inline-block mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + Thêm người dùng
      </Link>

      <div className="mb-2 text-gray-600">
        Tổng cộng: <strong>{total}</strong> người dùng
      </div>

      <table className="w-full border-collapse bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Họ tên</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Vai trò</th>
            <th className="border px-4 py-2">Ngày tạo</th>
            <th className="border px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((u) => (
              <tr key={u.id}>
                <td className="border px-4 py-2">{u.id}</td>
                <td className="border px-4 py-2">{u.fullname}</td>
                <td className="border px-4 py-2">{u.email}</td>
                <td className="border px-4 py-2">{renderRole(u.role)}</td>
                <td className="border px-4 py-2">
                  {new Date(u.created_at).toLocaleDateString("vi-VN")}
                </td>
                <td className="border px-4 py-2 space-x-2">
                  <Link
                    to={`/admin/users/edit/${u.id}`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Sửa
                  </Link>
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="border px-4 py-2 text-center text-gray-500" colSpan="6">
                Không có người dùng nào
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 🟢 Hiển thị phân trang có số trang */}
      {lastPage > 1 && renderPagination()}
    </div>
  );
}
