import { createContext, useContext, useEffect, useRef, useState } from "react";
import { authApi, type Me } from "../api/auth.service";
import { setAuthToken } from "../api/http";

type AuthContextValue = {
  me: Me | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthCtx = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState<boolean>(!!token);
  const skipNextFetch = useRef(false);

  useEffect(() => {
    setAuthToken(token);

    if (!token) {
      setMe(null);
      setLoading(false);
      return;
    }

    if (skipNextFetch.current) {
      skipNextFetch.current = false;
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    authApi
      .me()
      .then((profile) => {
        if (!cancelled) {
          setMe(profile);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          localStorage.removeItem("token");
          setAuthToken(null);
          setToken(null);
          setMe(null);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const { token: newToken } = await authApi.login({ email, password });
    localStorage.setItem("token", newToken);
    setToken(newToken);
    const profile = await authApi.me();
    skipNextFetch.current = true;
    setMe(profile);
    setLoading(false);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.warn("Logout request failed", error);
    }
    localStorage.removeItem("token");
    setAuthToken(null);
    setToken(null);
    setMe(null);
    setLoading(false);
  };

  return (
    <AuthCtx.Provider value={{ me, token, loading, login, logout }}>{children}</AuthCtx.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthCtx);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
