export const TOKEN_STORAGE_KEY = "token";

const hasWindow = () => typeof window !== "undefined";

export const getStoredToken = (): string | null => {
  if (!hasWindow()) {
    return null;
  }
  try {
    return window.localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("[auth] Failed to read token from storage", error);
    }
    return null;
  }
};

export const setStoredToken = (token: string | null) => {
  if (!hasWindow()) {
    return;
  }
  try {
    if (token) {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("[auth] Failed to persist token", error);
    }
  }
};

export const clearStoredToken = () => setStoredToken(null);
