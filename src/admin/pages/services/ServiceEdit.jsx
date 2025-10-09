import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiAdmin } from "../../../api/axios";
import ServiceForm from "./ServiceForm";
import { toast } from "react-toastify";

export default function ServiceEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [serviceData, setServiceData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await apiAdmin.get(`/services/${id}`);
        setServiceData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchService();
  }, [id]);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await apiAdmin.put(`/services/${id}`, data);
      toast.success("Cập nhật dịch vụ thành công!");
      navigate("/admin/services");
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Sửa dịch vụ</h2>
      {serviceData ? (
        <ServiceForm initialData={serviceData} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      ) : (
        <p>Đang tải dữ liệu...</p>
      )}
    </div>
  );
}
