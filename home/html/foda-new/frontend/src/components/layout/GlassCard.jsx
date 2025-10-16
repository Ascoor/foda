import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from './hooks';

const GlassCard = forwardRef(({ as: Component = motion.div, className = '', children, hoverLift = false, ...props }, ref) => {
  const { palette } = useTheme();
  const hoverClass = hoverLift
    ? 'transition-transform duration-500 ease-out hover:-translate-y-2 hover:shadow-[var(--dashboard-card-shadow)]'
    : '';

  return (
    <Component
      ref={ref}
      className={`group relative overflow-hidden rounded-3xl ${palette.card} ${hoverClass} ${className}`.trim()}
      {...props}
    >
      <span className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 via-transparent to-white/5 opacity-80 mix-blend-luminosity" />
      <span className="pointer-events-none absolute -top-24 right-10 h-48 w-48 rounded-full bg-white/20 blur-[var(--dashboard-card-blur)] opacity-40" />
      <div className="relative z-10">
        {children}
      </div>
    </Component>
  );
});

GlassCard.displayName = 'GlassCard';

export default GlassCard;
