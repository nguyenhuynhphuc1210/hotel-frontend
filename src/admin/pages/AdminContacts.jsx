import { useEffect, useState } from "react";
import { apiAdmin } from "../../api/axios";
import { toast } from "react-toastify";

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  // Lấy danh sách tin nhắn
  const fetchContacts = async () => {
    try {
      const response = await apiAdmin.get("/contacts");
      setContacts(response.data.data);
    } catch (error) {
      console.error("Lỗi khi tải tin nhắn:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Xóa tin nhắn
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa tin nhắn này không?")) return;
    try {
      await apiAdmin.delete(`/contacts/${id}`);
      setContacts(contacts.filter((c) => c.id !== id));
      toast.success("Xóa thành công!");
    } catch (error) {
      console.error(error);
      toast.error("Xóa thất bại!");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Đang tải tin nhắn...</p>
      </div>
    );

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        💌 Quản lý tin nhắn liên hệ
      </h1>

      {contacts.length === 0 ? (
        <p className="text-gray-600">Hiện chưa có tin nhắn nào.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
          <table className="w-full border-collapse">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">Họ tên</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Điện thoại</th>
                <th className="p-3 text-left">Thời gian</th>
                <th className="p-3 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr
                  key={c.id}
                  className="border-b hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => setSelected(c)}
                >
                  <td className="p-3">{c.name}</td>
                  <td className="p-3">{c.email}</td>
                  <td className="p-3">{c.phone || "—"}</td>
                  <td className="p-3">
                    {new Date(c.created_at).toLocaleString("vi-VN")}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(c.id);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal xem chi tiết */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
            >
              ✖
            </button>

            <h2 className="text-xl font-bold text-blue-700 mb-3">
              📩 Chi tiết tin nhắn
            </h2>
            <p>
              <strong>👤 Họ tên:</strong> {selected.name}
            </p>
            <p>
              <strong>📧 Email:</strong> {selected.email}
            </p>
            {selected.phone && (
              <p>
                <strong>📞 Điện thoại:</strong> {selected.phone}
              </p>
            )}
            <p className="mt-4 whitespace-pre-line border-t pt-3 text-gray-800">
              {selected.message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
