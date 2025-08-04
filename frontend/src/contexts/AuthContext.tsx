import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import api, { setAuthToken } from '@/lib/api';

// واجهة بيانات المستخدم البسيطة
interface AuthContextType {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [token, setToken] = useState<string | null>(() =>
    typeof window !== 'undefined' ? localStorage.getItem('token') : null
  );

  // مزامنة التوكن مع خدمة الـAPI
  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  // تسجيل الدخول واستلام التوكن من الخادم
  const login = async (email: string, password: string) => {
    const response = await api.post<{ token: string }>('/login', {
      email,
      password,
    });
    const newToken = response.data.token;
    setToken(newToken);
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', newToken);
    }
  };

  // تسجيل الخروج وتنظيف التخزين المحلي
  const logout = () => {
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
