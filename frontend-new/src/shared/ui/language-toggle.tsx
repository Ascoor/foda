import { Languages } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useLanguage } from "@/shared/hooks";
import { useTranslation } from "react-i18next";

export const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation("common");

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-1 text-sm"
      onClick={toggleLanguage}
      aria-label={t("switchLanguage")}
    >
      <Languages className="h-4 w-4" />
      <span className="font-medium uppercase">{language}</span>
    </Button>
  );
};
