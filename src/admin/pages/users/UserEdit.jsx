import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiAdmin } from "../../../api/axios";
import UserForm from "./UserForm";
import { toast } from "react-toastify";

export default function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiAdmin.get(`/users/${id}`);
        setUserData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [id]);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await apiAdmin.put(`/users/${id}`, data);
      toast.success("Cập nhật thành công!");
      navigate("/admin/users");
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Sửa người dùng</h2>
      {userData ? (
        <UserForm initialData={userData} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      ) : (
        <p>Đang tải dữ liệu...</p>
      )}
    </div>
  );
}
