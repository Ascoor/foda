import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      dashboard: "Election Dashboard",
      home: "Home",
      messages: "Messages",
      analytics: "Analytics",
      reports: "Reports",
      settings: "Settings",
      profile: "Profile",
      logout: "Logout",
      notifications: "Notifications",
      search: "Search...",
      totalVotes: "Total Votes",
      voteResults: "Vote Results",
      participationRate: "Participation Rate",
      campaignOverview: "Campaign Overview",
      votes: "votes",
      candidate: "Candidate",
      party: "Party",
      month: "Month",
      noNotifications: "No new notifications",
      viewProfile: "View Profile",
      accountSettings: "Account Settings",
      signOut: "Sign Out"
    }
  },
  ar: {
    translation: {
      dashboard: "لوحة التحكم الانتخابية",
      home: "الرئيسية",
      messages: "الرسائل",
      analytics: "التحليلات",
      reports: "التقارير",
      settings: "الإعدادات",
      profile: "الملف الشخصي",
      logout: "تسجيل الخروج",
      notifications: "الإشعارات",
      search: "بحث...",
      totalVotes: "إجمالي الأصوات",
      voteResults: "نتائج التصويت",
      participationRate: "نسبة المشاركة",
      campaignOverview: "نظرة عامة على الحملات",
      votes: "صوت",
      candidate: "المرشح",
      party: "الحزب",
      month: "الشهر",
      noNotifications: "لا توجد إشعارات جديدة",
      viewProfile: "عرض الملف الشخصي",
      accountSettings: "إعدادات الحساب",
      signOut: "تسجيل الخروج"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
