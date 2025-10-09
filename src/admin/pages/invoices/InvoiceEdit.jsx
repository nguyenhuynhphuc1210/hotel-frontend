import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiAdmin } from "../../../api/axios";
import InvoiceForm from "./InvoiceForm";
import { toast } from "react-toastify";

export default function InvoiceEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiAdmin.get(`/invoices/${id}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      await apiAdmin.put(`/invoices/${id}`, formData);
      toast.success("Cập nhật thành công!");
      navigate("/admin/invoices");
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Sửa hóa đơn</h2>
      {data ? (
        <InvoiceForm
          initialData={data}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      ) : (
        <p>Đang tải dữ liệu...</p>
      )}
    </div>
  );
}
