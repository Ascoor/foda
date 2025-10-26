import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      dashboard: 'Election Dashboard',
      map: 'Election Map',
      reports: 'Reports',
      analytics: 'Analytics',
      settings: 'Settings',
      totalVotes: 'Total Votes',
      voterTurnout: 'Voter Turnout',
      result: 'Result',
      participationRate: 'Participation Rate',
      campaignOverview: 'Campaign Overview',
      turnoutByDistrict: 'Turnout by District',
      voteResults: 'Vote Results',
      voters: 'voters',
      participation: 'Participation',
      center: 'Center',
      toggleTheme: 'Toggle theme',
      toggleLanguage: 'Switch language',
      toggleSidebar: 'Toggle sidebar',
      notifications: 'Notifications',
      dashboardNavigation: 'Dashboard navigation',
      floatingActions: 'Quick Actions',
      mapTitle: 'Mansoura Voting Centers',
      reportsCTA: 'Generate Report',
      alertsCTA: 'Send Alert',
      refreshCTA: 'Refresh Data',
      search: 'Search...',
      month: 'Month',
      votes: 'votes',
      'delta.lastElection': 'vs last election',
      'delta.lastMonth': 'vs last month',
      'delta.activeMonitors': 'active monitors',
      'delta.pendingReviews': 'pending reviews'
    }
  },
  ar: {
    translation: {
      dashboard: 'لوحة التحكم الانتخابية',
      map: 'خريطة الانتخابات',
      reports: 'التقارير',
      analytics: 'التحليلات',
      settings: 'الإعدادات',
      totalVotes: 'إجمالي الأصوات',
      voterTurnout: 'نسبة المشاركة',
      result: 'النتيجة',
      participationRate: 'نسبة المشاركة',
      campaignOverview: 'نظرة عامة على الحملات',
      turnoutByDistrict: 'نسبة المشاركة حسب المنطقة',
      voteResults: 'نتائج التصويت',
      voters: 'ناخب',
      participation: 'مشاركة',
      center: 'المركز',
      toggleTheme: 'تبديل السمة',
      toggleLanguage: 'تغيير اللغة',
      toggleSidebar: 'تبديل الشريط الجانبي',
      notifications: 'الإشعارات',
      dashboardNavigation: 'التنقل في لوحة التحكم',
      floatingActions: 'إجراءات سريعة',
      mapTitle: 'مراكز التصويت بالمنصورة',
      reportsCTA: 'إنشاء تقرير',
      alertsCTA: 'إرسال تنبيه',
      refreshCTA: 'تحديث البيانات',
      search: 'بحث...',
      month: 'الشهر',
      votes: 'صوت',
      'delta.lastElection': 'مقارنة بالانتخابات السابقة',
      'delta.lastMonth': 'مقارنة بالشهر الماضي',
      'delta.activeMonitors': 'المراقبون النشطون',
      'delta.pendingReviews': 'قيد المراجعة'
    }
  }
};

export const initDashboardI18n = () => {
  if (!i18n.isInitialized) {
    i18n.use(initReactI18next).init({
      resources,
      lng: 'en',
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false
      }
    });
  }
  return i18n;
};

export default i18n;
