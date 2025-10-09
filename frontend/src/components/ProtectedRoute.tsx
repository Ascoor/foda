import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// مسار محمي يمنع الوصول دون تسجيل الدخول
export const ProtectedRoute = () => {
  const { token, user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
