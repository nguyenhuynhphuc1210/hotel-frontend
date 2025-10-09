import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiAdmin } from "../../../api/axios";
import ServiceForm from "./ServiceForm";
import { toast } from "react-toastify";

export default function ServiceAdd() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await apiAdmin.post("/services", data);
      toast.success("Thêm dịch vụ thành công!");
      navigate("/admin/services");
    } catch (err) {
      console.error(err);
      toast.error("Thêm dịch vụ thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Thêm dịch vụ</h2>
      <ServiceForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
