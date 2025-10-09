import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserForm({ initialData = {}, onSubmit, isSubmitting }) {
  const [fullname, setFullname] = useState(initialData.fullname || "");
  const [email, setEmail] = useState(initialData.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState(initialData.role ?? 2);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Nếu đang thêm mới thì check xác nhận mật khẩu
    if (!initialData.id && password !== confirmPassword) {
      alert("Mật khẩu và xác nhận mật khẩu không khớp!");
      return;
    }

    const payload = {
      fullname,
      email,
      role,
      password: password ? password : null,
    };

    onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow rounded p-4 space-y-4"
    >
      <div>
        <label>Họ tên</label>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Email</label>
        <input
          type="email"
          className="w-full border px-3 py-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label>{initialData.id ? "Mật khẩu mới" : "Mật khẩu"}</label>
        <input
          type="password"
          className="w-full border px-3 py-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={initialData.id ? "Để trống nếu không đổi" : ""}
          {...(!initialData.id && { required: true })}
        />
      </div>

      {/* Khi thêm mới thì hiển thị ô xác nhận mật khẩu */}
      {!initialData.id && (
        <div>
          <label>Xác nhận mật khẩu</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
      )}

      <div>
        <label>Vai trò</label>
        <select
          className="w-full border px-3 py-2 rounded"
          value={role}
          onChange={(e) => setRole(Number(e.target.value))}
        >
          <option value={0}>Admin</option>
          <option value={1}>Staff</option>
          <option value={2}>Customer</option>
        </select>
      </div>

      <div className="flex space-x-3">
        <button
          type="button"
          onClick={() => navigate("/admin/users")}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Trở về
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Đang lưu..." : "Lưu"}
        </button>
      </div>
    </form>
  );
}
