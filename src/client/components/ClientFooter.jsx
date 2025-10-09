export default function ClientFooter() {
  return (
    <footer className="bg-blue-900 text-gray-100 pt-10 pb-6 mt-12">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        {/* --- Cột 1: Giới thiệu --- */}
        <div>
          <h3 className="text-2xl font-bold mb-3 text-yellow-400">
            🏨 Hotel Booking
          </h3>
          <p className="text-gray-300 leading-relaxed">
            Khách sạn cao cấp với không gian sang trọng, dịch vụ chuyên nghiệp
            và tiện nghi hiện đại — mang đến cho bạn trải nghiệm nghỉ dưỡng tuyệt vời.
          </p>
        </div>

        {/* --- Cột 2: Liên hệ --- */}
        <div>
          <h4 className="text-xl font-semibold mb-3 text-yellow-300">
            Liên hệ
          </h4>
          <ul className="space-y-2 text-gray-300">
            <li>📍 20 Tăng Nhơn Phú, Phước Long B, Thủ Đức, TP.HCM</li>
            <li>📞 0123 456 789</li>
            <li>✉️ support@hotel.com</li>
          </ul>
        </div>

        {/* --- Cột 3: Mạng xã hội --- */}
        <div>
          <h4 className="text-xl font-semibold mb-3 text-yellow-300">
            Kết nối với chúng tôi
          </h4>
          <div className="flex space-x-4">
            <a
              href="#"
              className="hover:text-yellow-400 transition-colors"
              title="Facebook"
            >
              🌐 Facebook
            </a>
            <a
              href="#"
              className="hover:text-yellow-400 transition-colors"
              title="Instagram"
            >
              📸 Instagram
            </a>
            <a
              href="#"
              className="hover:text-yellow-400 transition-colors"
              title="Twitter"
            >
              🐦 Twitter
            </a>
          </div>
        </div>
      </div>

      {/* --- Dòng bản quyền --- */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} <span className="text-yellow-400 font-semibold">Hotel Booking</span>.  
        All rights reserved.
      </div>
    </footer>
  );
}
