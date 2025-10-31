import { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@shared/contexts/AuthContext";

interface ProtectedRouteProps {
  redirectTo?: string;
  children?: ReactNode;
}

export const ProtectedRoute = ({
  redirectTo = "/auth/login",
  children,
}: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (children) {
    return <>{children}</>;
  }

  return <Outlet />;
};

export default ProtectedRoute;
