import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "@/stores/auth.store";

export function RequiredAuth() {
  const { token, user } = useAuthStore();
  return token && user?.role === 1 ? <Outlet /> : <Navigate to="/login" replace />;
}
