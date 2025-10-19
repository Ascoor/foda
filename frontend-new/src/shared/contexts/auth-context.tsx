import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { setAuthToken } from "@/shared/api/config";

export type AuthUser = {
  id: string;
  name: string;
  role: "manager" | "volunteer";
  avatar?: string;
  token?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login: (nextUser: AuthUser) => {
        setUser(nextUser);
        if (nextUser.token) {
          setAuthToken(nextUser.token);
          localStorage.setItem("access_token", nextUser.token);
        }
      },
      logout: () => {
        setUser(null);
        setAuthToken(null);
        localStorage.removeItem("access_token");
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};
