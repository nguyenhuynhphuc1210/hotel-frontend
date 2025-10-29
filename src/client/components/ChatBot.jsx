import { useState, useEffect, useRef } from "react";
import { apiClient } from "../../api/axios";
import { MessageCircle, X } from "lucide-react";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const toggleChat = () => setIsOpen((prev) => !prev);

  // 🔹 Tự động cuộn xuống khi có tin nhắn mới
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
      // 🔹 Gửi message đến Laravel → Laravel gọi n8n webhook
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
    <div className="fixed bottom-5 right-5 z-50">
      {/* 🔹 Nút mở chat */}
      {!isOpen ? (
        <button
          onClick={toggleChat}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          <MessageCircle size={28} />
        </button>
      ) : (
        // 🔹 Hộp chat
        <div className="w-80 h-96 bg-white rounded-2xl shadow-xl flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-3 bg-blue-600 text-white rounded-t-2xl">
            <h3 className="font-semibold text-sm">Chat với AI</h3>
            <button onClick={toggleChat}>
              <X size={20} />
            </button>
          </div>

          {/* Khung tin nhắn */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 scroll-smooth">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-2 rounded-lg text-sm max-w-[75%] ${
                    msg.sender === "user"
                      ? "bg-blue-100 text-blue-900"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="text-gray-500 text-xs italic">AI đang trả lời...</div>
            )}

            <div ref={chatEndRef}></div>
          </div>

          {/* Ô nhập + nút gửi */}
          <form onSubmit={sendMessage} className="p-3 border-t flex">
            <input
              className="flex-1 border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) sendMessage(e);
              }}
            />
            <button
              type="submit"
              className="ml-2 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              Gửi
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
