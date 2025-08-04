// src/pages/AuthRedirect.tsx
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import LandingPage from './Landing';
import { Dashboard } from '@/modules/dashboard/Dashboard';

export const AuthRedirect = () => {
  const { token } = useAuth();
  const [clientReady, setClientReady] = useState(false);

  // ننتظر حتى تتأكد الـ AuthProvider من وجود التوكن (من localStorage)
  useEffect(() => {
    setClientReady(true);
  }, []);

  if (!clientReady) return null; // أو spinner

  return token ? <Dashboard /> : <LandingPage />;
};
