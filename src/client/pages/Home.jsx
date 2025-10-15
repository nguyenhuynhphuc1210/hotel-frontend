import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <div className="inline-block mb-4">
              <span className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-full text-sm font-semibold">
                ⭐ Khách sạn 5 sao
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Chào mừng đến với
              <br />
              <span className="text-yellow-300">Aurora Hotel</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Trải nghiệm sự sang trọng và thoải mái ngay tại trung tâm thành
              phố. Đặt phòng ngay hôm nay để tận hưởng kỳ nghỉ tuyệt vời.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/rooms")}
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold shadow-lg hover:bg-yellow-300 hover:text-blue-900 transition-all duration-300 transform hover:scale-105"
              >
                🏨 Đặt phòng ngay
              </button>
              <button
                onClick={() => navigate("/about")}
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                📖 Tìm hiểu thêm
              </button>
            </div>
          </div>
        </div>

        {/* Decorative waves */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="#F9FAFB"
            />
          </svg>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Features Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tại sao chọn chúng tôi?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Khám phá những tiện nghi và dịch vụ đẳng cấp mà chúng tôi mang đến
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl mb-6 mx-auto">
                🛏️
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                Phòng hiện đại
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Phòng rộng rãi, thiết kế sang trọng với đầy đủ tiện nghi cao cấp
                cho sự thoải mái tối đa.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mb-6 mx-auto">
                🍽️
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                Nhà hàng & Bar
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Thưởng thức các món ăn ngon và cocktail được chế biến bởi đầu
                bếp hàng đầu.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-3xl mb-6 mx-auto">
                🛎️
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                Dịch vụ 24/7
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Đội ngũ nhân viên chuyên nghiệp luôn sẵn sàng hỗ trợ bạn mọi lúc
                trong suốt kỳ nghỉ.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-3xl mb-6 mx-auto">
                🏊
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                Hồ bơi & Spa
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Thư giãn tại hồ bơi ngoài trời và spa với các liệu pháp chăm sóc
                đẳng cấp.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-3xl mb-6 mx-auto">
                💼
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                Phòng họp
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Không gian hội nghị chuyên nghiệp với trang thiết bị hiện đại
                cho doanh nghiệp.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center text-3xl mb-6 mx-auto">
                📍
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                Vị trí thuận lợi
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Tọa lạc tại trung tâm thành phố, dễ dàng di chuyển đến mọi địa
                điểm quan trọng.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Khách hàng nói gì về chúng tôi
            </h2>
            <p className="text-gray-600">
              Những đánh giá chân thực từ khách hàng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl mr-3">
                  👤
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Nguyễn Văn A</h4>
                  <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Phòng rất sạch sẽ và thoải mái. Nhân viên thân thiện và chuyên
                nghiệp. Tôi sẽ quay lại!"
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-xl mr-3">
                  👤
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Trần Thị B</h4>
                  <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Vị trí tuyệt vời, gần trung tâm. Ăn sáng buffet rất ngon. Đáng
                tiền!"
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-xl mr-3">
                  👤
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Lê Văn C</h4>
                  <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Trải nghiệm tuyệt vời! Hồ bơi và spa rất đẳng cấp. Highly
                recommended!"
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-12 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sẵn sàng lên kế hoạch cho kỳ nghỉ của bạn?
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Khám phá các loại phòng và dịch vụ của chúng tôi, đặt phòng dễ
              dàng trực tuyến ngay hôm nay.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/rooms")}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
              >
                🛏️ Xem phòng
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold shadow-lg hover:bg-gray-50 transition-all duration-300 border-2 border-blue-600"
              >
                📞 Liên hệ ngay
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
