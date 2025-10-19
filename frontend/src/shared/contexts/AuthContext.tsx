import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import api, { setAuthToken } from "@shared/lib/api";

export interface Role {
  id?: number | string;
  name: string;
  guard_name?: string;
  [key: string]: unknown;
}

export interface User {
  id: number | string;
  name: string;
  email: string;
  roles?: Role[];
  roleNames?: string[];
  [key: string]: unknown;
}

export interface LoginData {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation?: string;
  [key: string]: unknown;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const TOKEN_STORAGE_KEY = "token";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getStoredToken = () =>
  (typeof window !== "undefined" ? localStorage.getItem(TOKEN_STORAGE_KEY) : null);

const persistToken = (token: string | null) => {
  if (typeof window === "undefined") {
    return;
  }

  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
};

const extractToken = (payload: unknown): string | null => {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const candidate =
    (payload as Record<string, unknown>).token ||
    (payload as Record<string, unknown>).access_token ||
    (payload as Record<string, unknown>).authToken ||
    (payload as Record<string, unknown>).data;

  if (typeof candidate === "string") {
    return candidate;
  }

  if (candidate && typeof candidate === "object") {
    return (
      (candidate as Record<string, unknown>).token as string | undefined ??
      ((candidate as Record<string, unknown>).access_token as string | undefined)
    ) ?? null;
  }

  return null;
};

const normalizeUser = (payload: unknown): User => {
  const raw =
    (payload as Record<string, unknown>)?.data ??
    (payload as Record<string, unknown>)?.user ??
    payload;

  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid user payload received from API");
  }

  const rawRoles = Array.isArray((raw as Record<string, unknown>).roles)
    ? ((raw as Record<string, unknown>).roles as Role[])
    : [];

  const roles = rawRoles.map((role) => ({
    ...role,
    name: String(role?.name ?? role),
  }));

  return {
    ...(raw as Record<string, unknown>),
    roles,
    roleNames: roles.map((role) => role.name),
  } as User;
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return ctx;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    setUser(null);
    persistToken(null);
    setAuthToken(null);
  }, []);

  const bootstrapUser = useCallback(
    async (token?: string | null) => {
      const activeToken = token ?? getStoredToken();

      if (!activeToken) {
        clearSession();
        return;
      }

      setAuthToken(activeToken);

      try {
        const response = await api.get("/api/v1/me");
        const nextUser = normalizeUser(response.data);
        setUser(nextUser);
      } catch (error) {
        console.error("Failed to fetch authenticated user", error);
        clearSession();
        throw error;
      }
    },
    [clearSession],
  );

  const login = useCallback(
    async (credentials: LoginData) => {
      setLoading(true);
      try {
        const response = await api.post("/api/v1/login", credentials);
        const token = extractToken(response.data);
        if (token) {
          setAuthToken(token);
          persistToken(token);
        }

        const nextUser = normalizeUser(response.data);
        setUser(nextUser);

        if (!token) {
          await bootstrapUser();
        }
      } catch (error) {
        clearSession();
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [bootstrapUser, clearSession],
  );

  const register = useCallback(
    async (data: RegisterData) => {
      setLoading(true);
      try {
        const response = await api.post("/api/v1/register", data);
        const token = extractToken(response.data);

        if (token) {
          setAuthToken(token);
          persistToken(token);
        }

        const nextUser = normalizeUser(response.data);
        setUser(nextUser);

        if (!token) {
          await bootstrapUser();
        }
      } catch (error) {
        clearSession();
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [bootstrapUser, clearSession],
  );

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await api.post("/api/v1/logout");
    } catch (error) {
      console.warn("Failed to call logout endpoint", error);
    } finally {
      clearSession();
      setLoading(false);
    }
  }, [clearSession]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      await bootstrapUser();
    } finally {
      setLoading(false);
    }
  }, [bootstrapUser]);

  useEffect(() => {
    const initialize = async () => {
      try {
        await bootstrapUser();
      } finally {
        setLoading(false);
      }
    };

    void initialize();
  }, [bootstrapUser]);

  const value = useMemo<AuthContextType>(
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

export const useAuth = () => useAuthContext();

export default AuthContext;
