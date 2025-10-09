import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiAdmin } from "../../../api/axios";
import UserForm from "./UserForm";
import { toast } from "react-toastify";

export default function UserAdd() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await apiAdmin.post("/users", data);
      toast.success("Thêm người dùng thành công!");
      navigate("/admin/users");
    } catch (err) {
      console.error(err);
      toast.error("Thêm thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Thêm người dùng</h2>
      <UserForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
