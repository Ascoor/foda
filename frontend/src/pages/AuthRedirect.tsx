// src/pages/AuthRedirect.tsx
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import LandingPage from './Landing';
import { useNavigate } from 'react-router-dom';

export const AuthRedirect = () => {
  const { token } = useAuth();
  const [clientReady, setClientReady] = useState(false);
  const navigate = useNavigate();

  // ننتظر حتى تتأكد الـ AuthProvider من وجود التوكن (من localStorage)
  useEffect(() => {
    setClientReady(true);
  }, []);

  useEffect(() => {
    if (clientReady && token) {
      navigate('/dashboard', { replace: true });
    }
  }, [clientReady, token, navigate]);

  if (!clientReady) return null; // أو spinner

  return <LandingPage />;
};
