import { LoginForm } from "@/features/legacy/components/auth/LoginForm";

// Standalone login page that centers the login card
export const Login = () => (
  <div className="relative min-h-screen overflow-hidden bg-background">
    <div
      aria-hidden
      className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20"
    />
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-40"
      style={{
        backgroundImage:
          "radial-gradient(circle at 20% 20%, rgba(79, 70, 229, 0.25), transparent 45%), radial-gradient(circle at 80% 30%, rgba(236, 72, 153, 0.25), transparent 50%), radial-gradient(circle at 50% 80%, rgba(16, 185, 129, 0.2), transparent 55%)",
      }}
    />
    <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16">
      <LoginForm />
    </div>
  </div>
);

export default Login;
