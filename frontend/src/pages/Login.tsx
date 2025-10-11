import { LoginForm } from '@/components/auth/LoginForm';

// Standalone login page that centers the login card
export const Login = () => (
  <div
    data-barba="container"
    data-barba-namespace="login"
    className="min-h-screen flex items-center justify-center bg-background"
  >
    <LoginForm />
  </div>
);


export default Login;
