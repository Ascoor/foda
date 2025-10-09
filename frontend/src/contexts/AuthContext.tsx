import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import api, { setAuthToken } from '@/lib/api';

interface Role {
  id?: number;
  name: string;
  guard_name?: string;
  [key: string]: unknown;
}

interface Permission {
  id?: number;
  name: string;
  [key: string]: unknown;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  roles: Role[];
  permissions?: Permission[];
  roleNames: string[];
  [key: string]: unknown;
}

interface AuthContextType {
  token: string | null;
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<AuthUser | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getTokenFromStorage = () =>
  (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

const normalizeUser = (payload: unknown): AuthUser => {
  const raw =
    (payload as Record<string, unknown>)?.data ??
    (payload as Record<string, unknown>)?.user ??
    payload;

  if (!raw || typeof raw !== 'object') {
    throw new Error('Invalid user payload received from API');
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
  } as AuthUser;
};

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
  const [token, setToken] = useState<string | null>(() => getTokenFromStorage());
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const [isFetchingUser, setIsFetchingUser] = useState(false);

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  const persistToken = useCallback((value: string | null) => {
    if (typeof window === 'undefined') return;
    if (value) {
      localStorage.setItem('token', value);
    } else {
      localStorage.removeItem('token');
    }
  }, []);

  const clearSession = useCallback(() => {
    setToken(null);
    setUser(null);
    persistToken(null);
    setAuthToken(null);
  }, [persistToken]);

  const fetchUser = useCallback(
    async (overrideToken?: string | null): Promise<AuthUser | null> => {
      const activeToken =
        overrideToken ?? token ?? getTokenFromStorage();

      if (!activeToken) {
        setUser(null);
        return null;
      }

      setAuthToken(activeToken);
      const response = await api.get('/me');
      const nextUser = normalizeUser(response.data);
      setUser(nextUser);
      return nextUser;
    },
    [token],
  );

  const login = useCallback(
    async (email: string, password: string) => {
      setIsFetchingUser(true);
      try {
        const response = await api.post('/login', { email, password });
        const body = response.data;
        const newToken: string | undefined =
          body?.token ||
          body?.access_token ||
          body?.data?.token ||
          body?.data?.access_token;

        if (!newToken) {
          throw new Error('Missing token in login response');
        }

        setToken(newToken);
        persistToken(newToken);
        await fetchUser(newToken);
      } catch (error) {
        clearSession();
        throw error;
      } finally {
        setIsFetchingUser(false);
        setIsCheckingToken(false);
      }
    },
    [clearSession, fetchUser, persistToken],
  );

  const logout = useCallback(async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Failed to revoke token during logout', error);
    } finally {
      clearSession();
      setIsCheckingToken(false);
    }
  }, [clearSession]);

  const refresh = useCallback(async () => {
    if (!token) {
      return null;
    }
    setIsFetchingUser(true);
    try {
      return await fetchUser();
    } catch (error) {
      clearSession();
      throw error;
    } finally {
      setIsFetchingUser(false);
    }
  }, [clearSession, fetchUser, token]);

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      if (!token) {
        if (isMounted) {
          setUser(null);
          setIsCheckingToken(false);
        }
        return;
      }

      setIsFetchingUser(true);
      try {
        await fetchUser(token);
      } catch (error) {
        console.error('Failed to bootstrap user session', error);
        clearSession();
      } finally {
        if (isMounted) {
          setIsFetchingUser(false);
          setIsCheckingToken(false);
        }
      }
    };

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, [clearSession, fetchUser, token]);

  const value = useMemo<AuthContextType>(
    () => ({
      token,
      user,
      loading: isCheckingToken || isFetchingUser,
      login,
      logout,
      refresh,
    }),
    [isCheckingToken, isFetchingUser, login, logout, refresh, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
