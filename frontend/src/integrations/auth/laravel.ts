// src/integrations/auth/laravel.ts
import { request } from "@/infrastructure/shared/lib/api";
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
      const response = await request<LaravelLoginResponse>({
        url: "/auth/login",
        method: "post",
        data: {
          email,
          password,
          remember,
        },
      });

      const { token, user } = response ?? {};

      return {
        token,
        user,
      } satisfies AuthResult;
    },
    async logout() {
      await request({
        url: "/auth/logout",
        method: "post",
      });
    },
    async register(data) {
      const response = await request<LaravelRegisterResponse>({
        url: "/auth/register",
        method: "post",
        data,
      });
      const payload = response?.data ?? {};

      return {
        token: payload.token,
        user: payload.user,
      } satisfies AuthResult;
    },
    async refresh() {
      const response = await request<LaravelAuthUser>({
        url: "/auth/me",
        method: "get",
      });
      return {
        user: response,
      } satisfies AuthResult;
    },
  };
}
