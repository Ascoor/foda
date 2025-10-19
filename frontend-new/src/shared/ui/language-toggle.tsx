import { AnimatePresence, motion } from "framer-motion";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@shared/hooks";
import { Button } from "@shared/ui/button";

const labels: Record<string, string> = {
  en: "EN",
  ar: "AR",
};

export const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation("common");

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      aria-label={t("switchLanguage")}
      className="h-10 gap-2 rounded-full border border-border/60 bg-background/70 px-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-muted-foreground transition hover:text-foreground"
    >
      <Globe className="h-4 w-4" />
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={language}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          {labels[language] ?? language.toUpperCase()}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
};
