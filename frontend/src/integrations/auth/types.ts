// src/integrations/auth/types.ts
export interface AuthInterface {
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  register?: (data: any) => Promise<void>;
  refresh?: () => Promise<void>;
}
