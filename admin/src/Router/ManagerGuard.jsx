import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const ManagerGuard = ({ children }) => {
  const { isAuth, user } = useSelector((state) => state.user);
  if (!isAuth) return <Navigate to="/" replace />;
  if (user?.role === "admin") return <Navigate to="/admin/dashboard" replace />;
  return children;
};
