import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

// مسار محمي يمنع الوصول دون تسجيل الدخول
export const ProtectedRoute = () => {
  const { token } = useAuth();
  const [clientReady, setClientReady] = useState(false);
  const [fallbackToken, setFallbackToken] = useState<string | null>(null);

  useEffect(() => {
    setClientReady(true);
    if (typeof window !== 'undefined') {
      setFallbackToken(localStorage.getItem('token'));
    }
  }, []);

  if (!clientReady) return null;

  const effectiveToken = token || fallbackToken;
  return effectiveToken ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
