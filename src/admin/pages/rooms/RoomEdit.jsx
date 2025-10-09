import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiAdmin } from "../../../api/axios";
import RoomForm from "./RoomForm";
import { toast } from "react-toastify";

export default function RoomEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await apiAdmin.get(`/rooms/${id}`);
        setRoomData(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu phòng:", err);
      }
    };
    fetchRoom();
  }, [id]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      await apiAdmin.post(`/rooms/${id}?_method=PUT`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Cập nhật phòng thành công!");
      navigate("/admin/rooms");
    } catch (err) {
      console.error("Lỗi khi cập nhật phòng:", err);
      toast.error("Cập nhật thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Sửa phòng</h2>
      {roomData ? (
        <RoomForm
          initialData={roomData}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      ) : (
        <p>Đang tải dữ liệu...</p>
      )}
    </div>
  );
}
