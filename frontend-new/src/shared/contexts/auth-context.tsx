import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api } from "@shared/api";
import { setAuthToken } from "@shared/api/config";
import type { Role } from "@shared/contexts/role-context";

type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  token?: string;
};

type AuthContextValue = {
  user?: User;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue>({
  login: async () => undefined,
  logout: () => undefined,
  loading: false,
});

const getStoredToken = () => {
  if (typeof window === "undefined") return undefined;
  return window.localStorage.getItem("token") ?? undefined;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(false);

  const login = useCallback<AuthContextValue["login"]>(async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post<{ token: string; user: Omit<User, "token"> }>("/v1/login", {
        email,
        password,
      });
      const { token, user: userData } = response.data;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("token", token);
      }
      setAuthToken(token);
      setUser({ ...userData, token });
    } catch (error) {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("token");
      }
      setAuthToken(null);
      setUser(undefined);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("token");
    }
    setAuthToken(null);
    setUser(undefined);
  }, []);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) return;

    setLoading(true);
    setAuthToken(token);

    const resolveUser = async () => {
      try {
        const { data } = await api.get<Omit<User, "token">>("/me");
        setUser({ ...data, token });
      } catch (error) {
        try {
          const { data } = await api.get<Omit<User, "token">>("/api/v1/me");
          setUser({ ...data, token });
          return;
        } catch (innerError) {
          if (typeof window !== "undefined") {
            window.localStorage.removeItem("token");
          }
          setAuthToken(null);
          setUser(undefined);
          if (import.meta.env.DEV) {
            console.error(innerError);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    void resolveUser();
  }, []);

  const value = useMemo(
    () => ({ user, login, logout, loading }),
    [login, loading, logout, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
