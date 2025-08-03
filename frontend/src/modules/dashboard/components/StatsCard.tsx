import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
  color: 'primary' | 'secondary' | 'accent' | 'success';
}

const colorClasses = {
  primary: 'from-primary to-primary-glow',
  secondary: 'from-secondary to-secondary-glow',
  accent: 'from-accent to-accent-glow',
  success: 'from-success to-success'
};

const glowClasses = {
  primary: 'shadow-[0_0_30px_hsl(var(--primary)/0.3)]',
  secondary: 'shadow-[0_0_30px_hsl(var(--secondary)/0.3)]',
  accent: 'shadow-[0_0_30px_hsl(var(--accent)/0.3)]',
  success: 'shadow-[0_0_30px_hsl(var(--success)/0.3)]'
};

export const StatsCard = ({ title, value, change, trend, icon: Icon, color }: StatsCardProps) => {
  const { t } = useTranslation();

  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.2)'
      }}
      className="glass-card group cursor-pointer relative overflow-hidden"
    >
      {/* Animated Background Gradient */}
      <div className={`
        absolute inset-0 bg-gradient-to-br ${colorClasses[color]} 
        opacity-0 group-hover:opacity-10 transition-opacity duration-300
      `} />
      
      {/* Glow Effect */}
      <div className={`
        absolute -inset-1 bg-gradient-to-r ${colorClasses[color]} 
        rounded-xl opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-300 -z-10
      `} />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className={`
            p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]} 
            shadow-lg group-hover:${glowClasses[color]} transition-shadow duration-300
          `}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          
          <div className={`
            flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
            ${trend === 'up' ? 'text-success bg-success/10' : 'text-destructive bg-destructive/10'}
          `}>
            {trend === 'up' ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {change}
          </div>
        </div>

        {/* Content */}
        <div>
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-3xl font-bold mb-2 group-hover:text-primary transition-colors"
          >
            {value}
          </motion.h3>
          <p className="text-muted-foreground text-sm font-medium">
            {t(title)}
          </p>
        </div>

        {/* Animated Counter Effect */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-2 h-2 bg-primary rounded-full animate-pulse"
          />
        </div>
      </div>
    </motion.div>
  );
};