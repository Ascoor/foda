// src/integrations/auth/laravel.ts
import axios from "axios";
import type { AuthInterface } from "./types";

const api = axios.create({
  baseURL: import.meta.env.VITE_LARAVEL_API_URL,
  withCredentials: true,
});

export function importLaravelAuth(): AuthInterface {
  return {
    async login({ email, password }) {
      await api.post("/login", { email, password });
    },
    async logout() {
      await api.post("/logout");
    },
    async register(data) {
      await api.post("/register", data);
    },
    async refresh() {
      await api.get("/user");
    }
  };
}
