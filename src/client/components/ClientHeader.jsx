import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiClient } from "../../api/axios";

export default function ClientHeader() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("client_user") || "null")
  );
  const [openMenu, setOpenMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Trang chủ", icon: "🏠" },
    { path: "/rooms", label: "Phòng", icon: "🛏️" },
    { path: "/services", label: "Dịch vụ", icon: "⭐" },
    { path: "/contact", label: "Liên hệ", icon: "📞" },
    { path: "/about", label: "Giới thiệu", icon: "ℹ️" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const savedUser = JSON.parse(
        localStorage.getItem("client_user") || "null"
      );
      setUser(savedUser);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("client_token");
    try {
      if (token) {
        await apiClient.post(
          "/logout",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (err) {
      console.error("Logout failed:", err.response?.data || err.message);
    } finally {
      localStorage.removeItem("client_user");
      localStorage.removeItem("client_token");
      setUser(null);
      setOpenMenu(false);
      navigate("/login");
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white shadow-lg"
            : "bg-gradient-to-r from-blue-600 to-blue-800"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div
              className={`flex items-center gap-3 cursor-pointer transition-all duration-300 ${
                scrolled ? "text-blue-600" : "text-white"
              }`}
              onClick={() => navigate("/")}
            >
              <div className="text-4xl">🏨</div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Aurora Hotel</h1>
                <p className={`text-xs ${scrolled ? "text-gray-600" : "text-blue-100"}`}>
                  Luxury & Comfort
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      scrolled
                        ? isActive
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        : isActive
                        ? "bg-white bg-opacity-20 text-white"
                        : "text-white hover:bg-white hover:bg-opacity-10"
                    }`
                  }
                >
                  <span className="mr-1">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* User Menu / Login Button */}
            <div className="hidden lg:flex items-center">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setOpenMenu(!openMenu)}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      scrolled
                        ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        : "bg-white bg-opacity-20 text-white hover:bg-opacity-30"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg ${
                      scrolled ? "bg-blue-600 text-white" : "bg-white text-blue-600"
                    }`}>
                      👤
                    </div>
                    <span className="max-w-32 truncate">{user.fullname}</span>
                    <svg
                      className={`w-4 h-4 transform transition-transform ${
                        openMenu ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {openMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setOpenMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                        <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                          <p className="text-sm font-medium">Xin chào,</p>
                          <p className="font-bold truncate">{user.fullname}</p>
                        </div>

                        <div className="py-2">
                          <button
                            onClick={() => {
                              setOpenMenu(false);
                              navigate("/profile");
                            }}
                            className="w-full text-left px-4 py-2.5 hover:bg-blue-50 transition flex items-center gap-3 text-gray-700"
                          >
                            <span className="text-lg">🧍</span>
                            <span className="font-medium">Hồ sơ cá nhân</span>
                          </button>

                          <button
                            onClick={() => {
                              setOpenMenu(false);
                              navigate("/my-bookings");
                            }}
                            className="w-full text-left px-4 py-2.5 hover:bg-blue-50 transition flex items-center gap-3 text-gray-700"
                          >
                            <span className="text-lg">📑</span>
                            <span className="font-medium">Phòng đã đặt</span>
                          </button>

                          <button
                            onClick={() => {
                              setOpenMenu(false);
                              navigate("/change-password");
                            }}
                            className="w-full text-left px-4 py-2.5 hover:bg-blue-50 transition flex items-center gap-3 text-gray-700"
                          >
                            <span className="text-lg">🔒</span>
                            <span className="font-medium">Đổi mật khẩu</span>
                          </button>

                          <div className="border-t border-gray-100 my-2"></div>

                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2.5 hover:bg-red-50 transition flex items-center gap-3 text-red-600 font-medium"
                          >
                            <span className="text-lg">🚪</span>
                            <span>Đăng xuất</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <NavLink
                  to="/login"
                  className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                    scrolled
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                      : "bg-white text-blue-600 hover:bg-blue-50 shadow-md"
                  }`}
                >
                  Đăng nhập
                </NavLink>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg ${
                scrolled ? "text-gray-700" : "text-white"
              }`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden pb-4">
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-2.5 rounded-lg font-medium transition-all ${
                        scrolled
                          ? isActive
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 hover:bg-blue-50"
                          : isActive
                          ? "bg-white bg-opacity-20 text-white"
                          : "text-white hover:bg-white hover:bg-opacity-10"
                      }`
                    }
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              {user ? (
                <div className="mt-4 space-y-1">
                  <div className={`px-4 py-2 rounded-lg font-semibold ${
                    scrolled ? "text-gray-900" : "text-white"
                  }`}>
                    👤 {user.fullname}
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/profile");
                    }}
                    className={`w-full text-left px-4 py-2.5 rounded-lg ${
                      scrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white hover:bg-opacity-10"
                    }`}
                  >
                    🧍 Hồ sơ cá nhân
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/my-bookings");
                    }}
                    className={`w-full text-left px-4 py-2.5 rounded-lg ${
                      scrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white hover:bg-opacity-10"
                    }`}
                  >
                    📑 Phòng đã đặt
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/change-password");
                    }}
                    className={`w-full text-left px-4 py-2.5 rounded-lg ${
                      scrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white hover:bg-opacity-10"
                    }`}
                  >
                    🔒 Đổi mật khẩu
                  </button>
                  <button
                    onClick={handleLogout}
                    className={`w-full text-left px-4 py-2.5 rounded-lg font-medium ${
                      scrolled ? "text-red-600 hover:bg-red-50" : "text-red-200 hover:bg-white hover:bg-opacity-10"
                    }`}
                  >
                    🚪 Đăng xuất
                  </button>
                </div>
              ) : (
                <NavLink
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block mt-4 px-4 py-2.5 rounded-lg font-semibold text-center ${
                    scrolled
                      ? "bg-blue-600 text-white"
                      : "bg-white text-blue-600"
                  }`}
                >
                  Đăng nhập
                </NavLink>
              )}
            </div>
          )}
        </div>
      </header>
      
      {/* Spacer để tránh content bị che bởi fixed header */}
      <div className="h-20"></div>
    </>
  );
}