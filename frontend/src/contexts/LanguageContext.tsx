import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ar' | 'en';
export type Direction = 'rtl' | 'ltr';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations object
const translations = {
  ar: {
    // Header & Navigation
    'app.title': 'فودا',
    'app.subtitle': 'نظام إدارة الحملات المتطور',
    'nav.dashboard': 'لوحة التحكم',
    'nav.campaigns': 'الحملات',
    'nav.teams': 'الفرق',
    'nav.analytics': 'التحليلات',
    'nav.settings': 'الإعدادات',
    'nav.profile': 'الملف الشخصي',
    'nav.logout': 'تسجيل الخروج',
    
    // Theme & Language
    'theme.light': 'الوضع النهاري',
    'theme.dark': 'الوضع الليلي',
    'language.switch': 'تغيير اللغة',
    'language.arabic': 'العربية',
    'language.english': 'English',
    
    // Dashboard
    'dashboard.welcome': 'مرحباً بك في فودا',
    'dashboard.subtitle': 'إدارة حملاتك بكفاءة',
    'dashboard.total_campaigns': 'إجمالي الحملات',
    'dashboard.active_campaigns': 'الحملات النشطة',
    'dashboard.team_members': 'أعضاء الفريق',
    'dashboard.completion_rate': 'معدل الإنجاز',
    
    // Campaigns
    'campaigns.title': 'إدارة الحملات',
    'campaigns.create': 'إنشاء حملة جديدة',
    'campaigns.edit': 'تعديل الحملة',
    'campaigns.delete': 'حذف الحملة',
    'campaigns.status.active': 'نشطة',
    'campaigns.status.paused': 'متوقفة',
    'campaigns.status.completed': 'مكتملة',
    
    // Teams
    'teams.title': 'إدارة الفرق',
    'teams.create': 'إنشاء فريق جديد',
    'teams.members': 'الأعضاء',
    'teams.add_member': 'إضافة عضو',
    'teams.roles': 'الأدوار والصلاحيات',
    
    // Analytics & Reports
    'analytics.title': 'التحليلات والتقارير',
    'analytics.performance': 'تحليل الأداء',
    'analytics.reports': 'التقارير المفصلة',
    'analytics.data': 'إدارة البيانات',
    'campaigns.reports': 'تقارير الحملات',
    'campaigns.schedule': 'جدولة الحملات',
    
    // Common
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.create': 'إنشاء',
    'common.search': 'بحث...',
    'common.filter': 'تصفية',
    'common.export': 'تصدير',
    'common.loading': 'جارٍ التحميل...',
    'common.success': 'تم بنجاح',
    'common.error': 'حدث خطأ',
    'common.view': 'عرض',
    'common.details': 'التفاصيل',
  },
  en: {
    // Header & Navigation
    'app.title': 'Foda',
    'app.subtitle': 'Advanced Campaign Management System',
    'nav.dashboard': 'Dashboard',
    'nav.campaigns': 'Campaigns',
    'nav.teams': 'Teams',
    'nav.analytics': 'Analytics',
    'nav.settings': 'Settings',
    'nav.profile': 'Profile',
    'nav.logout': 'Logout',
    
    // Theme & Language
    'theme.light': 'Light Mode',
    'theme.dark': 'Dark Mode',
    'language.switch': 'Switch Language',
    'language.arabic': 'العربية',
    'language.english': 'English',
    
    // Dashboard
    'dashboard.welcome': 'Welcome to Foda',
    'dashboard.subtitle': 'Manage your campaigns efficiently',
    'dashboard.total_campaigns': 'Total Campaigns',
    'dashboard.active_campaigns': 'Active Campaigns',
    'dashboard.team_members': 'Team Members',
    'dashboard.completion_rate': 'Completion Rate',
    
    // Campaigns
    'campaigns.title': 'Campaign Management',
    'campaigns.create': 'Create New Campaign',
    'campaigns.edit': 'Edit Campaign',
    'campaigns.delete': 'Delete Campaign',
    'campaigns.status.active': 'Active',
    'campaigns.status.paused': 'Paused',
    'campaigns.status.completed': 'Completed',
    
    // Teams
    'teams.title': 'Team Management',
    'teams.create': 'Create New Team',
    'teams.members': 'Team Members',
    'teams.add_member': 'Add Member',
    'teams.roles': 'Roles & Permissions',
    
    // Analytics & Reports
    'analytics.title': 'Analytics & Reports',
    'analytics.performance': 'Performance Analysis',
    'analytics.reports': 'Detailed Reports',
    'analytics.data': 'Data Management',
    'campaigns.reports': 'Campaign Reports',
    'campaigns.schedule': 'Campaign Scheduling',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.create': 'Create',
    'common.search': 'Search...',
    'common.filter': 'Filter',
    'common.export': 'Export',
    'common.loading': 'Loading...',
    'common.success': 'Success',
    'common.error': 'Error',
    'common.view': 'View',
    'common.details': 'Details',
  }
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ar');
  const direction: Direction = language === 'ar' ? 'rtl' : 'ltr';

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('fahsan-language', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('fahsan-language') as Language;
    if (savedLanguage && ['ar', 'en'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    } else {
      setLanguage('ar'); // Default to Arabic
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};