import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  let isAdmin = false;
  try {
    if (user) {
      const parsed = JSON.parse(user);
      isAdmin = parsed.role === "admin";
    }
  } catch (e) {
    isAdmin = false;
  }
  if (!token) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
};

export default AdminRoute;
