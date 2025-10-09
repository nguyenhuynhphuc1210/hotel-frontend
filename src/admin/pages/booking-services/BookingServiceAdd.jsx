import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiAdmin } from "../../../api/axios";
import BookingServiceForm from "./BookingServiceForm";
import { toast } from "react-toastify";

export default function BookingServiceAdd() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await apiAdmin.post("/booking-services", data);
      toast.success("Thêm dịch vụ vào booking thành công!");
      navigate("/admin/booking-services");
    } catch (err) {
      console.error(err);
      toast.error("Thêm thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Thêm dịch vụ vào Booking</h2>
      <BookingServiceForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
