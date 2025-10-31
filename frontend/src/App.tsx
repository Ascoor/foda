import { AuthProvider } from "./shared/contexts/AuthContext";
import AppRouter from "./app/router";

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
