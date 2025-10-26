import { motion } from "framer-motion";
import { Flame, Globe2, MoonStar, SunMedium } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useFloatingExperienceStore } from "./store";

export const Header = () => {
  const { t, i18n } = useTranslation("floating");
  const { theme, toggleTheme, language, setLanguage } =
    useFloatingExperienceStore();

  const handleLanguageChange = () => {
    const nextLanguage = language === "ar" ? "en" : "ar";
    setLanguage(nextLanguage);
    i18n.changeLanguage(nextLanguage);
    document.documentElement.dir = nextLanguage === "ar" ? "rtl" : "ltr";
  };

  return (
    <motion.header
      layout
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative mx-auto mt-8 flex w-[94%] max-w-6xl items-center justify-between rounded-full border border-white/20 bg-white/40 px-6 py-4 shadow-[0_20px_60px_rgba(59,130,246,0.25)] backdrop-blur-2xl dark:bg-slate-900/50 dark:shadow-[0_20px_60px_rgba(76,29,149,0.35)]"
    >
      <div className="flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-800 dark:bg-indigo-500/30 dark:text-indigo-100">
          <Flame className="size-5" />
        </div>
        <div className="leading-tight">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-600 dark:text-slate-300">
            Aurora Election
          </p>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
            Floating Command Center
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400/40 via-emerald-300/40 to-purple-400/40 px-4 py-2 text-xs font-medium text-slate-800 shadow-[0_0_25px_rgba(34,211,238,0.35)] backdrop-blur-xl transition hover:from-cyan-300/60 hover:to-purple-300/60 dark:text-slate-100"
        >
          {theme === "day" ? (
            <SunMedium className="size-4" />
          ) : (
            <MoonStar className="size-4" />
          )}
          {theme === "day" ? t("dayTheme") : t("nightTheme")}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleLanguageChange}
          className="flex items-center gap-2 rounded-full border border-white/40 bg-white/50 px-4 py-2 text-xs font-semibold text-slate-900 shadow-[0_0_25px_rgba(129,140,248,0.35)] backdrop-blur-xl dark:bg-slate-900/60 dark:text-slate-100"
        >
          <Globe2 className="size-4" />
          {language === "ar" ? "AR" : "EN"}
        </motion.button>
      </div>
    </motion.header>
  );
};
