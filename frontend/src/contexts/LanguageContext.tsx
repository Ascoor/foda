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
     'nav.areas': 'المناطق',

    'nav.events': 'الفعاليات',
    'nav.swots': 'تحليل SWOT',

    'nav.analytics': 'التحليلات',
    'nav.finance': 'المالية',
    'nav.settings': 'الإعدادات',
    'nav.profile': 'الملف الشخصي',
    'nav.logout': 'تسجيل الخروج',

    // Auth
    'auth.login': 'تسجيل الدخول',
    'auth.register': 'تسجيل',
    'auth.name': 'الاسم',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.role': 'معرّف الدور',
    'auth.have_account': 'لديك حساب؟ تسجيل الدخول',
    'auth.no_account': 'ليس لديك حساب؟ سجل',
    'profile.title': 'الملف الشخصي',
    'profile.update': 'تحديث الملف',
    'profile.password_confirmation': 'تأكيد كلمة المرور',
    
    // Theme & Language
    'theme.light': 'الوضع النهاري',
    'theme.dark': 'الوضع الليلي',
    'language.switch': 'تغيير اللغة',
    'language.arabic': 'العربية',
    'language.english': 'English',
    
    // Dashboard
    'dashboard.welcome': 'مرحباً بك في فودا',
    'dashboard.subtitle': 'إدارة حملاتك بكفاءة',
    'dashboard.areas': 'المناطق',
    'dashboard.volunteers': 'المتطوعون',
    'dashboard.voters': 'الناخبون',
    'dashboard.teams': 'الفرق',
    'dashboard.events': 'الفعاليات',
    'dashboard.heatmap_points': 'نقاط الخريطة الحرارية',
    
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
 
 
    // Areas
    'areas.title': 'إدارة المناطق',
    'areas.create': 'إنشاء منطقة جديدة',
    'areas.edit': 'تعديل المنطقة',
    'areas.name': 'الاسم',
    'areas.description': 'الوصف',
    'areas.x': 'س',
    'areas.y': 'ص',
    'areas.confirm_delete': 'هل أنت متأكد من الحذف؟', 
    // Events
    'events.title': 'إدارة الفعاليات',
    'events.create': 'إنشاء فعالية',
    'events.edit': 'تعديل الفعالية',
    'events.delete': 'حذف الفعالية',
    'events.name': 'اسم الفعالية',
    'events.organiser': 'المنظم',
    'events.location': 'الموقع',
    'events.date': 'التاريخ',
    'events.area': 'المنطقة',
    'events.team': 'الفريق',
    'events.description': 'الوصف',
 
 
    // Analytics & Reports
    'analytics.title': 'التحليلات والتقارير',
    'analytics.performance': 'تحليل الأداء',
    'analytics.reports': 'التقارير المفصلة',
    'analytics.data': 'إدارة البيانات',
    'campaigns.reports': 'تقارير الحملات',
    'campaigns.schedule': 'جدولة الحملات',

    // Finance
    'finance.title': 'إدارة المالية',
    'finance.add': 'إضافة سجل مالي',
    'finance.edit': 'تعديل السجل المالي',
    'finance.delete': 'حذف السجل',
    'finance.amount': 'المبلغ',
    'finance.type': 'النوع',
    'finance.date': 'التاريخ',
    'finance.description': 'الوصف',
    'finance.reference': 'المعرف المرجعي',
    'finance.income': 'إيراد',
    'finance.expense': 'مصروف',
    'finance.no_records': 'لا توجد سجلات مالية',

    // Swots
    'swots.title': 'تحليل SWOT',
    'swots.create': 'إنشاء تحليل',
    'swots.edit': 'تعديل التحليل',
    'swots.entity_type': 'نوع الجهة',
    'swots.entity_id': 'معرّف الجهة',
    'swots.strengths': 'نقاط القوة',
    'swots.weaknesses': 'نقاط الضعف',
    'swots.opportunities': 'الفرص',
    'swots.threats': 'التهديدات',
    'swots.report': 'تقرير',
    'swots.entity_ids': 'معرّفات الجهات',
    'swots.confirm_delete': 'هل أنت متأكد من الحذف؟',
    
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
    'common.actions': 'الإجراءات',
  },
  en: {
    // Header & Navigation
    'app.title': 'Foda',
    'app.subtitle': 'Advanced Campaign Management System',
    'nav.dashboard': 'Dashboard',
    'nav.campaigns': 'Campaigns',
    'nav.teams': 'Teams', 
    'nav.areas': 'Areas',
    'nav.events': 'Events',
    'nav.swots': 'SWOTs',
    'nav.analytics': 'Analytics',
    'nav.finance': 'Finance',
    'nav.settings': 'Settings',
    'nav.profile': 'Profile',
    'nav.logout': 'Logout',

    // Auth
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.name': 'Name',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.role': 'Role ID',
    'auth.have_account': 'Have an account? Login',
    'auth.no_account': "Don't have an account? Register",
    'profile.title': 'Profile',
    'profile.update': 'Update Profile',
    'profile.password_confirmation': 'Confirm Password',
    
    // Theme & Language
    'theme.light': 'Light Mode',
    'theme.dark': 'Dark Mode',
    'language.switch': 'Switch Language',
    'language.arabic': 'العربية',
    'language.english': 'English',
    
    // Dashboard
    'dashboard.welcome': 'Welcome to Foda',
    'dashboard.subtitle': 'Manage your campaigns efficiently',
    'dashboard.areas': 'Areas',
    'dashboard.volunteers': 'Volunteers',
    'dashboard.voters': 'Voters',
    'dashboard.teams': 'Teams',
    'dashboard.events': 'Events',
    'dashboard.heatmap_points': 'Heatmap Points',
    
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
 
 
    // Areas
    'areas.title': 'Area Management',
    'areas.create': 'Create New Area',
    'areas.edit': 'Edit Area',
    'areas.name': 'Name',
    'areas.description': 'Description',
    'areas.x': 'X',
    'areas.y': 'Y',
    'areas.confirm_delete': 'Are you sure you want to delete?',
     
    // Events
    'events.title': 'Event Management',
    'events.create': 'Create Event',
    'events.edit': 'Edit Event',
    'events.delete': 'Delete Event',
    'events.name': 'Event Name',
    'events.organiser': 'Organiser',
    'events.location': 'Location',
    'events.date': 'Date',
    'events.area': 'Area',
    'events.team': 'Team',
    'events.description': 'Description',
  
    // Analytics & Reports
    'analytics.title': 'Analytics & Reports',
    'analytics.performance': 'Performance Analysis',
    'analytics.reports': 'Detailed Reports',
    'analytics.data': 'Data Management',
    'campaigns.reports': 'Campaign Reports',
    'campaigns.schedule': 'Campaign Scheduling',

    // Finance
    'finance.title': 'Finance Management',
    'finance.add': 'Add Finance',
    'finance.edit': 'Edit Finance',
    'finance.delete': 'Delete Finance',
    'finance.amount': 'Amount',
    'finance.type': 'Type',
    'finance.date': 'Date',
    'finance.description': 'Description',
    'finance.reference': 'Reference ID',
    'finance.income': 'Income',
    'finance.expense': 'Expense',
    'finance.no_records': 'No finance records',

    // Swots
    'swots.title': 'SWOT Analysis',
    'swots.create': 'Create SWOT',
    'swots.edit': 'Edit SWOT',
    'swots.entity_type': 'Entity Type',
    'swots.entity_id': 'Entity ID',
    'swots.strengths': 'Strengths',
    'swots.weaknesses': 'Weaknesses',
    'swots.opportunities': 'Opportunities',
    'swots.threats': 'Threats',
    'swots.report': 'Report',
    'swots.entity_ids': 'Entity IDs',
    'swots.confirm_delete': 'Are you sure you want to delete?',
    
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
    'common.actions': 'Actions',
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