import { http } from "./http";

export type Membership = {
  scopeType: "area" | "campaign";
  scopeId: number;
  role: "admin" | "manager" | "viewer";
};

export type Me = {
  id: number;
  name: string;
  email: string;
  memberships: Membership[];
};

export const authApi = {
  login: (dto: { email: string; password: string }) =>
    http.post<{ token: string }>("/auth/login", dto).then((r) => r.data),
  me: () => http.get<Me>("/auth/me").then((r) => r.data),
  logout: () => http.post("/auth/logout", {}).then((r) => r.data),
  refresh: () => http.post<{ token: string }>("/auth/refresh", {}).then((r) => r.data),
};
