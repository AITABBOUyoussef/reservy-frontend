import { Navigate, Outlet, useLocation } from "react-router-dom";

function getRole() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  return localStorage.getItem("role") || user?.roles?.[0]?.name || null;
}

export default function ProtectedRoute({ roles }) {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const role = getRole();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && !roles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
