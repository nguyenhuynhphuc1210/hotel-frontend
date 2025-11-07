import { useEffect, useState } from "react";
import { apiAdmin } from "../../api/axios";
import {
  BedDouble,
  Users,
  ClipboardList,
  Receipt,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Dashboard() {
  const [stats, setStats] = useState({
    rooms: 0,
    customers: 0,
    bookings: 0,
    invoices: 0,
    revenue: 0,
  });

  const [revenueData, setRevenueData] = useState([]);
  const [period, setPeriod] = useState("day");
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    fetchRevenueData(period);
  }, [period]);

  const fetchRevenueData = (selectedPeriod) => {
    setLoading(true);
    apiAdmin
      .get(`dashboard/revenue?period=${selectedPeriod}`)
      .then((res) => {
        setRevenueData(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Revenue fetch error:", err);
        setLoading(false);
      });
  };

  if (user?.role !== 0) {
    return (
      <div className="text-red-600 font-bold text-xl text-center mt-10">
        🚫 Bạn không có quyền truy cập trang này
      </div>
    );
  }

  const formatRevenue = (value) => {
    if (value >= 1_000_000_000)
      return (value / 1_000_000_000).toFixed(2) + " Tỷ";
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(2) + " Triệu";
    if (value >= 1_000) return (value / 1_000).toFixed(2) + " Nghìn";
    return value.toLocaleString("vi-VN") + " ₫";
  };

  const formatYAxis = (value) => {
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
    return value;
  };

  // 🧾 HÀM XUẤT EXCEL
  const exportToExcel = () => {
    if (revenueData.length === 0) {
      alert("Không có dữ liệu để xuất!");
      return;
    }

    const worksheetData = revenueData.map((item, index) => ({
      "STT": index + 1,
      "Ngày": item.date,
      "Doanh thu (VNĐ)": item.revenue,
      "Hiển thị": formatRevenue(item.revenue),
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DoanhThu");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, `BaoCaoDoanhThu_${period}.xlsx`);
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

  const periodOptions = [
    { value: "day", label: "Ngày" },
    { value: "week", label: "Tuần" },
    { value: "month", label: "Tháng" },
    { value: "year", label: "Năm" },
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
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

      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp size={28} className="text-purple-600" />
            Biểu đồ Doanh thu
          </h3>
          <div className="flex gap-2">
            {periodOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setPeriod(option.value)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  period === option.value
                    ? "bg-purple-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {option.label}
              </button>
            ))}

            {/* Nút xuất Excel */}
            <button
              onClick={exportToExcel}
              className="px-4 py-2 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700"
            >
              📤 Xuất Excel
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : revenueData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="date"
                stroke="#666"
                style={{ fontSize: "14px" }}
              />
              <YAxis
                tickFormatter={formatYAxis}
                stroke="#666"
                style={{ fontSize: "14px" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                }}
                formatter={(value) => [formatRevenue(value), "Doanh thu"]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#9333ea"
                strokeWidth={3}
                dot={{ fill: "#9333ea", r: 5 }}
                activeDot={{ r: 7 }}
                name="Doanh thu"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex justify-center items-center h-96 text-gray-500">
            <p className="text-lg">Không có dữ liệu doanh thu</p>
          </div>
        )}
      </div>
    </div>
  );
}
