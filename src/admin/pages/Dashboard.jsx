import { useEffect, useState } from "react";
import { apiAdmin } from "../../api/axios";
import {
  BedDouble,
  Users,
  ClipboardList,
  Receipt,
  DollarSign,
} from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    rooms: 0,
    customers: 0,
    bookings: 0,
    invoices: 0,
    revenue: 0,
  });

  const user = JSON.parse(localStorage.getItem("admin_user"));

  useEffect(() => {
    apiAdmin
      .get("dashboard")
      .then((res) => {
        const data = res.data;
        setStats({
          rooms: data.rooms || 0,
          customers: data.customers || 0,
          bookings: data.bookings || 0,
          invoices: data.invoices || 0,
          revenue: data.revenue || 0,
        });
      })
      .catch((err) => console.error("Dashboard fetch error:", err));
  }, []);

  if (user?.role !== 0) {
    return (
      <div className="text-red-600 font-bold text-xl text-center mt-10">
        🚫 Bạn không có quyền truy cập trang này
      </div>
    );
  }

  // Hàm format doanh thu thân thiện
  const formatRevenue = (value) => {
    if (value >= 1_000_000_000)
      return (value / 1_000_000_000).toFixed(2) + " Tỷ";
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(2) + " Triệu";
    if (value >= 1_000) return (value / 1_000).toFixed(2) + " Nghìn";
    return value.toLocaleString("vi-VN") + " ₫";
  };

  const cards = [
    {
      title: "Phòng",
      value: stats.rooms,
      color: "from-blue-400 to-blue-600",
      icon: <BedDouble size={32} />,
    },
    {
      title: "Khách hàng",
      value: stats.customers,
      color: "from-green-400 to-green-600",
      icon: <Users size={32} />,
    },
    {
      title: "Đặt phòng",
      value: stats.bookings,
      color: "from-yellow-400 to-yellow-600",
      icon: <ClipboardList size={32} />,
    },
    {
      title: "Hóa đơn",
      value: stats.invoices,
      color: "from-red-400 to-red-600",
      icon: <Receipt size={32} />,
    },
    {
      title: "Doanh thu",
      value: formatRevenue(stats.revenue),
      color: "from-purple-400 to-purple-600",
      icon: <DollarSign size={32} />,
    },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        📊 Dashboard Quản lý khách sạn
      </h2>
      <p className="text-gray-600 mb-10">
        Chào mừng <span className="font-semibold">{user?.fullname}</span> đến
        với hệ thống quản lý. Dưới đây là số liệu tổng quan hôm nay:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${card.color} text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">{card.title}</h3>
              {card.icon}
            </div>
            <p className="text-3xl font-bold truncate">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
