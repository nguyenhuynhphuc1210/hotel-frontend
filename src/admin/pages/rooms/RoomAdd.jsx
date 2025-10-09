import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiAdmin } from "../../../api/axios";
import RoomForm from "./RoomForm";
import { toast } from "react-toastify";

export default function RoomAdd() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      await apiAdmin.post("/rooms", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Thêm phòng thành công!");
      navigate("/admin/rooms");
    } catch (err) {
      console.error("Lỗi khi thêm phòng:", err);
      toast.error("Thêm phòng thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Thêm phòng</h2>
      <RoomForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
