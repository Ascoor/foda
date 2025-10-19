import { motion } from "framer-motion";
import { useMemo } from "react";
import { Sparkles, Waves } from "lucide-react";
import { useTranslation } from "react-i18next";
import { GlowButton } from "../ui/GlowButton";
import { useFloatingExperienceStore } from "../layout";

export const HeroSection = () => {
  const { t } = useTranslation("floating");
  const { language } = useFloatingExperienceStore();

  const highlightWords = useMemo(
    () => [
      {
        label: language === "ar" ? "ذكاء اصطناعي" : "AI Ready",
        icon: Sparkles,
      },
      { label: language === "ar" ? "شمولية" : "Holistic", icon: Waves },
    ],
    [language],
  );

  return (
    <section
      id="home"
      className="relative mx-auto flex w-[94%] max-w-6xl flex-col items-center justify-center gap-12 pt-20 text-center md:flex-row md:text-left"
    >
      <div className="space-y-8 md:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-slate-600 backdrop-blur-xl dark:bg-slate-900/60 dark:text-slate-200"
        >
          Aurora Election 2025
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.9, ease: "easeOut" }}
          className="text-4xl font-black leading-tight text-slate-900 drop-shadow-sm dark:text-white md:text-6xl"
        >
          <span className="bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-400 bg-clip-text text-transparent">
            {t("heroTitle")}
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.9, ease: "easeOut" }}
          className="text-base leading-relaxed text-slate-600 dark:text-slate-200"
        >
          {t("heroSubtitle")}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.9, ease: "easeOut" }}
          className="flex flex-col items-center gap-4 md:flex-row"
        >
          <GlowButton to="/login">{t("getStarted")}</GlowButton>
          <GlowButton to="/experience" variant="secondary">
            {t("viewDashboard")}
          </GlowButton>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.9, ease: "easeOut" }}
          className="flex flex-wrap items-center justify-center gap-4 md:justify-start"
        >
          {highlightWords.map(({ label, icon: Icon }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/40 px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur-xl dark:bg-slate-900/50 dark:text-slate-100"
            >
              <Icon className="size-4 text-cyan-500" />
              {label}
            </span>
          ))}
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.9, ease: "easeOut" }}
        className="relative hidden h-[520px] w-full max-w-[420px] flex-1 items-center justify-center md:flex"
      >
        <div className="absolute inset-0 rounded-[48px] bg-gradient-to-br from-cyan-300/40 via-purple-300/40 to-pink-300/40 blur-3xl" />
        <div className="relative overflow-hidden rounded-[48px] border border-white/30 bg-white/50 shadow-[0_30px_80px_rgba(59,130,246,0.35)] backdrop-blur-2xl dark:bg-slate-900/60">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.35),_transparent_55%)]" />
          <div className="relative flex h-full flex-col justify-between p-8">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                Live Insights
              </p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Soft Hills Dashboard
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Layers of floating analytics reveal the momentum behind each
                district.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-left">
              {[
                { label: "Turnout", value: "68%" },
                { label: "Volunteers", value: "920" },
                { label: "Reach", value: "1.4M" },
                { label: "Support", value: "72%" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/30 bg-white/60 p-4 text-slate-700 shadow-inner dark:bg-slate-800/70 dark:text-slate-100"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-2xl font-bold">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
