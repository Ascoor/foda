import { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/infrastructure/shared/contexts/AuthContext";

interface ProtectedRouteProps {
  redirectTo?: string;
  fallback?: ReactNode;
}

export const ProtectedRoute = ({
  redirectTo = "/login",
  fallback,
}: ProtectedRouteProps) => {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div
        aria-busy="true"
        className="flex h-screen w-full items-center justify-center bg-background"
      >
        <span
          role="status"
          aria-live="polite"
          className="text-sm font-medium text-muted-foreground"
        >
          Loading...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ returnTo: location.pathname }}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
