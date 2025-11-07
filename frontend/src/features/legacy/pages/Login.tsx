import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Activity,
  Radar,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";

import { LoginForm } from "@/features/legacy/components/auth/LoginForm";
import { Badge } from "@/infrastructure/shared/ui/badge";
import { cn } from "@/infrastructure/shared/lib/utils";

const backgroundShapes = [
  {
    className:
      "bg-gradient-to-br from-primary/40 via-primary/10 to-transparent blur-3xl",
    initial: { opacity: 0.2, scale: 0.9, x: -120, y: -160 },
    animate: { opacity: 0.45, scale: 1.1, x: -80, y: -100 },
  },
  {
    className:
      "bg-gradient-to-tr from-secondary/50 via-secondary/20 to-transparent blur-3xl",
    initial: { opacity: 0.18, scale: 0.9, x: 140, y: -120 },
    animate: { opacity: 0.4, scale: 1.05, x: 120, y: -60 },
  },
  {
    className:
      "bg-gradient-to-br from-accent/40 via-accent/10 to-transparent blur-3xl",
    initial: { opacity: 0.14, scale: 0.95, x: 60, y: 180 },
    animate: { opacity: 0.35, scale: 1.1, x: 30, y: 160 },
  },
];

const signalIcons = [Activity, Workflow, Radar];

export const Login = () => {
  const { t, i18n } = useTranslation();

  const featureHighlights = useMemo(
    () => [
      {
        icon: ShieldCheck,
        label: t("auth.login_feature_secure"),
      },
      {
        icon: Sparkles,
        label: t("auth.login_feature_realtime"),
      },
      {
        icon: Workflow,
        label: t("auth.login_feature_switch"),
      },
    ],
    [t],
  );

  const direction = i18n.dir();

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(120deg, rgba(79,70,229,0.12), transparent 55%), linear-gradient(300deg, rgba(236,72,153,0.1), transparent 50%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(79,70,229,0.35), transparent 45%), radial-gradient(circle at 80% 15%, rgba(236,72,153,0.28), transparent 50%), radial-gradient(circle at 15% 85%, rgba(16,185,129,0.25), transparent 55%)",
        }}
      />
      {backgroundShapes.map((shape, index) => (
        <motion.div
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          aria-hidden
          className={cn(
            "pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full",
            shape.className,
          )}
          initial={shape.initial}
          animate={shape.animate}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: index * 2.5,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(12,15,35,0.4),transparent_55%)]" />

      <header className="relative z-10 px-6 py-8">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3 text-left">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/30">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
                {t("app.name")}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("app.tagline")}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col justify-center px-6 pb-12">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-12 lg:flex-row lg:items-stretch">
          <motion.section
            dir={direction}
            className="relative flex w-full flex-1 flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-background/70 p-8 shadow-[0_35px_120px_rgba(79,70,229,0.15)] backdrop-blur-xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="space-y-6">
              <Badge
                variant="secondary"
                className="glass inline-flex items-center gap-2 border-white/20 bg-secondary/20 text-xs font-semibold tracking-widest text-secondary-foreground/90"
              >
                <Sparkles className="h-4 w-4" />
                {t("auth.login_badge")}
              </Badge>
              <div className="space-y-4">
                <h1 className="text-balance text-3xl font-semibold text-white drop-shadow-sm sm:text-4xl lg:text-5xl">
                  {t("auth.login_title")}
                </h1>
                <p className="max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
                  {t("auth.login_description")}
                </p>
              </div>

              <div className="grid gap-4 pt-2 sm:grid-cols-2">
                {featureHighlights.map(({ icon: Icon, label }) => (
                  <motion.div
                    key={label}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-background/80 p-4"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="relative flex items-start gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <p className="text-sm font-medium text-foreground/90">
                        {label}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              className="relative mt-10 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-background/70 via-background/40 to-primary/10 p-6"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.25),transparent_55%)]" />
              <div className="relative flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  {signalIcons.map((Icon, index) => (
                    <motion.span
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/70 text-primary"
                      animate={{
                        opacity: [0.6, 1, 0.6],
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 3 + index,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.3,
                      }}
                    >
                      <Icon className="h-5 w-5" />
                    </motion.span>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">
                    {t("auth.login_subtitle")}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t("auth.login_transition_hint")}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.section>

          <motion.section
            className="relative w-full max-w-md flex-1"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            <LoginForm />
          </motion.section>
        </div>
      </main>
    </div>
  );
};

export default Login;
