// src/integrations/auth/types.ts

export interface AuthCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export type RegisterPayload = Record<string, unknown>;

export interface AuthResult {
  user?: unknown;
  session?: unknown;
  token?: string;
}

export interface AuthInterface {
  login: (data: AuthCredentials) => Promise<AuthResult>;
  logout: () => Promise<void>;
  register?: (data: RegisterPayload) => Promise<AuthResult>;
  refresh?: () => Promise<AuthResult>;
}
