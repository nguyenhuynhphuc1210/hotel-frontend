import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col p-4">
      {/* Logo / Brand */}
      <h2 className="text-2xl font-bold mb-8 text-center">🏨 Hotel Admin</h2>

      <nav className="flex flex-col gap-3">
        {/* Hệ thống */}
        <p className="text-sm text-gray-400 uppercase">Hệ thống</p>
        <Link to="dashboard" className="hover:text-yellow-300">📊 Dashboard</Link>
        <Link to="users" className="hover:text-yellow-300">👤 Quản lý người dùng</Link>

        {/* Khách hàng */}
        <p className="text-sm text-gray-400 uppercase mt-4">Khách hàng</p>
        <Link to="customers" className="hover:text-yellow-300">🧑‍🤝‍🧑 Quản lý khách hàng</Link>

        {/* Phòng & Dịch vụ */}
        <p className="text-sm text-gray-400 uppercase mt-4">Phòng & Dịch vụ</p>
        <Link to="rooms" className="hover:text-yellow-300">🛏️ Quản lý phòng</Link>
        <Link to="services" className="hover:text-yellow-300">🛎️ Quản lý dịch vụ</Link>

        {/* Đặt phòng */}
        <p className="text-sm text-gray-400 uppercase mt-4">Đặt phòng</p>
        <Link to="bookings" className="hover:text-yellow-300">📅 Quản lý booking</Link>
        <Link to="booking-services" className="hover:text-yellow-300">➕ Booking dịch vụ</Link>

        {/* Thanh toán */}
        <p className="text-sm text-gray-400 uppercase mt-4">Thanh toán</p>
        <Link to="invoices" className="hover:text-yellow-300">💵 Quản lý hóa đơn</Link>

        {/* Liên hệ */}
        <p className="text-sm text-gray-400 uppercase mt-4">Liên hệ</p>
        <Link to="contacts" className="hover:text-yellow-300">💌 Quản lý tin nhắn liên hệ</Link>
      </nav>
    </div>
  );
}
