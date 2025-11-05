import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/infrastructure/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/infrastructure/shared/ui/card";
import { Checkbox } from "@/infrastructure/shared/ui/checkbox";
import { Input } from "@/infrastructure/shared/ui/input";
import { Label } from "@/infrastructure/shared/ui/label";
import { useAuth } from "@/infrastructure/shared/contexts/AuthContext";
import { Loader2 } from "lucide-react";

/**
 * Reusable login form component.
 * Shows validation errors and redirects to dashboard on success.
 */
export const LoginForm = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate(); // تم استخدام navigate هنا
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const direction = i18n.dir();

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isPasswordValid = password.trim().length >= 6; // Example of more complex password validation.
  const canSubmit = isEmailValid && isPasswordValid && !loading;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      await login({ email, password, remember });
      navigate("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error && err.message.trim()) {
        setError(err.message);
      } else {
        setError(t("auth.unknown_error"));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      if (!isEmailValid) {
        document.getElementById("email")?.focus();
      } else if (!isPasswordValid) {
        document.getElementById("password")?.focus();
      }
    }
  }, [error, isEmailValid, isPasswordValid]);

  useEffect(() => {
    document.getElementById("email")?.focus();
  }, []);

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-md"
      aria-busy={loading}
      aria-live="polite"
      noValidate
    >
      <Card
        data-login-card
        dir={direction}
        className="relative overflow-hidden border border-primary/30 bg-background/80 shadow-[0_25px_60px_rgba(79,70,229,0.15)] backdrop-blur-xl"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/20"
        />
        <CardHeader className="relative space-y-4 text-center">
          <div
            className={`${loading ? "opacity-100" : "opacity-0"} h-1 w-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent transition-opacity duration-300`}
            aria-hidden
          />
          <CardTitle className="text-3xl font-bold text-gradient-primary">
            {t("auth.login")}
          </CardTitle>
          <CardDescription className="text-base">
            {t("auth.login_subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent className="relative space-y-5">
          <p className="sr-only">{loading ? t("common.loading") : ""}</p>
          {error && (
            <div
              role="alert"
              className="rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-foreground"
            >
              {t("auth.email")}
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              aria-invalid={email.length > 0 && !isEmailValid}
              aria-describedby="email-help"
              autoComplete="email"
              placeholder={t("auth.email_placeholder") ?? ""}
              inputMode="email"
              dir="ltr"
            />
            <span
              id="email-help"
              className="block text-xs text-muted-foreground"
            >
              {!isEmailValid && email.length > 0
                ? t("auth.email_invalid")
                : "\u00A0"}
            </span>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-foreground"
            >
              {t("auth.password")}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
              placeholder={t("auth.password_placeholder") ?? ""}
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              checked={remember}
              onCheckedChange={(value) => setRemember(value === true)}
              disabled={loading}
            />
            <Label htmlFor="remember" className="text-sm text-foreground">
              {t("auth.remember_me")}
            </Label>
          </div>
        </CardContent>
        <CardFooter className="relative flex flex-col gap-3">
          <Button
            type="submit"
            className="w-full bg-gradient-primary text-white shadow-lg shadow-primary/20"
            disabled={!canSubmit}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("common.loading")}
              </span>
            ) : (
              t("auth.login")
            )}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            {t("app.tagline")}
          </p>
        </CardFooter>
      </Card>
    </form>
  );
};

export default LoginForm;
