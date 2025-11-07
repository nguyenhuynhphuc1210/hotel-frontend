import { useState, useEffect, useRef } from "react";
import { apiClient } from "../../api/axios";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const toggleChat = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await apiClient.post("/chat-ai", { message: input });
      const aiReply = res.data.reply || "Không có phản hồi từ AI";
      setMessages((prev) => [...prev, { sender: "bot", text: aiReply }]);
    } catch (error) {
      console.error("ChatBot error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Lỗi khi kết nối đến server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Action Button */}
      {!isOpen ? (
        <button
          onClick={toggleChat}
          className="group relative bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/50 hover:scale-110 transition-all duration-300"
        >
          <MessageCircle size={28} className="relative z-10" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>
        </button>
      ) : (
        // Chat Window
        <div className="w-[380px] h-[550px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden transform transition-all duration-300">
          {/* Header with Gradient */}
          <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 text-white p-4 overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Bot size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-base">AI Assistant</h3>
                  <p className="text-xs text-white/80 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    Đang hoạt động
                  </p>
                </div>
              </div>
              <button 
                onClick={toggleChat}
                className="w-8 h-8 rounded-full hover:bg-white/20 transition-colors flex items-center justify-center"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Bot size={32} className="text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Xin chào! 👋</h4>
                <p className="text-sm text-gray-500">Tôi có thể giúp gì cho bạn hôm nay?</p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-md">
                    <Bot size={18} className="text-white" />
                  </div>
                )}
                
                <div
                  className={`p-3 rounded-2xl text-sm max-w-[75%] shadow-sm ${
                    msg.sender === "user"
                      ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-tr-sm"
                      : "bg-white text-gray-800 border border-gray-100 rounded-tl-sm"
                  }`}
                >
                  {msg.text}
                </div>

                {msg.sender === "user" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center flex-shrink-0 shadow-md">
                    <User size={18} className="text-white" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-md">
                  <Bot size={18} className="text-white" />
                </div>
                <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef}></div>
          </div>

          {/* Input Area */}
          <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-100">
            <div className="flex gap-2 items-end">
              <div className="flex-1 relative">
                <input
                  className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white"
                  placeholder="Nhập tin nhắn..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-3 rounded-2xl hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition-all duration-200 flex-shrink-0"
                disabled={loading || !input.trim()}
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}