import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RoomForm({ initialData = null, onSubmit, isSubmitting }) {
  const [roomNumber, setRoomNumber] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("available");

  const [oldImages, setOldImages] = useState([]); // Ảnh cũ từ backend
  const [deletedImages, setDeletedImages] = useState([]); // ID ảnh cũ bị xóa

  const [newImages, setNewImages] = useState([]); // File ảnh mới
  const [previewImages, setPreviewImages] = useState([]); // URL preview ảnh mới

  const navigate = useNavigate();

  // ✅ Load dữ liệu edit
  useEffect(() => {
    if (initialData) {
      setRoomNumber(initialData.room_number || "");
      setType(initialData.type || "");
      setPrice(initialData.price || "");
      setStatus(initialData.status || "available");
      setOldImages(initialData.images || []);
    }
  }, [initialData]);

  // ✅ Xóa ảnh cũ
  const handleDeleteOldImage = (id) => {
    setOldImages((prev) => prev.filter((img) => img.id !== id));
    setDeletedImages((prev) => [...prev, id]);
  };

  // ✅ Chọn ảnh mới
  const handleNewImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));

    setNewImages((prev) => [...prev, ...files]);
    setPreviewImages((prev) => [...prev, ...previews]);
  };

  // ✅ Xóa ảnh mới chưa upload
  const handleDeleteNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("room_number", roomNumber);
    formData.append("type", type);
    formData.append("price", price);
    formData.append("status", status);

    // Thêm ảnh mới
    newImages.forEach((img) => {
      if (!initialData?.id) {
        formData.append("images[]", img);
      } else {
        formData.append("new_images[]", img);
      }
    });

    // Xóa ảnh cũ
    deletedImages.forEach((id) => formData.append("deleted_images[]", id));

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data" className="bg-white p-4 shadow rounded space-y-4">
      <div>
        <label className="block mb-1 font-medium">Số phòng</label>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded"
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Loại phòng</label>
        <select className="w-full border px-3 py-2 rounded" value={type} onChange={(e) => setType(e.target.value)} required>
          <option value="">Chọn loại phòng</option>
          <option value="single">Phòng đơn</option>
          <option value="double">Phòng đôi</option>
          <option value="suite">Phòng VIP</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Giá (VNĐ)</label>
        <input
          type="number"
          min="0"
          className="w-full border px-3 py-2 rounded"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Trạng thái</label>
        <select className="w-full border px-3 py-2 rounded" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="available">Còn trống</option>
          <option value="booked">Đã đặt</option>
          <option value="cleaning">Đang dọn</option>
        </select>
      </div>

      {/* Ảnh cũ */}
      {oldImages.length > 0 && (
        <div>
          <label className="block mb-1 font-medium">Ảnh hiện có</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {oldImages.map((img) => (
              <div key={img.id} className="relative group">
                <img src={img.image_path} alt="Room" className="w-24 h-24 object-cover rounded border" />
                <button
                  type="button"
                  onClick={() => handleDeleteOldImage(img.id)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1 rounded opacity-80 group-hover:opacity-100"
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload ảnh mới */}
      <div>
        <label className="block mb-1 font-medium">Thêm ảnh mới</label>
        <input type="file" multiple accept="image/*" className="w-full border px-3 py-2 rounded" onChange={handleNewImagesChange} />
      </div>

      {/* Preview ảnh mới */}
      {previewImages.length > 0 && (
        <div>
          <label className="block mb-1 font-medium">Ảnh xem trước</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {previewImages.map((src, index) => (
              <div key={index} className="relative group">
                <img src={src} alt={`Preview ${index + 1}`} className="w-24 h-24 object-cover rounded border" />
                <button
                  type="button"
                  onClick={() => handleDeleteNewImage(index)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1 rounded opacity-80 group-hover:opacity-100"
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nút hành động */}
      <div className="flex space-x-3">
        <button type="button" onClick={() => navigate("/admin/rooms")} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          Trở về
        </button>
        <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
          {isSubmitting ? "Đang lưu..." : "Lưu"}
        </button>
      </div>
    </form>
  );
}
