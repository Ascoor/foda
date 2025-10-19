import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@shared/contexts/AuthContext";

interface ProtectedRouteProps {
  redirectTo?: string;
}

export const ProtectedRoute = ({
  redirectTo = "/auth/login",
}: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
