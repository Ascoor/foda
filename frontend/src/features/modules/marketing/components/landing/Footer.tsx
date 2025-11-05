import { useTranslation } from "react-i18next";
import { useFloatingExperienceStore } from "../layout";

export const Footer = () => {
  const { t } = useTranslation("floating");
  const { language, setLanguage, toggleTheme } = useFloatingExperienceStore();

  return (
    <footer
      id="contact"
      className="relative mt-24 bg-white/40 py-8 text-center text-sm text-slate-600 backdrop-blur-2xl dark:bg-slate-900/60 dark:text-slate-300"
    >
      <div className="mx-auto flex w-[94%] max-w-5xl flex-col items-center gap-4 md:flex-row md:justify-between">
        <p className="font-semibold text-slate-700 dark:text-slate-200">
          {t("footerTagline")}
        </p>
        <div className="flex items-center gap-4 text-xs">
          <button
            onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
            className="rounded-full border border-white/30 bg-white/50 px-4 py-2 text-slate-600 transition hover:bg-white/70 dark:bg-slate-800/60 dark:text-slate-200"
          >
            {language === "ar" ? "العربية / English" : "English / العربية"}
          </button>
          <button
            onClick={toggleTheme}
            className="rounded-full border border-white/30 bg-white/50 px-4 py-2 text-slate-600 transition hover:bg-white/70 dark:bg-slate-800/60 dark:text-slate-200"
          >
            Day & Night
          </button>
        </div>
      </div>
      <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
        © {new Date().getFullYear()} Aurora Election Labs
      </p>
    </footer>
  );
};
