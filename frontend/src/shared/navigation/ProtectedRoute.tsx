import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute() {
  const { loading, me } = useAuth();

  if (loading) {
    return <div className="p-6">Loading…</div>;
  }

  if (!me) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
