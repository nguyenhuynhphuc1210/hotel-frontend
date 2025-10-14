import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "../../api/axios";
import { toast } from "react-toastify";

export default function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [user, setUser] = useState(null); // ✅ Thông tin user
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

  // ✅ Lấy user từ localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setForm((prev) => ({
        ...prev,
        fullname: userData.name || "",
        email: userData.email || "",
      }));
    }
  }, []);

  // ✅ Lấy chi tiết phòng
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

  // ✅ Lấy danh sách dịch vụ
  useEffect(() => {
    apiClient
      .get("/services/all")
      .then((res) => setServices(res.data))
      .catch((err) => console.error(err));
  }, []);

  // ✅ Tính tổng tiền
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

  // ✅ Xử lý chọn dịch vụ
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

  // ✅ Xử lý khi nhấn “Tiến hành thanh toán”
  const handleProceedToPayment = () => {
    if (!user) {
      toast.error(
        "Vui lòng đăng nhập hoặc đăng ký bằng email đã dùng để đặt phòng để xem hoặc đặt phòng!"
      );
      navigate("/login");
      return;
    }

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

    if (new Date(form.checkout_date) <= new Date(form.checkin_date)) {
      toast.error("Ngày trả phòng phải sau ngày nhận phòng!");
      return;
    }

    navigate("/payment", {
      state: { room, form, selectedServices, total },
    });
  };

  // ✅ Nếu đang tải phòng
  if (!room)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin phòng...</p>
        </div>
      </div>
    );

  // ✅ Nếu chưa đăng nhập → hiển thị thông báo yêu cầu
  if (!user)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white shadow-md rounded-xl p-8 text-center max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold mb-3 text-gray-800">
            Bạn cần đăng nhập để xem hoặc đặt phòng
          </h2>
          <p className="text-gray-600 mb-6">
            Vui lòng đăng ký tài khoản và dùng email đã đặt phòng để xem thông tin phòng đã đặt.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );

  const roomImages = room.images || [];

  // ✅ Giao diện khi user đã đăng nhập
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
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

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Hình ảnh phòng */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {roomImages.length > 0 ? (
              <div>
                <div className="relative h-96 bg-gray-900">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/storage/${
                      roomImages.image_path
                    }`}
                    alt={`Phòng ${room.room_number}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ) : (
              <div className="h-96 flex items-center justify-center bg-gray-100">
                <p className="text-gray-500">Chưa có hình ảnh</p>
              </div>
            )}
          </div>

          {/* Mô tả */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Phòng {room.room_number}
            </h1>
            <div className="text-blue-600 font-semibold text-lg mb-4">
              {Number(room.price).toLocaleString("vi-VN")}₫ / đêm
            </div>
            <p className="text-gray-600 leading-relaxed">
              {room.description ||
                "Phòng nghỉ thoải mái với đầy đủ tiện nghi hiện đại."}
            </p>
          </div>

          {/* Dịch vụ */}
          {services.length > 0 && room.status === "available" && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-900">
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
                      className="flex items-center justify-between border p-3 rounded-lg hover:border-blue-300"
                    >
                      <div>
                        <div className="font-medium">{service.service_name}</div>
                        <div className="text-blue-600 text-sm font-semibold">
                          {service.price.toLocaleString("vi-VN")}₫
                        </div>
                      </div>
                      <input
                        type="number"
                        min="0"
                        className="w-20 px-2 py-1 border rounded-lg text-center"
                        value={selected ? selected.quantity : 0}
                        onChange={(e) =>
                          handleServiceChange(
                            service,
                            parseInt(e.target.value) || 0
                          )
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Form đặt phòng */}
        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
          {room.status === "available" ? (
            <>
              <h3 className="text-xl font-bold mb-6 text-gray-900">
                Thông tin đặt phòng
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Họ và tên</label>
                  <input
                    type="text"
                    className="w-full border px-4 py-2 rounded-lg"
                    value={form.fullname}
                    onChange={(e) =>
                      setForm({ ...form, fullname: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    className="w-full border px-4 py-2 rounded-lg"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    className="w-full border px-4 py-2 rounded-lg"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    disabled // ✅ không cho sửa email nếu user đã đăng nhập
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">CCCD</label>
                  <input
                    type="text"
                    className="w-full border px-4 py-2 rounded-lg"
                    value={form.cccd}
                    onChange={(e) =>
                      setForm({ ...form, cccd: e.target.value })
                    }
                  />
                </div>

                {/* Ngày nhận/trả */}
                <div>
                  <label className="block text-sm font-medium">
                    Ngày nhận phòng
                  </label>
                  <input
                    type="date"
                    className="w-full border px-4 py-2 rounded-lg"
                    value={form.checkin_date}
                    onChange={(e) =>
                      setForm({ ...form, checkin_date: e.target.value })
                    }
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Ngày trả phòng
                  </label>
                  <input
                    type="date"
                    className="w-full border px-4 py-2 rounded-lg"
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

                {/* Tổng tiền */}
                {nights > 0 && (
                  <div className="border-t pt-3 text-right">
                    <div className="text-gray-600">
                      {nights} đêm x {room.price.toLocaleString("vi-VN")}₫
                    </div>
                    <div className="font-bold text-blue-600 text-xl">
                      {total.toLocaleString("vi-VN")}₫
                    </div>
                  </div>
                )}

                <button
                  onClick={handleProceedToPayment}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
                >
                  Tiến hành thanh toán
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="text-5xl mb-3">🚫</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Phòng không khả dụng
              </h3>
              <button
                onClick={() => navigate("/rooms")}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
              >
                Tìm phòng khác
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
