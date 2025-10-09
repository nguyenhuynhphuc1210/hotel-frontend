import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiAdmin } from "../../../api/axios";
import { toast } from "react-toastify";

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchInvoices = async (page = 1) => {
    try {
      const res = await apiAdmin.get(`/invoices?page=${page}`);
      setInvoices(res.data.data);
      setCurrentPage(res.data.current_page);
      setLastPage(res.data.last_page);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
      toast.error("Lấy danh sách hóa đơn thất bại!");
    }
  };

  useEffect(() => {
    fetchInvoices(currentPage);
  }, [currentPage]);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa hóa đơn này?")) return;

    try {
      await apiAdmin.delete(`/invoices/${id}`);
      toast.success("Xóa hóa đơn thành công!");
      fetchInvoices(currentPage);
    } catch (err) {
      console.error(err);
      toast.error("Xóa thất bại!");
    }
  };

  const handleConfirmPayment = async (id) => {
    if (!window.confirm("Xác nhận khách đã thanh toán đủ tiền?")) return;

    try {
      const res = await apiAdmin.patch(`/invoices/${id}/pay`);
      toast.success("✅ Thanh toán thành công!");
      setInvoices((prev) =>
        prev.map((inv) => (inv.id === id ? res.data : inv))
      );
    } catch (err) {
      console.error(err);
      toast.error("❌ Xác nhận thất bại!");
    }
  };

  const formatCurrency = (amount) =>
    Number(amount || 0).toLocaleString("vi-VN") + " đ";

  // 🟢 Chuyển trang
  const handlePageChange = (page) => {
    if (page >= 1 && page <= lastPage && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  // 🟢 Hiển thị phân trang giống Users.jsx
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
      <h2 className="text-2xl font-bold mb-4">Quản lý Hóa đơn</h2>

      <Link
        to="/admin/invoices/add"
        className="inline-block mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + Thêm hóa đơn
      </Link>

      <div className="mb-2 text-gray-600">
        Tổng cộng: <strong>{total}</strong> hóa đơn
      </div>

      <table className="w-full border-collapse bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Booking</th>
            <th className="border px-4 py-2">Tổng tiền</th>
            <th className="border px-4 py-2">Đã cọc</th>
            <th className="border px-4 py-2">Cần thanh toán</th>
            <th className="border px-4 py-2">Ngày thanh toán</th>
            <th className="border px-4 py-2">Trạng thái</th>
            <th className="border px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {invoices.length === 0 ? (
            <tr>
              <td
                colSpan="8"
                className="border px-4 py-2 text-center text-gray-500"
              >
                Chưa có hóa đơn
              </td>
            </tr>
          ) : (
            invoices.map((inv) => {
              const booking = inv.booking;
              const deposit = Number(booking?.deposit_amount || 0);
              const remain =
                inv.status === "paid" || booking?.status === "cancelled"
                  ? 0
                  : Number(inv.total_amount) - deposit;

              let statusText = "Chưa thanh toán";
              let statusClass = "text-yellow-600";

              if (booking?.status === "cancelled") {
                statusText = "Đã hủy";
                statusClass = "text-gray-500";
              } else if (inv.status === "paid") {
                statusText = "Đã thanh toán";
                statusClass = "text-green-700";
              }

              return (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{inv.id}</td>
                  <td className="border px-4 py-2">{inv.booking_id}</td>
                  <td className="border px-4 py-2">
                    {formatCurrency(inv.total_amount)}
                  </td>
                  <td className="border px-4 py-2 text-blue-600 font-semibold">
                    {formatCurrency(deposit)}
                  </td>
                  <td className="border px-4 py-2 text-red-600 font-semibold">
                    {formatCurrency(remain)}
                  </td>
                  <td className="border px-4 py-2">
                    {inv.payment_date
                      ? new Date(inv.payment_date).toLocaleDateString("vi-VN")
                      : "Chưa thanh toán"}
                  </td>
                  <td
                    className={`border px-4 py-2 font-semibold ${statusClass}`}
                  >
                    {statusText}
                  </td>
                  <td className="border px-4 py-2 space-x-2">
                    <Link
                      to={`/admin/invoices/edit/${inv.id}`}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Sửa
                    </Link>

                    <button
                      onClick={() => handleDelete(inv.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Xóa
                    </button>

                    {remain > 0 &&
                      booking?.status !== "cancelled" &&
                      inv.status !== "paid" && (
                        <button
                          onClick={() => handleConfirmPayment(inv.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Xác nhận thanh toán
                        </button>
                      )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {lastPage > 1 && renderPagination()}
    </div>
  );
}
