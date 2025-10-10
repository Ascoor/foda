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
      className="glass flex flex-col gap-3 border border-white/10 bg-white/40 p-4 text-xs text-muted-foreground shadow-glass backdrop-blur-md dark:bg-white/5 md:flex-row md:items-center md:justify-between md:gap-6 md:text-sm"
      style={{ minHeight: 'var(--layout-footer-height, 3.5rem)' }}
    >
      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary text-white shadow-glow">
          <Sparkles className="h-4 w-4" />
        </span>
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{rightsText}</span>
          <span className="text-[11px] md:text-xs text-muted-foreground">{adaptiveLabel}</span>
        </div>
      </div>

      <div className={`flex flex-wrap items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="glass-button border-0 px-3 py-2 text-[11px] md:text-xs">
          <Languages className="h-3.5 w-3.5" />
          <span>
            {t('common.language', {
              defaultValue: language === 'ar' ? 'اللغة الحالية: العربية' : 'Current language: Arabic',
            })}
          </span>
        </div>
        <div className="glass-button border-0 px-3 py-2 text-[11px] md:text-xs">
          <MoonStar className="h-3.5 w-3.5" />
          <span>{themeLabel}</span>
        </div>
      </div>
    </motion.footer>
  );
};
