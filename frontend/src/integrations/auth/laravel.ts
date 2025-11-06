// src/integrations/auth/laravel.ts
import api from "@/infrastructure/shared/lib/api";
import type { AuthInterface, AuthResult } from "./types";

interface LaravelAuthUser {
  id: string | number;
  name?: string | null;
  email?: string | null;
  roles?: (string | { name?: string | null })[] | null;
  [key: string]: unknown;
}

interface LaravelLoginResponse {
  token?: string;
  user?: LaravelAuthUser;
}

interface LaravelRegisterResponse {
  status?: string;
  data?: {
    token?: string;
    user?: LaravelAuthUser;
  };
}

export function importLaravelAuth(): AuthInterface {
  return {
    async login({ email, password, remember }) {
      const response = await api.post<LaravelLoginResponse>("/login", {
        email,
        password,
        remember,
      });

      const { token, user } = response.data ?? {};

      return {
        token,
        user,
      } satisfies AuthResult;
    },
    async logout() {
      await api.post("/logout");
    },
    async register(data) {
      const response = await api.post<LaravelRegisterResponse>("/register", data);
      const payload = response.data?.data ?? {};

      return {
        token: payload.token,
        user: payload.user,
      } satisfies AuthResult;
    },
    async refresh() {
      const response = await api.get<LaravelAuthUser>("/me");
      return {
        user: response.data,
      } satisfies AuthResult;
    },
  };
}
