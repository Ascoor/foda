import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enCommon from "@/i18n/locales/en/common.json";
import enLogin from "@/i18n/locales/en/login.json";
import enDashboard from "@/i18n/locales/en/dashboard.json";
import enVolunteers from "@/i18n/locales/en/volunteers.json";
import arCommon from "@/i18n/locales/ar/common.json";
import arLogin from "@/i18n/locales/ar/login.json";
import arDashboard from "@/i18n/locales/ar/dashboard.json";
import arVolunteers from "@/i18n/locales/ar/volunteers.json";

void i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        login: enLogin,
        dashboard: enDashboard,
        volunteers: enVolunteers,
      },
      ar: {
        common: arCommon,
        login: arLogin,
        dashboard: arDashboard,
        volunteers: arVolunteers,
      },
    },
    lng: "en",
    fallbackLng: "en",
    defaultNS: "common",
    ns: ["common", "login", "dashboard", "volunteers"],
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
