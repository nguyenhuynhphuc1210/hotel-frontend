import { useState } from "react";
import { toast } from "react-toastify";
import { apiClient } from "../../api/axios";

export default function ChangePassword() {
  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra phía client
    if (form.new_password !== form.confirm_password) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.patch("/change-password", form);
      toast.success(res.data.message || "Đổi mật khẩu thành công!");
      setForm({ old_password: "", new_password: "", confirm_password: "" });
    } catch (err) {
      console.log("Change password error:", err.response);
      if (err.response?.status === 422) {
        const errors = err.response.data.errors;
        if (errors) {
          Object.values(errors).forEach((msgArr) => toast.error(msgArr[0]));
        } else {
          toast.error(err.response.data.message || "Lỗi xác thực!");
        }
      } else {
        toast.error("Đổi mật khẩu thất bại! Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-xl p-6 mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
        🔒 Đổi mật khẩu
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Mật khẩu cũ</label>
          <input
            type="password"
            name="old_password"
            value={form.old_password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mật khẩu mới</label>
          <input
            type="password"
            name="new_password"
            value={form.new_password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Xác nhận mật khẩu
          </label>
          <input
            type="password"
            name="confirm_password"
            value={form.confirm_password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 outline-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
        </button>
      </form>
    </div>
  );
}
