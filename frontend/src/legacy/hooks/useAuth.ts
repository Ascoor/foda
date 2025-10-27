import { AuthProvider, useAuth } from "@modules/auth";

export const useAuthenticatedUser = () => {
  const { user, isAuthenticated } = useAuth();
  return { user, isAuthenticated };
};

export { useAuth, AuthProvider };
