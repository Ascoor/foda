import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { BarChart3 } from 'lucide-react';

const progressData = [
  { label: 'Registration', value: 85, color: 'primary' },
  { label: 'Verification', value: 72, color: 'secondary' },
  { label: 'Campaign', value: 58, color: 'accent' },
  { label: 'Voting', value: 31, color: 'success' }
];

const colorClasses = {
  primary: 'bg-gradient-to-r from-primary to-primary-glow',
  secondary: 'bg-gradient-to-r from-secondary to-secondary-glow',
  accent: 'bg-gradient-to-r from-accent to-accent-glow',
  success: 'bg-gradient-to-r from-success to-success'
};

export const ProgressChart = () => {
  const { t } = useTranslation();

  return (
    <div className="glass-card h-full">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold">{t('dashboard.election_progress')}</h2>
      </div>

      <div className="space-y-6">
        {progressData.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-2"
          >
            {/* Label and Value */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                {item.label}
              </span>
              <span className="text-sm font-bold text-primary">
                {item.value}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="relative h-3 bg-muted/30 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.value}%` }}
                transition={{ 
                  delay: index * 0.2 + 0.5,
                  duration: 1,
                  ease: 'easeOut'
                }}
                className={`h-full rounded-full ${colorClasses[item.color as keyof typeof colorClasses]} relative`}
              >
                {/* Animated glow effect */}
                <motion.div
                  animate={{ 
                    x: ['-100%', '100%'],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: index * 0.3
                  }}
                  className="absolute inset-0 bg-white/30 skew-x-12"
                />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
              className="text-2xl font-bold text-gradient-primary"
            >
              62%
            </motion.div>
            <p className="text-xs text-muted-foreground">Overall Progress</p>
          </div>
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 }}
              className="text-2xl font-bold text-gradient-secondary"
            >
              18
            </motion.div>
            <p className="text-xs text-muted-foreground">Days Remaining</p>
          </div>
        </div>
      </div>
    </div>
  );
};