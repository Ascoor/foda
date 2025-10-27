import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { AuthContextValue, LoginData, RegisterData, User } from "./auth.types";
import {
  bootstrapSession,
  clearSessionState,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
} from "./auth.service";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export interface AuthProviderProps {
  children: ReactNode;
  initialUser?: User | null;
}

export const AuthProvider = ({ children, initialUser = null }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(initialUser);
  const [loading, setLoading] = useState(true);

  const syncUserFromSession = useCallback(async () => {
    try {
      const nextUser = await bootstrapSession();
      setUser(nextUser);
      return nextUser;
    } catch (error) {
      setUser(null);
      throw error;
    }
  }, []);

  const initialize = useCallback(async () => {
    setLoading(true);
    try {
      await syncUserFromSession();
    } finally {
      setLoading(false);
    }
  }, [syncUserFromSession]);

  const login = useCallback(
    async (credentials: LoginData) => {
      setLoading(true);
      try {
        const { token, user: nextUser } = await loginRequest(credentials);
        setUser(nextUser);

        if (!token) {
          await syncUserFromSession();
        }
      } catch (error) {
        clearSessionState();
        setUser(null);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [syncUserFromSession],
  );

  const register = useCallback(
    async (data: RegisterData) => {
      setLoading(true);
      try {
        const { token, user: nextUser } = await registerRequest(data);
        setUser(nextUser);

        if (!token) {
          await syncUserFromSession();
        }
      } catch (error) {
        clearSessionState();
        setUser(null);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [syncUserFromSession],
  );

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await logoutRequest();
    } finally {
      clearSessionState();
      setUser(null);
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const nextUser = await syncUserFromSession();
      setUser(nextUser);
    } finally {
      setLoading(false);
    }
  }, [syncUserFromSession]);

  useEffect(() => {
    initialize().catch((error) => {
      if (import.meta.env.DEV) {
        console.warn("[auth] Failed to initialize session", error);
      }
    });
  }, [initialize]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      login,
      register,
      logout,
      refresh,
    }),
    [loading, login, logout, refresh, register, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return ctx;
};

export const useAuth = () => useAuthContext();

export default AuthContext;
