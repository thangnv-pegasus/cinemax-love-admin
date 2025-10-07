// src/router/RequiredAuth.tsx
import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "@/stores/auth.store";


export function GuestOnly() {
  const { token } = useAuthStore();
  return token ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
