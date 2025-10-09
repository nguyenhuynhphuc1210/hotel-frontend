import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiAdmin } from "../../../api/axios";
import BookingForm from "./BookingForm";
import { toast } from "react-toastify";

export default function BookingEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await apiAdmin.get(`/bookings/${id}`);
        setBookingData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBooking();
  }, [id]);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await apiAdmin.put(`/bookings/${id}`, data);
      toast.success("Cập nhật booking thành công!");
      navigate("/admin/bookings");
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Sửa Booking</h2>
      {bookingData ? (
        <BookingForm initialData={bookingData} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      ) : (
        <p>Đang tải dữ liệu...</p>
      )}
    </div>
  );
}
