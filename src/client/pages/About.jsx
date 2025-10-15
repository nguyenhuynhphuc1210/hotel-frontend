import { useState, useEffect } from "react";

export default function About() {
  const [loading, setLoading] = useState(true);

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
          <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Giới thiệu về chúng tôi</h1>
          <p className="text-blue-100">
            Khám phá câu chuyện và giá trị của Aurora Hotel
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Introduction */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-4xl">🏨</div>
            <h2 className="text-3xl font-bold text-gray-900">Aurora Hotel</h2>
          </div>

          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p className="text-lg">
              Chào mừng bạn đến với{" "}
              <strong className="text-blue-600">Aurora Hotel</strong> – nơi mang
              đến cho bạn trải nghiệm nghỉ dưỡng thoải mái và tiện nghi bậc
              nhất. Chúng tôi cung cấp đa dạng loại phòng phù hợp với mọi nhu
              cầu: từ phòng tiêu chuẩn cho đến suite cao cấp.
            </p>
            <p>
              Với đội ngũ nhân viên chuyên nghiệp, tận tâm và hệ thống dịch vụ
              tiện ích như hồ bơi, spa, nhà hàng sang trọng và khu vui chơi trẻ
              em, chúng tôi tự hào mang đến kỳ nghỉ đáng nhớ nhất cho bạn và gia
              đình.
            </p>
            <p>
              Hãy để <strong className="text-blue-600">Aurora Hotel</strong> là
              điểm đến cho mỗi hành trình của bạn!
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl mb-4">
              🛏️
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Phòng đa dạng
            </h3>
            <p className="text-gray-600 text-sm">
              Nhiều loại phòng từ tiêu chuẩn đến cao cấp, phù hợp mọi nhu cầu
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl mb-4">
              ⭐
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Dịch vụ 5 sao
            </h3>
            <p className="text-gray-600 text-sm">
              Đội ngũ chuyên nghiệp, tận tâm phục vụ 24/7
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl mb-4">
              🏊
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Tiện nghi đầy đủ
            </h3>
            <p className="text-gray-600 text-sm">
              Hồ bơi, spa, gym và nhiều tiện ích khác
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl mb-4">
              📍
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Vị trí thuận lợi
            </h3>
            <p className="text-gray-600 text-sm">
              Trung tâm thành phố, dễ dàng di chuyển
            </p>
          </div>
        </div>

        {/* Services Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Dịch vụ của chúng tôi
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Nhà hàng & Bar
                  </h4>
                  <p className="text-sm text-gray-600">
                    Ẩm thực đa dạng, phục vụ 24/7
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Spa & Massage</h4>
                  <p className="text-sm text-gray-600">
                    Thư giãn với dịch vụ spa đẳng cấp
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Hồ bơi & Gym</h4>
                  <p className="text-sm text-gray-600">
                    Trang thiết bị hiện đại, sạch sẽ
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Khu vui chơi trẻ em
                  </h4>
                  <p className="text-sm text-gray-600">
                    An toàn, vui nhộn cho các bé
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Phòng họp & Sự kiện
                  </h4>
                  <p className="text-sm text-gray-600">
                    Không gian chuyên nghiệp cho doanh nghiệp
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Tại sao chọn chúng tôi?
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">
                  🏆 Uy tín hàng đầu
                </h4>
                <p className="text-sm text-gray-600">
                  Hơn 10 năm kinh nghiệm trong ngành khách sạn
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">
                  💯 Cam kết chất lượng
                </h4>
                <p className="text-sm text-gray-600">
                  Đảm bảo dịch vụ tốt nhất với giá cả hợp lý
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">
                  🎁 Ưu đãi hấp dẫn
                </h4>
                <p className="text-sm text-gray-600">
                  Nhiều chương trình khuyến mãi quanh năm
                </p>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">
                  🔒 Bảo mật tuyệt đối
                </h4>
                <p className="text-sm text-gray-600">
                  Thông tin khách hàng được bảo vệ an toàn
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
