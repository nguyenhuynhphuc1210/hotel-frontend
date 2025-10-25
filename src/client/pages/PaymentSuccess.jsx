import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // ✅ Lấy tham số trả về từ MoMo
    const resultCode = searchParams.get("resultCode");
    const message = searchParams.get("message");

    if (resultCode === "0") {
      setStatus("success");
      setMessage("Thanh toán thành công! Cảm ơn bạn đã đặt phòng.");
    } else {
      setStatus("failed");
      setMessage(`Thanh toán thất bại: ${message || "Không rõ lý do."}`);
    }

    // (Tùy chọn) Nếu bạn muốn lấy thông tin booking mới tạo
    // gọi API backend của bạn, ví dụ:
    // fetch(`${import.meta.env.VITE_API_URL}/api/bookings/latest`)
    //   .then(res => res.json())
    //   .then(data => setBooking(data))
    //   .catch(err => console.error(err));
  }, [searchParams]);

  const handleBack = () => {
    navigate("/my-bookings");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-10 w-[420px] text-center">
        {status === "loading" && <p>Đang xử lý thanh toán...</p>}

        {status === "success" && (
          <>
            <img
              src="https://cdn-icons-png.flaticon.com/512/190/190411.png"
              alt="Success"
              className="w-20 mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold text-green-600 mb-2">Thanh toán thành công!</h2>
            <p className="text-gray-700 mb-6">
              Cảm ơn bạn đã thanh toán. Mã đơn hàng: <b>{searchParams.get("orderId")}</b>
            </p>
            <button
              onClick={handleBack}
              className="bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700 transition"
            >
              Xem đặt phòng
            </button>
          </>
        )}

        {status === "failed" && (
          <>
            <img
              src="https://cdn-icons-png.flaticon.com/512/463/463612.png"
              alt="Failed"
              className="w-20 mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold text-red-600 mb-2">Thanh toán thất bại!</h2>
            <p className="text-gray-700 mb-6">{message}</p>
            <button
              onClick={handleBack}
              className="bg-gray-600 text-white px-5 py-2 rounded-xl hover:bg-gray-700 transition"
            >
              Quay lại đặt phòng
            </button>
          </>
        )}
      </div>
    </div>
  );
}
