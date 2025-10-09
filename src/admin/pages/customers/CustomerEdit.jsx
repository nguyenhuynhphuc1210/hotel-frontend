import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiAdmin } from "../../../api/axios";
import CustomerForm from "./CustomerForm";
import { toast } from "react-toastify";

export default function CustomerEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await apiAdmin.get(`/customers/${id}`);
        setCustomerData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCustomer();
  }, [id]);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await apiAdmin.put(`/customers/${id}`, data);
      toast.success("Cập nhật khách hàng thành công!");
      navigate("/admin/customers");
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Sửa khách hàng</h2>
      {customerData ? (
        <CustomerForm initialData={customerData} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      ) : (
        <p>Đang tải dữ liệu...</p>
      )}
    </div>
  );
}
