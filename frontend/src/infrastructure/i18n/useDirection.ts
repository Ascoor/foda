import { useLanguage } from "@/infrastructure/shared/contexts/LanguageContext";

export const useDirection = () => {
  const { direction } = useLanguage();
  return direction;
};
