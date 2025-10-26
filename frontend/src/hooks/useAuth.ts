import { useAuth } from "@/contexts/AuthContext";

export const useAuthenticatedUser = () => {
  const { user, isAuthenticated } = useAuth();
  return { user, isAuthenticated };
};

export { useAuth };

