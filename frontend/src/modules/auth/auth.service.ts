import api, { setAuthToken } from "@shared/lib/api";

import type { LoginData, RegisterData, User } from "./auth.types";
import { extractToken, normalizeUser } from "./auth.transforms";
import { clearStoredToken, getStoredToken, setStoredToken } from "./token-storage";

export const applySessionToken = (token: string | null) => {
  setAuthToken(token);
  setStoredToken(token);
};

export const clearSessionState = () => {
  setAuthToken(null);
  clearStoredToken();
};

export const bootstrapSession = async (
  token?: string | null,
): Promise<User | null> => {
  const activeToken = token ?? getStoredToken();

  if (!activeToken) {
    clearSessionState();
    return null;
  }

  applySessionToken(activeToken);

  try {
    const response = await api.get("/api/v1/me");
    return normalizeUser(response.data);
  } catch (error) {
    clearSessionState();
    throw error;
  }
};

export const login = async (
  credentials: LoginData,
): Promise<{ token: string | null; user: User }> => {
  const response = await api.post("/api/v1/login", credentials);
  const token = extractToken(response.data);

  if (token) {
    applySessionToken(token);
  }

  const user = normalizeUser(response.data);

  return { token: token ?? null, user };
};

export const register = async (
  data: RegisterData,
): Promise<{ token: string | null; user: User }> => {
  const response = await api.post("/api/v1/register", data);
  const token = extractToken(response.data);

  if (token) {
    applySessionToken(token);
  }

  const user = normalizeUser(response.data);

  return { token: token ?? null, user };
};

export const logout = async (): Promise<void> => {
  try {
    await api.post("/api/v1/logout");
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("[auth] Failed to call logout endpoint", error);
    }
  } finally {
    clearSessionState();
  }
};
