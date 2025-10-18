import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AuroraBackground } from "../components/ui/AuroraBackground";
import { FloatingNav } from "../components/landing/FloatingNav";
import { HeroSection } from "../components/landing/HeroSection";
import { FeaturesSection } from "../components/landing/FeaturesSection";
import { StatsSection } from "../components/landing/StatsSection";
import { CallToAction } from "../components/landing/CallToAction";
import { Footer } from "../components/landing/Footer";
import { useFloatingExperienceStore } from "../components/layout";
import "../components/layout/i18n";

export const FloatingLandingPage = () => {
  const { i18n } = useTranslation("floating");
  const { language, theme } = useFloatingExperienceStore();

  useEffect(() => {
    i18n.changeLanguage(language);
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [i18n, language]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "night");
  }, [theme]);

  return (
    <AuroraBackground>
      <FloatingNav />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <CallToAction />
      <Footer />
    </AuroraBackground>
  );
};

export default FloatingLandingPage;
