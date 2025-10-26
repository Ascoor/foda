import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Logo } from "@shared/ui";
import { useAuth } from "@shared/hooks";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")?.toString() ?? "";
    const password = formData.get("password")?.toString() ?? "";

    if (!email || !password) {
      setError(t("login.requiredFields"));
      return;
    }

    setError(undefined);
    setIsSubmitting(true);
    const remember = formData.get("remember") === "on";

    try {
      await login({ email, password, remember });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("login.unknownError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-white to-slate-100 dark:from-background-dark dark:via-slate-900 dark:to-slate-950 lg:flex-row">
      <div className="flex flex-1 flex-col justify-center gap-8 p-8 text-slate-900 dark:text-slate-100">
        <Logo className="text-2xl" />
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">{t("login.title")}</h1>
          <p className="max-w-md text-lg text-slate-600 dark:text-slate-300">{t("login.subtitle")}</p>
        </div>
        <div className="hidden rounded-3xl bg-primary/10 p-8 text-primary shadow-lg lg:block">
          <p className="text-lg font-semibold">"Every conversation moves us closer to victory."</p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-white/80 p-8 backdrop-blur dark:bg-slate-900/70">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-950"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300" htmlFor="email">
              {t("login.email")}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40 dark:border-slate-700 dark:bg-slate-900"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300" htmlFor="password">
              {t("login.password")}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40 dark:border-slate-700 dark:bg-slate-900"
              disabled={isSubmitting}
            />
          </div>

          {error && <p className="text-sm text-red-500" role="alert">{error}</p>}

          <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="remember"
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                disabled={isSubmitting}
              />
              {t("login.rememberMe")}
            </label>
            <a className="font-medium text-primary hover:text-primary/80" href="#">
              {t("login.forgotPassword")}
            </a>
          </div>

          <Button type="submit" className="w-full rounded-xl text-base" disabled={isSubmitting}>
            {isSubmitting ? t("login.loading") : t("login.signin")}
          </Button>

          <p className="text-center text-xs text-slate-400">{t("login.noAccount")}</p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
