import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ServiceForm({ initialData = {}, onSubmit, isSubmitting }) {
  const [serviceName, setServiceName] = useState(initialData.service_name || "");
  const [price, setPrice] = useState(initialData.price || "");

  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ service_name: serviceName, price });
  };

  return (
    <form className="bg-white shadow rounded p-4 space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-gray-700">Tên dịch vụ</label>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-gray-700">Giá</label>
        <input
          type="number"
          className="w-full px-3 py-2 border rounded"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>

            <div className="flex space-x-3">
        <button
          type="button"
          onClick={() => navigate("/admin/services")}
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
