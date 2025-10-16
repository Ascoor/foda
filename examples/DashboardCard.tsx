import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value?: string | number;
  icon?: LucideIcon;
  children?: React.ReactNode;
  delay?: number;
}

export const DashboardCard = ({ title, value, icon: Icon, children, delay = 0 }: DashboardCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.92, rotateX: 15 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      transition={{ 
        type: 'spring', 
        stiffness: 160, 
        damping: 18,
        delay 
      }}
      whileHover={{ 
        scale: 1.03,
        y: -8,
        rotateX: 2,
        transition: { type: 'spring', stiffness: 300, damping: 20 }
      }}
      className="relative rounded-[28px] bg-card backdrop-blur-xl border border-border/40 p-7 overflow-hidden group"
      style={{ 
        boxShadow: 'var(--shadow-neomorph-raised)',
        transform: 'perspective(1000px)',
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Sculpted gradient overlay - stronger 3D effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/8 pointer-events-none opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
      
      {/* Inner shadow for depth */}
      <div 
        className="absolute inset-0 rounded-[28px] pointer-events-none"
        style={{ boxShadow: 'var(--shadow-neomorph-inset)' }}
      />
      
      {/* Ambient glow on hover - night mode */}
      <div className="absolute inset-0 opacity-0 dark:group-hover:opacity-100 transition-opacity duration-500 pointer-events-none glow-ambient rounded-[28px]" />
      
      <div className="relative z-10" style={{ transform: 'translateZ(20px)' }}>
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            {title}
          </h3>
          {Icon && (
            <motion.div 
              className="p-3 rounded-[20px] relative"
              style={{ 
                background: 'linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--accent) / 0.15))',
                boxShadow: 'inset 2px 2px 6px hsla(0, 0%, 100%, 0.1), inset -2px -2px 6px hsla(0, 0%, 0%, 0.1)'
              }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <Icon className="w-5 h-5 text-primary dark:text-primary drop-shadow-lg" />
            </motion.div>
          )}
        </div>

        {/* Value with stronger gradient */}
        {value && (
          <motion.p 
            className="text-4xl font-extrabold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-5 drop-shadow-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.2, type: 'spring', stiffness: 200 }}
          >
            {value}
          </motion.p>
        )}

        {/* Content */}
        {children && (
          <motion.div 
            className="mt-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.3 }}
          >
            {children}
          </motion.div>
        )}
      </div>
      
      {/* Bottom edge highlight */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </motion.div>
  );
};
