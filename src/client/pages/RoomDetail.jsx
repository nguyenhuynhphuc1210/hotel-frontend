import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "../../api/axios";
import { toast } from "react-toastify";
import RoomReviews from "./RoomReviews";

export default function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [form, setForm] = useState({
    fullname: "",
    phone: "",
    email: "",
    cccd: "",
    checkin_date: "",
    checkout_date: "",
  });
  const [total, setTotal] = useState(0);
  const [nights, setNights] = useState(0);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("client_user") || "null");
    if (savedUser) {
      setForm((prev) => ({
        ...prev,
        fullname: savedUser.fullname || "",
        email: savedUser.email || "",
      }));
    }
  }, []);

  // Lấy chi tiết phòng
  useEffect(() => {
    apiClient
      .get(`/rooms/${id}`)
      .then((res) => setRoom(res.data))
      .catch((err) => {
        console.error(err);
        toast.error("Không tìm thấy phòng!");
        navigate("/rooms");
      });
  }, [id, navigate]);

  // Lấy danh sách dịch vụ
  useEffect(() => {
    apiClient
      .get("/services/all")
      .then((res) => setServices(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Tính tổng tiền
  useEffect(() => {
    if (room && form.checkin_date && form.checkout_date) {
      const checkin = new Date(form.checkin_date);
      const checkout = new Date(form.checkout_date);
      if (checkout > checkin) {
        const days = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
        setNights(days);
        const servicesTotal = selectedServices.reduce(
          (sum, s) => sum + s.price * s.quantity,
          0
        );
        setTotal(days * room.price + servicesTotal);
      } else {
        setTotal(0);
        setNights(0);
      }
    } else {
      setTotal(0);
      setNights(0);
    }
  }, [form.checkin_date, form.checkout_date, room, selectedServices]);

  // Chọn dịch vụ và số lượng
  const handleServiceChange = (service, quantity) => {
    if (quantity > 0) {
      setSelectedServices((prev) => {
        const exists = prev.find((s) => s.id === service.id);
        if (exists)
          return prev.map((s) =>
            s.id === service.id ? { ...s, quantity } : s
          );
        else return [...prev, { ...service, quantity }];
      });
    } else {
      setSelectedServices((prev) => prev.filter((s) => s.id !== service.id));
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "single":
        return "Phòng đơn";
      case "double":
        return "Phòng đôi";
      case "suite":
        return "Phòng VIP";
      default:
        return type;
    }
  };
  // Thanh toán
  const handleProceedToPayment = async () => {
    if (
      !form.fullname ||
      !form.phone ||
      !form.email ||
      !form.cccd ||
      !form.checkin_date ||
      !form.checkout_date
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      // Kiểm tra xem đã có customer_id chưa
      let customerId = localStorage.getItem("customer_id");

      if (!customerId) {
        // Tạo mới customer
        const res = await apiClient.post("/customers", {
          fullname: form.fullname,
          email: form.email,
          phone: form.phone,
          cccd: form.cccd,
        });
        customerId = res.data.id; // lấy id từ response
        localStorage.setItem("customer_id", customerId);
      }

      navigate("/paymentdeposit", {
        state: { room, form, selectedServices, total, customer_id: customerId },
      });
    } catch (error) {
      console.error(error);
      toast.error("Lỗi tạo khách hàng, vui lòng thử lại");
    }
  };

  if (!room)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin phòng...</p>
        </div>
      </div>
    );

  const roomImages = room.images || [];

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button
              onClick={() => navigate("/rooms")}
              className="hover:text-blue-600 transition"
            >
              Danh sách phòng
            </button>
            <span>/</span>
            <span className="text-gray-900 font-medium">
              Phòng {room.room_number}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột trái: Hình ảnh & Thông tin phòng */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {roomImages.length > 0 ? (
                <div>
                  {/* Main Image */}
                  <div className="relative h-96 bg-gray-900">
                    <img
                      src={roomImages[currentImageIndex].image_path}
                      alt={`Phòng ${room.room_number}`}
                      className="w-full h-full object-cover"
                    />
                    {/* Navigation Arrows */}
                    {roomImages.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            setCurrentImageIndex((prev) =>
                              prev === 0 ? roomImages.length - 1 : prev - 1
                            )
                          }
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full shadow-lg transition"
                        >
                          ←
                        </button>
                        <button
                          onClick={() =>
                            setCurrentImageIndex((prev) =>
                              prev === roomImages.length - 1 ? 0 : prev + 1
                            )
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full shadow-lg transition"
                        >
                          →
                        </button>
                      </>
                    )}
                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {roomImages.length}
                    </div>
                  </div>
                  {/* Thumbnails */}
                  {roomImages.length > 1 && (
                    <div className="p-4 flex gap-2 overflow-x-auto">
                      {roomImages.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                            currentImageIndex === index
                              ? "border-blue-600"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <img
                            src={img.image_path}
                            alt={`Thumbnail ${index}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-96 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <div className="text-center">
                    <div className="text-6xl mb-3">🏨</div>
                    <p className="text-gray-400">Chưa có hình ảnh</p>
                  </div>
                </div>
              )}
            </div>

            {/* Room Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Phòng {room.room_number}
                  </h1>
                  <div className="flex items-center gap-3">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg">
                      {getTypeLabel(room.type)}
                    </span>
                    <span
                      className={`inline-block px-3 py-1 text-sm font-medium rounded-lg ${
                        room.status === "available"
                          ? "bg-green-100 text-green-700"
                          : room.status === "booked"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {room.status === "available"
                        ? "Còn trống"
                        : room.status === "booked"
                        ? "Đã đặt"
                        : "Đang bảo trì"}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">
                    {Number(room.price).toLocaleString("vi-VN")}₫
                  </div>
                  <div className="text-sm text-gray-500">mỗi đêm</div>
                </div>
              </div>

              {/* Description */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Mô tả phòng
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {room.description ||
                    "Phòng nghỉ thoải mái với đầy đủ tiện nghi hiện đại."}
                </p>
              </div>
            </div>

            {/* Services */}
            {services.length > 0 && room.status === "available" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Dịch vụ bổ sung
                </h3>
                <div className="space-y-3">
                  {services.map((service) => {
                    const selected = selectedServices.find(
                      (s) => s.id === service.id
                    );
                    return (
                      <div
                        key={service.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {service.service_name}
                          </div>
                          <div className="text-sm text-blue-600 font-semibold">
                            {service.price.toLocaleString("vi-VN")}₫
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            Số lượng:
                          </span>
                          <input
                            type="number"
                            min="0"
                            className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={selected ? selected.quantity : 0}
                            onChange={(e) =>
                              handleServiceChange(
                                service,
                                parseInt(e.target.value) || 0
                              )
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Cột phải: Form đặt phòng */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              {room.status === "available" ? (
                <>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Thông tin đặt phòng
                  </h3>
                  <div className="space-y-4">
                    {/* Personal Info */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Nguyễn Văn A"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={form.fullname}
                        onChange={(e) =>
                          setForm({ ...form, fullname: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="0912345678"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="email@example.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CCCD/CMND <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="001234567890"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={form.cccd}
                        onChange={(e) =>
                          setForm({ ...form, cccd: e.target.value })
                        }
                      />
                    </div>

                    {/* Dates */}
                    <div className="border-t pt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ngày nhận phòng <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={form.checkin_date}
                        onChange={(e) =>
                          setForm({ ...form, checkin_date: e.target.value })
                        }
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ngày trả phòng <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={form.checkout_date}
                        onChange={(e) =>
                          setForm({ ...form, checkout_date: e.target.value })
                        }
                        min={
                          form.checkin_date ||
                          new Date().toISOString().split("T")[0]
                        }
                      />
                    </div>

                    {/* Price Breakdown */}
                    {nights > 0 && (
                      <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between text-gray-600">
                          <span>
                            {Number(room.price).toLocaleString("vi-VN")}₫ x{" "}
                            {nights} đêm
                          </span>
                          <span>
                            {(room.price * nights).toLocaleString("vi-VN")}₫
                          </span>
                        </div>
                        {selectedServices.length > 0 && (
                          <div className="flex justify-between text-gray-600">
                            <span>Dịch vụ bổ sung</span>
                            <span>
                              {selectedServices
                                .reduce(
                                  (sum, s) => sum + s.price * s.quantity,
                                  0
                                )
                                .toLocaleString("vi-VN")}
                              ₫
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                          <span>Tổng cộng</span>
                          <span className="text-blue-600">
                            {total.toLocaleString("vi-VN")}₫
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="pt-4 space-y-2">
                      <button
                        onClick={handleProceedToPayment}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
                      >
                        Tiến hành thanh toán
                      </button>
                      <button
                        onClick={() => navigate(-1)}
                        className="w-full py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-lg transition-colors duration-200"
                      >
                        Quay lại
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="text-5xl mb-3">🚫</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Phòng không khả dụng
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Rất tiếc, phòng này hiện đã được đặt hoặc đang bảo trì.
                  </p>
                  <button
                    onClick={() => navigate("/rooms")}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
                  >
                    Tìm phòng khác
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Đánh giá & Nhận xét
          </h3>

          {/* Hiển thị trung bình sao và danh sách review */}
          <RoomReviews roomId={room.id} />
        </div>
      </div>
    </div>
  );
}
