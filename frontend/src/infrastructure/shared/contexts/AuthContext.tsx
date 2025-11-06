import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { isAxiosError } from "axios";
import { auth, AUTH_BACKEND } from "@/integrations/auth";
import { supabase } from "@/integrations/supabase/client";
import { setAuthToken } from "@/infrastructure/shared/lib/api";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

const isBrowser = typeof window !== "undefined";

type LaravelAuthUser = {
  id: string | number;
  name?: string | null;
  email?: string | null;
  roles?: (string | { name?: string | null })[] | null;
  [key: string]: unknown;
};

export interface Role {
  id?: number | string;
  name: string;
  guard_name?: string;
  [key: string]: unknown;
}

export interface User {
  id: string;
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
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const convertSupabaseUser = (supabaseUser: SupabaseUser): User => {
  const fallbackName =
    supabaseUser.email?.split("@")[0] ?? supabaseUser.id ?? "User";

  return {
    id: supabaseUser.id,
    name:
      typeof supabaseUser.user_metadata?.full_name === "string" &&
      supabaseUser.user_metadata.full_name.trim().length > 0
        ? supabaseUser.user_metadata.full_name
        : fallbackName,
    email: supabaseUser.email ?? "",
    roles: [],
    roleNames: [],
  };
};

const extractLaravelRoleNames = (
  roles?: LaravelAuthUser["roles"],
): string[] => {
  if (!roles) return [];

  const names: string[] = [];
  for (const role of roles) {
    if (typeof role === "string" && role.trim()) {
      names.push(role);
    } else if (
      role &&
      typeof role === "object" &&
      "name" in role &&
      typeof role.name === "string" &&
      role.name.trim()
    ) {
      names.push(role.name);
    }
  }

  return names;
};

const convertLaravelUser = (laravelUser: LaravelAuthUser): User => {
  const { id, name, email, roles, ...rest } = laravelUser;
  const roleNames = extractLaravelRoleNames(roles);

  const resolvedName =
    typeof name === "string" && name.trim().length > 0
      ? name
      : typeof email === "string" && email
        ? email.split("@")[0] ?? "User"
        : "User";

  return {
    id: String(id),
    name: resolvedName,
    email: typeof email === "string" ? email : "",
    roles: roleNames.map((roleName) => ({ name: roleName })),
    roleNames,
    ...rest,
  };
};

const extractMessageFromPayload = (payload: unknown): string | null => {
  if (!payload) {
    return null;
  }

  if (typeof payload === "string" && payload.trim()) {
    return payload;
  }

  if (typeof payload !== "object") {
    return null;
  }

  if (
    "message" in payload &&
    typeof (payload as { message?: unknown }).message === "string" &&
    (payload as { message: string }).message.trim()
  ) {
    return (payload as { message: string }).message;
  }

  if (
    "error" in payload &&
    typeof (payload as { error?: unknown }).error === "string" &&
    (payload as { error: string }).error.trim()
  ) {
    return (payload as { error: string }).error;
  }

  if ("errors" in payload) {
    const { errors } = payload as { errors?: Record<string, unknown> };
    if (errors && typeof errors === "object") {
      for (const value of Object.values(errors)) {
        if (Array.isArray(value)) {
          const message = value.find(
            (entry): entry is string => typeof entry === "string" && entry.trim().length > 0,
          );
          if (message) return message;
        } else if (typeof value === "string" && value.trim()) {
          return value;
        }
      }
    }
  }

  return null;
};

const normalizeAuthError = (error: unknown, fallback: string): Error => {
  if (isAxiosError(error)) {
    const message =
      extractMessageFromPayload(error.response?.data) ??
      extractMessageFromPayload((error.response?.data as { data?: unknown })?.data) ??
      error.message;

    if (message && message.trim()) {
      return new Error(message);
    }
  }

  if (error instanceof Error) {
    return error;
  }

  if (typeof error === "string" && error.trim()) {
    return new Error(error);
  }

  return new Error(fallback);
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
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const isSupabaseBackend = AUTH_BACKEND === "supabase";

  const persistToken = useCallback((token: string | null) => {
    setAuthToken(token ?? null);
    if (!isBrowser) return;

    if (token && token.trim()) {
      window.localStorage.setItem("token", token);
    } else {
      window.localStorage.removeItem("token");
    }
  }, []);

  const login = useCallback(
    async (credentials: LoginData) => {
      setLoading(true);
      try {
        const result = await auth.login(credentials);

        if (isSupabaseBackend) {
          persistToken(null);
          const supabaseSession = (result.session as Session | null) ?? null;
          const supabaseUser = result.user as SupabaseUser | undefined;
          setSession(supabaseSession);
          setUser(supabaseUser ? convertSupabaseUser(supabaseUser) : null);
        } else {
          persistToken(result.token ?? null);
          const laravelUser = result.user as LaravelAuthUser | undefined;
          setSession(null);
          setUser(laravelUser ? convertLaravelUser(laravelUser) : null);
        }
      } catch (error) {
        console.error("Login error:", error);
        throw normalizeAuthError(error, "Unable to login. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [isSupabaseBackend, persistToken],
  );

  const register = useCallback(
    async (data: RegisterData) => {
      if (!auth.register) {
        throw new Error("Registration is not supported in this environment.");
      }

      setLoading(true);
      try {
        const result = await auth.register(data);

        if (isSupabaseBackend) {
          persistToken(null);
          const supabaseSession = (result.session as Session | null) ?? null;
          const supabaseUser = result.user as SupabaseUser | undefined;
          setSession(supabaseSession);
          setUser(supabaseUser ? convertSupabaseUser(supabaseUser) : null);
        } else {
          persistToken(result.token ?? null);
          const laravelUser = result.user as LaravelAuthUser | undefined;
          setSession(null);
          setUser(laravelUser ? convertLaravelUser(laravelUser) : null);
        }
      } catch (error) {
        console.error("Registration error:", error);
        throw normalizeAuthError(error, "Unable to complete registration.");
      } finally {
        setLoading(false);
      }
    },
    [isSupabaseBackend, persistToken],
  );

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await auth.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      persistToken(null);
      setUser(null);
      setSession(null);
      setLoading(false);
    }
  }, [persistToken]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      if (isSupabaseBackend) {
        const result = (await auth.refresh?.()) ?? {};
        const supabaseSession = (result.session as Session | null) ?? null;
        setSession(supabaseSession);
        const supabaseUser = supabaseSession?.user as SupabaseUser | undefined;
        setUser(supabaseUser ? convertSupabaseUser(supabaseUser) : null);
      } else if (auth.refresh) {
        const result = await auth.refresh();
        const laravelUser = result.user as LaravelAuthUser | undefined;
        setSession(null);
        setUser(laravelUser ? convertLaravelUser(laravelUser) : null);
        if (result.token) {
          persistToken(result.token);
        }
      }
    } catch (error) {
      console.error("Refresh error:", error);
      if (!isSupabaseBackend) {
        persistToken(null);
        setUser(null);
      }
    } finally {
      if (!isSupabaseBackend) {
        setSession(null);
      }
      setLoading(false);
    }
  }, [isSupabaseBackend, persistToken]);

  useEffect(() => {
    if (isSupabaseBackend) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_, currentSession) => {
        setSession(currentSession);
        setUser(
          currentSession?.user
            ? convertSupabaseUser(currentSession.user)
            : null,
        );
      });

      supabase.auth
        .getSession()
        .then(({ data: { session: currentSession } }) => {
          setSession(currentSession);
          setUser(
            currentSession?.user
              ? convertSupabaseUser(currentSession.user)
              : null,
          );
        })
        .catch((error) => {
          console.error("Failed to restore Supabase session:", error);
          setUser(null);
          setSession(null);
        })
        .finally(() => {
          setLoading(false);
        });

      return () => subscription.unsubscribe();
    }

    let isMounted = true;

    const restoreLaravelSession = async () => {
      const storedToken = isBrowser ? window.localStorage.getItem("token") : null;

      if (!storedToken) {
        if (isMounted) {
          persistToken(null);
          setUser(null);
          setSession(null);
          setLoading(false);
        }
        return;
      }

      persistToken(storedToken);

      if (!auth.refresh) {
        if (isMounted) {
          setSession(null);
          setLoading(false);
        }
        return;
      }

      try {
        const result = await auth.refresh();
        if (!isMounted) return;
        const laravelUser = result.user as LaravelAuthUser | undefined;
        setUser(laravelUser ? convertLaravelUser(laravelUser) : null);
        if (result.token) {
          persistToken(result.token);
        }
      } catch (error) {
        console.error("Failed to restore Laravel session:", error);
        persistToken(null);
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setSession(null);
          setLoading(false);
        }
      }
    };

    restoreLaravelSession();

    return () => {
      isMounted = false;
    };
  }, [isSupabaseBackend, persistToken]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      session,
      isAuthenticated: Boolean(user),
      loading,
      login,
      register,
      logout,
      refresh,
    }),
    [loading, login, logout, refresh, register, session, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useAuthContext();

export default AuthContext;