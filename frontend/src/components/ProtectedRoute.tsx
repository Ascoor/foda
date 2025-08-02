import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '@/lib/auth';

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
