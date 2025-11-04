import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { AuthLayout } from "./AuthLayout";
import { Input } from "@/infrastructure/shared/ui/input";
import { Label } from "@/infrastructure/shared/ui/label";
import { Button } from "@/infrastructure/shared/ui/button";
import { useAuth } from "@/infrastructure/shared/contexts/AuthContext";

const fieldVariants = {
  initial: { opacity: 0, y: 12, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const passwordsMatch = password === confirmPassword && password.length >= 8;
  const canSubmit =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    passwordsMatch &&
    !loading;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError(null);

    try {
      await register({
        name,
        email,
        password,
        password_confirmation: confirmPassword,
      });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : "تعذر إنشاء الحساب، يرجى المحاولة مجدداً";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="إنشاء حساب المسؤول"
      subtitle="ابدأ بإدارة المنصة بواجهة واحدة تجمع كل أدواتك التنظيمية"
      footer={
        <p>
          لديك حساب بالفعل؟{" "}
          <Link
            to="/auth/login"
            className="font-semibold text-[hsl(var(--primary))]"
          >
            سجل الدخول الآن
          </Link>
        </p>
      }
    >
      <motion.form
        variants={fieldVariants}
        initial="initial"
        animate="animate"
        transition={{ staggerChildren: 0.05 }}
        className="grid gap-5"
        onSubmit={handleSubmit}
      >
        <motion.div variants={fieldVariants} className="space-y-2 text-start">
          <Label htmlFor="name">الاسم الكامل</Label>
          <Input
            id="name"
            placeholder="الاسم الكامل"
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={loading}
            required
          />
        </motion.div>

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
            autoComplete="new-password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={loading}
            required
          />
          <p className="text-xs text-muted-foreground">
            يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.
          </p>
        </motion.div>

        <motion.div variants={fieldVariants} className="space-y-2 text-start">
          <Label htmlFor="confirm-password">تأكيد كلمة المرور</Label>
          <Input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            disabled={loading}
            required
          />
          {!passwordsMatch && confirmPassword.length > 0 && (
            <span className="text-xs text-destructive">
              كلمة المرور غير متطابقة
            </span>
          )}
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
                جاري إنشاء الحساب...
              </span>
            ) : (
              "تسجيل حساب جديد"
            )}
          </Button>
        </motion.div>
      </motion.form>
    </AuthLayout>
  );
};

export default Register;
