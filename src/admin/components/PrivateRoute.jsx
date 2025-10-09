import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("admin_token"); // dùng admin_token
  return token ? children : <Navigate to="/admin/login" />;
}
