import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiAdmin } from "../../../api/axios";
import BookingForm from "./BookingForm";
import { toast } from "react-toastify";

export default function BookingAdd() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await apiAdmin.post("/bookings", data);
      toast.success("Thêm booking thành công!");
      navigate("/admin/bookings");
    } catch (err) {
      console.error(err);
      toast.error("Thêm booking thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Thêm Booking</h2>
      <BookingForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
