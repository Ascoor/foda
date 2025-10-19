import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@shared/hooks";
import { Button } from "@shared/ui/button";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation("common");

  return (
    <Button
      type="button"
      variant="glass"
      size="icon"
      onClick={toggleTheme}
      aria-label={t("switchTheme")}
      className="relative overflow-hidden rounded-full"
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={theme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex h-10 w-10 items-center justify-center"
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4 text-secondary" />
          ) : (
            <Sun className="h-4 w-4 text-accent" />
          )}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
};
