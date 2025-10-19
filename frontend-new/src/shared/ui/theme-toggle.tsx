import { Moon, Sun } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useTheme } from "@/shared/hooks";
import { useTranslation } from "react-i18next";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation("common");

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-1"
      onClick={toggleTheme}
      aria-label={t("switchTheme")}
    >
      {theme === "dark" ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
      <span className="hidden text-xs font-medium sm:inline">{t("theme")}</span>
    </Button>
  );
};
