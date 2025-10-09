import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiAdmin } from "../../../api/axios";
import CustomerForm from "./CustomerForm";
import { toast } from "react-toastify";

export default function CustomerAdd() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await apiAdmin.post("/customers", data);
      toast.success("Thêm khách hàng thành công!");
      navigate("/admin/customers");
    } catch (err) {
      console.error(err);
      toast.error("Thêm thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Thêm khách hàng</h2>
      <CustomerForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
