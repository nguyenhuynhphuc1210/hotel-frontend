import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiClient } from "../../api/axios";

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const data = Object.fromEntries(params.entries());

    // Xác định phương thức thanh toán
    if (data.vnp_ResponseCode !== undefined) {
      // VNPay
      apiClient.post("/payment/vnpay/return", data)
        .then(res => handleResponse(res))
        .catch(err => handleError(err));
    } else if (data.resultCode !== undefined) {
      // MoMo
      apiClient.post("/payment/momo/return", data)
        .then(res => handleResponse(res))
        .catch(err => handleError(err));
    } else {
      toast.error("Không xác định được phương thức thanh toán");
      navigate("/rooms");
    }

    function handleResponse(res) {
      if (res.data.status === "success") {
        toast.success("Đặt phòng thành công!");
        navigate("/my-bookings");
      } else {
        toast.error(res.data.message || "Thanh toán không thành công");
        navigate("/rooms");
      }
    }

    function handleError(err) {
      console.error(err);
      toast.error("Lỗi xử lý thanh toán");
      navigate("/rooms");
    }

  }, [location, navigate]);

  return <div className="p-6 text-center">Đang xử lý thanh toán...</div>;
}
