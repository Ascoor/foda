import { motion } from "framer-motion";
import { Flame, Globe2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useFloatingExperienceStore } from "./store";

export const Header = () => {
  const { t, i18n } = useTranslation("floating");
  const { language, setLanguage } = useFloatingExperienceStore();

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
      className="relative flex flex-col gap-6 rounded-3xl bg-[color:var(--color-sidebar-bg)] px-6 py-6 text-[color:var(--color-text)] shadow-xl ring-1 ring-black/5 transition-colors duration-300 dark:bg-[color:var(--color-sidebar-bg)] dark:ring-white/10 md:flex-row md:items-center md:justify-between"
    >
      <div className="flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-[color:var(--color-hover)] text-[color:var(--color-text)] shadow-inner dark:bg-white/10">
          <Flame className="size-5" />
        </div>
        <div className="leading-tight">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--color-text)] opacity-70">
            Aurora Election
          </p>
          <h1 className="text-2xl font-bold">
            {language === "ar" ? "مركز القيادة الذكي" : "Intelligent Command Center"}
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <p className="text-sm text-[color:var(--color-text)] opacity-70">
          {t("footerTagline")}
        </p>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleLanguageChange}
          className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--color-hover)] px-4 py-2 text-xs font-semibold text-[color:var(--color-text)] shadow-sm transition-transform duration-300 hover:scale-[1.02] dark:bg-white/10 dark:text-white"
        >
          <Globe2 className="size-4" />
          {language === "ar" ? "AR" : "EN"}
        </motion.button>
      </div>
    </motion.header>
  );
};
