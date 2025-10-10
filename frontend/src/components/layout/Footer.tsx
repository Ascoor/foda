import { motion } from 'framer-motion';
import { Sparkles, Languages, MoonStar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

const footerVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export const Footer = () => {
  const { language, direction, t } = useLanguage();
  const { theme } = useTheme();
  const year = new Date().getFullYear();
  const isRTL = direction === 'rtl';

  const rightsText =
    language === 'ar'
      ? `© ${year} منصة فودا. جميع الحقوق محفوظة.`
      : `© ${year} Foda Intelligence Platform. All rights reserved.`;

  const adaptiveLabel =
    language === 'ar'
      ? 'نظام تصميم متكيف بإشراف الذكاء الاصطناعي'
      : 'AI-orchestrated adaptive design system';

  const themeLabel =
    language === 'ar'
      ? theme === 'dark'
        ? 'وضع ليلي زجاجي'
        : 'وضع نهاري زجاجي'
      : theme === 'dark'
      ? 'Glassmorphic dark mode'
      : 'Glassmorphic light mode';

  return (
    <motion.footer
      dir={direction}
      variants={footerVariants}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="glass flex w-full flex-col gap-3 rounded-[var(--radius-xl)] border border-white/10 bg-card/75 px-4 py-3 text-sm text-muted-foreground shadow-glass backdrop-blur-md dark:bg-card/20 md:flex-row md:items-center md:justify-between md:gap-6"
      style={{ minHeight: 'var(--layout-footer-height, 3.5rem)' }}
    >
      <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary text-white shadow-glow">
          <Sparkles className="h-5 w-5" />
        </span>
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{rightsText}</span>
          <span className="text-xs text-muted-foreground">{adaptiveLabel}</span>
        </div>
      </div>

      <div className={`flex flex-wrap items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="glass-button border-0 px-4 py-2 text-xs">
          <Languages className="h-5 w-5" />
          <span>
            {`${t('common.language', { defaultValue: language === 'ar' ? 'اللغة' : 'Language' })}: ${
              language === 'ar' ? 'العربية' : 'Arabic'
            }`}
          </span>
        </div>
        <div className="glass-button border-0 px-4 py-2 text-xs">
          <MoonStar className="h-5 w-5" />
          <span>{themeLabel}</span>
        </div>
      </div>
    </motion.footer>
  );
};
