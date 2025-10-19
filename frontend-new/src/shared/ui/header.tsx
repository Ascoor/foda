import { Bell } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/shared/ui/button";
import { LanguageToggle } from "@/shared/ui/language-toggle";
import { ThemeToggle } from "@/shared/ui/theme-toggle";
import { UserMenu } from "@/shared/ui/user-menu";
import { Logo } from "@/shared/ui/logo";

export const Header = () => {
  const { t } = useTranslation("common");

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
      <Logo />
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" aria-label={t("notifications")}>
          <Bell className="h-5 w-5" />
        </Button>
        <LanguageToggle />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
};
