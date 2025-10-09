// api.js
import axios from "axios";

// ---------------- CLIENT API ----------------
export const apiClient = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor gửi token client
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("client_token"); // chỉ lấy client token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------------- ADMIN API ----------------
export const apiAdmin = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor gửi token admin
apiAdmin.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token"); // chỉ lấy admin token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default { apiClient, apiAdmin };
