import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiAdmin } from "../../../api/axios";
import InvoiceForm from "./InvoiceForm";
import { toast } from "react-toastify";

export default function InvoiceAdd() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await apiAdmin.post("/invoices", data);
      toast.success("Thêm hóa đơn thành công!");
      navigate("/admin/invoices");
    } catch (err) {
      console.error(err);
      toast.error("Thêm thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Thêm hóa đơn</h2>
      <InvoiceForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
