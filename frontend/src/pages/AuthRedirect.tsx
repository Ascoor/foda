// src/pages/AuthRedirect.tsx
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import LandingPage from './Landing';
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

  return <LandingPage />;
};
