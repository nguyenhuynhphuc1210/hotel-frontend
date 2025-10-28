import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiClient } from "../../api/axios";

export default function PaymentRemainingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const data = Object.fromEntries(params.entries());

    // Xác định loại cổng thanh toán
    let apiUrl = "";
    if (data.resultCode !== undefined && data.orderId) {
      // Có resultCode và orderId → MoMo
      apiUrl = "/payment/momo/remaining-return";
    } else if (data.vnp_ResponseCode !== undefined && data.vnp_TxnRef) {
      // Có vnp_ResponseCode → VNPay
      apiUrl = "/payment/vnpay/remaining-return";
    } else {
      toast.error("Không xác định được cổng thanh toán!");
      navigate("/my-bookings");
      return;
    }

    apiClient.post(apiUrl, data)
      .then(res => {
        if (res.data.status === "success") {
          toast.success("Thanh toán số tiền còn lại thành công!");
          navigate("/my-bookings", { state: { refresh: true } });
        } else {
          toast.error(res.data.message || "Thanh toán thất bại");
          navigate("/my-bookings");
        }
      })
      .catch(err => {
        console.error(err);
        toast.error("Lỗi xử lý thanh toán");
        navigate("/my-bookings");
      });
  }, [location, navigate]);

  return (
    <div className="p-6 text-center">
      Đang xử lý thanh toán số tiền còn lại...
    </div>
  );
}
