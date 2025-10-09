import { useNavigate } from "react-router-dom";
import { apiAdmin } from "../../api/axios";

export default function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("admin_user"));
  const token = localStorage.getItem("admin_token");

  const handleLogout = async () => {
    try {
      if (token) {
        await apiAdmin.post(
          "/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      navigate("/admin/login");
    }
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-gray-900 text-white shadow-md">
      {/* Logo nhỏ gọn (bỏ chữ đi) */}
      <div></div>

      {/* Thông tin user + logout */}
      <div className="flex items-center gap-4">
        {user && <span className="text-sm text-gray-300">👤 {user.fullname}</span>}
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Đăng xuất
        </button>
      </div>
    </header>
  );
}
