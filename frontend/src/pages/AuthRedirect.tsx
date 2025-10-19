// src/pages/AuthRedirect.tsx
import { useAuth } from '@/shared/contexts/AuthContext';
import { useEffect } from 'react';
import FloatingLandingPage from '@features/marketing/pages/LandingPage';
import { useNavigate } from 'react-router-dom';

export const AuthRedirect = () => {
  const { token, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && token) {
      navigate('/dashboard', { replace: true });
    }
  }, [loading, token, navigate]);

  if (loading) return null; // أو spinner

  return <FloatingLandingPage />;
};
