import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CustomerForm({ initialData = {}, onSubmit, isSubmitting }) {
  const [fullname, setFullname] = useState(initialData.fullname || "");
  const [phone, setPhone] = useState(initialData.phone || "");
  const [email, setEmail] = useState(initialData.email || "");
  const [cccd, setCccd] = useState(initialData.cccd || "");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ fullname, phone, email, cccd });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded p-4 space-y-4">
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
        <label>SĐT</label>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div>
        <label>Email</label>
        <input
          type="email"
          className="w-full border px-3 py-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label>CCCD</label>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded"
          value={cccd}
          onChange={(e) => setCccd(e.target.value)}
          required
        />
      </div>

            <div className="flex space-x-3">
        <button
          type="button"
          onClick={() => navigate("/admin/customers")}
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
