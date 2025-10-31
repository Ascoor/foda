import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { toast } from "sonner";

import { router } from "@app/routes";
import { request, setAuthToken } from "@/shared/lib/api";

interface LegacyLoginParams {
  email: string;
  password: string;
  remember?: boolean;
}

export interface AuthUser {
  id: number | string;
  name: string;
  email: string;
  roles?: string[] | null;
  last_login_at?: string | null;
  status?: string | null;
}

interface AuthSession {
  token: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: AuthSession | null;
  profile: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string, remember?: boolean) => Promise<void>;
  login: (params: LegacyLoginParams) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

interface LoginResponse {
  token: string;
  user: AuthUser;
}

const STORAGE_TOKEN_KEY = "auth:token";
const STORAGE_USER_KEY = "auth:user";
const STORAGE_REMEMBER_KEY = "auth:remember";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const NewAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const persistAuthState = (token: string, userData: AuthUser) => {
    setAuthToken(token);
    setSession({ token });
    setUser(userData);
    setProfile(userData);

    try {
      localStorage.setItem(STORAGE_TOKEN_KEY, token);
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userData));
    } catch {
      // Ignore storage errors to keep behaviour consistent across environments.
    }
  };

  const clearAuthState = () => {
    setAuthToken(null);
    setSession(null);
    setUser(null);
    setProfile(null);

    try {
      localStorage.removeItem(STORAGE_TOKEN_KEY);
      localStorage.removeItem(STORAGE_USER_KEY);
    } catch {
      // Ignore storage errors to align with legacy resilience.
    }
  };

  const fetchProfile = async () => {
    const data = await request<AuthUser>({
      url: "/me",
      method: "get",
    });

    setUser(data);
    setProfile(data);

    try {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(data));
    } catch {
      // Ignore storage errors.
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem(STORAGE_TOKEN_KEY);

        if (!storedToken) {
          setLoading(false);
          return;
        }

        setAuthToken(storedToken);
        setSession({ token: storedToken });

        const cachedUser = localStorage.getItem(STORAGE_USER_KEY);
        if (cachedUser) {
          try {
            const parsed = JSON.parse(cachedUser) as AuthUser;
            setUser(parsed);
            setProfile(parsed);
          } catch {
            localStorage.removeItem(STORAGE_USER_KEY);
          }
        }

        await fetchProfile();
      } catch (error) {
        console.error("Failed to restore authentication state", error);
        clearAuthState();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth().catch((error) => {
      console.error("Unexpected error during auth initialization", error);
      setLoading(false);
    });
  }, []);

  const signIn = async (
    email: string,
    password: string,
    remember = false,
  ) => {
    setLoading(true);
    try {
      const response = await request<LoginResponse>({
        url: "/login",
        method: "post",
        data: { email, password, remember },
      });

      persistAuthState(response.token, response.user);

      if (remember) {
        try {
          localStorage.setItem(STORAGE_REMEMBER_KEY, "true");
        } catch {
          // Ignore storage errors; remember is best-effort only.
        }
      } else {
        try {
          localStorage.removeItem(STORAGE_REMEMBER_KEY);
        } catch {
          // Ignore storage errors to keep behaviour consistent.
        }
      }

      toast.success("تم تسجيل الدخول بنجاح");
      void router.navigate("/campaigns/gateway");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "فشل تسجيل الدخول");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async ({ email, password, remember }: LegacyLoginParams) => {
    await signIn(email, password, remember);

    if (!remember) {
      try {
        localStorage.removeItem(STORAGE_REMEMBER_KEY);
      } catch {
        // Ignore storage errors to mimic legacy tolerance.
      }
    }
  };

  const signUp = async (_email: string, _password: string, _fullName: string) => {
    toast.error("التسجيل الذاتي غير متاح. يرجى التواصل مع المسؤول.");
    throw new Error("Self-service registration is disabled");
  };

  const signOut = async () => {
    try {
      await request({
        url: "/logout",
        method: "post",
      });
    } catch (error: any) {
      console.error("Failed to log out from backend", error);
    } finally {
      clearAuthState();
      toast.success("تم تسجيل الخروج");
      void router.navigate("/login");
    }
  };

  const logout = async () => {
    await signOut();
    try {
      localStorage.removeItem(STORAGE_REMEMBER_KEY);
    } catch {
      // Ignore storage errors for resilience.
    }
  };

  const refreshProfile = async () => {
    if (!session?.token) {
      return;
    }

    try {
      await fetchProfile();
    } catch (error) {
      console.error("Failed to refresh profile", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isAuthenticated: Boolean(user && session?.token),
        signIn,
        login,
        signUp,
        signOut,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useNewAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useNewAuth must be used within a NewAuthProvider");
  }
  return context;
};

export { NewAuthProvider as AuthProvider, useNewAuth as useAuth };
