import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, MailCheck } from "lucide-react";
import { AuthLayout } from "./AuthLayout";
import { Input } from "@/infrastructure/shared/ui/input";
import { Label } from "@/infrastructure/shared/ui/label";
import { Button } from "@/infrastructure/shared/ui/button";
import api from "@/infrastructure/shared/lib/api";

const fieldVariants = {
  initial: { opacity: 0, y: 12, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const canSubmit = email.trim().length > 0 && !loading;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await api.post("/api/auth/forgot-password", { email });
      setSuccess("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني");
    } catch (err) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : "تعذر إرسال البريد الإلكتروني، حاول لاحقاً";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="استعادة كلمة المرور"
      subtitle="أدخل بريدك الإلكتروني وسنرسل لك رابطاً آمناً لإعادة التعيين"
      footer={
        <p>
          تذكرت كلمة المرور؟{" "}
          <Link
            to="/auth/login"
            className="font-semibold text-[hsl(var(--primary))]"
          >
            العودة لتسجيل الدخول
          </Link>
        </p>
      }
    >
      <motion.form
        variants={fieldVariants}
        initial="initial"
        animate="animate"
        transition={{ staggerChildren: 0.05 }}
        className="space-y-6"
        onSubmit={handleSubmit}
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

        {error && (
          <motion.div
            variants={fieldVariants}
            className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            variants={fieldVariants}
            className="flex items-center gap-3 rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-500"
          >
            <MailCheck className="h-4 w-4" />
            {success}
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
                جاري الإرسال...
              </span>
            ) : (
              "إرسال رابط التحقق"
            )}
          </Button>
        </motion.div>
      </motion.form>
    </AuthLayout>
  );
};

export default ForgotPassword;
