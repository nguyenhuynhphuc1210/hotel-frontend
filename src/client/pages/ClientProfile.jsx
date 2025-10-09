import { useState, useEffect } from "react";
import { apiClient } from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function ClientProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("client_user") || "null")
  );

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        fullname: user.fullname || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("client_token");
      const response = await apiClient.patch(
        `/users/${user.id}/update-profile`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Cập nhật lại thông tin trong localStorage
      const updatedUser = response.data.user;
      localStorage.setItem("client_user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setMessage("✅ Cập nhật hồ sơ thành công!");
    } catch (error) {
      console.error(error);
      setMessage(
        "❌ Lỗi khi cập nhật hồ sơ: " +
          (error.response?.data?.message || "Đã xảy ra lỗi")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
        🧍 Hồ sơ cá nhân
      </h2>

      {message && (
        <p
          className={`mb-4 text-center ${
            message.startsWith("✅") ? "text-green-600" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Họ và tên
          </label>
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Đang lưu..." : "💾 Lưu thay đổi"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/client/change-password")}
            className="bg-yellow-400 text-blue-900 px-5 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition"
          >
            🔒 Đổi mật khẩu
          </button>
        </div>
      </form>
    </div>
  );
}
