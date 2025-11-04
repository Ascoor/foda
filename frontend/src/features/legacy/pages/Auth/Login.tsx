import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { AuthLayout } from "./AuthLayout";
import { Input } from "@/infrastructure/shared/ui/input";
import { Label } from "@/infrastructure/shared/ui/label";
import { Button } from "@/infrastructure/shared/ui/button";
import { Checkbox } from "@/infrastructure/shared/ui/checkbox";
import { useAuth } from "@/infrastructure/shared/contexts/AuthContext";

const fieldVariants = {
  initial: { opacity: 0, y: 12, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canSubmit = email.trim().length > 0 && password.length >= 6 && !loading;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError(null);

    try {
      await login({ email, password, remember });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : "تعذر تسجيل الدخول، حاول مرة أخرى";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="مرحباً بعودتك"
      subtitle="سجل الدخول لمتابعة لوحة التحكم والتحليلات الذكية"
      footer={
        <p>
          لا تملك حساباً؟{" "}
          <Link
            to="/auth/register"
            className="font-semibold text-[hsl(var(--primary))]"
          >
            إنشاء حساب جديد
          </Link>
        </p>
      }
    >
      <motion.form
        variants={fieldVariants}
        initial="initial"
        animate="animate"
        transition={{ staggerChildren: 0.05 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <motion.div variants={fieldVariants} className="space-y-2 text-start">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="name@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={loading}
            required
          />
        </motion.div>

        <motion.div variants={fieldVariants} className="space-y-2 text-start">
          <Label htmlFor="password">كلمة المرور</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={loading}
            required
          />
        </motion.div>

        <motion.div
          variants={fieldVariants}
          className="flex flex-wrap items-center justify-between gap-3 text-sm"
        >
          <label className="flex items-center gap-2">
            <Checkbox
              id="remember"
              checked={remember}
              onCheckedChange={(checked) => setRemember(checked === true)}
              disabled={loading}
            />
            <span>تذكرني لاحقاً</span>
          </label>
          <Link
            to="/auth/forgot-password"
            className="font-medium text-[hsl(var(--primary))]"
          >
            نسيت كلمة المرور؟
          </Link>
        </motion.div>

        {error && (
          <motion.div
            variants={fieldVariants}
            className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {error}
          </motion.div>
        )}

        <motion.div variants={fieldVariants}>
          <Button
            type="submit"
            disabled={!canSubmit}
            className="w-full rounded-2xl bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] py-3 text-base font-semibold shadow-lg shadow-[hsla(var(--primary)/0.35)] transition-all duration-200 hover:shadow-xl"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                جاري تسجيل الدخول...
              </span>
            ) : (
              "تسجيل الدخول"
            )}
          </Button>
        </motion.div>
      </motion.form>
    </AuthLayout>
  );
};

export default Login;
