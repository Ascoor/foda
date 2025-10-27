export interface Role {
  id?: number | string;
  name: string;
  guard_name?: string;
  [key: string]: unknown;
}

export interface User {
  id: number | string;
  name: string;
  email: string;
  roles?: Role[];
  roleNames?: string[];
  [key: string]: unknown;
}

export interface LoginData {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation?: string;
  [key: string]: unknown;
}

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}
