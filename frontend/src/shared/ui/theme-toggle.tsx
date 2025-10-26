import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@shared/hooks";
import { Button } from "@shared/ui/button";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <Button
      type="button"
      variant="glass"
      size="icon"
      onClick={toggleTheme}
      aria-label={t("common.switchTheme")}
      className="relative overflow-hidden rounded-full text-[color:var(--header-widget-foreground)]"
      style={{
        background: "var(--header-widget-background)",
        border: "1px solid var(--header-widget-border)",
        boxShadow: "var(--header-widget-shadow)",
        backdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturation))",
      }}
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
            <Moon className="h-4 w-4" style={{ color: "var(--theme-toggle-moon)" }} />
          ) : (
            <Sun className="h-4 w-4" style={{ color: "var(--theme-toggle-sun)" }} />
          )}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
};
