import { motion } from "framer-motion";
import { PropsWithChildren } from "react";

interface GlassCardProps {
  title?: string;
  description?: string;
  className?: string;
}

export const GlassCard = ({
  title,
  description,
  className = "",
  children,
}: PropsWithChildren<GlassCardProps>) => (
  <motion.section
    layout
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className={`relative rounded-3xl bg-white/30 dark:bg-slate-900/50 border border-white/10 backdrop-blur-2xl shadow-[0_20px_60px_rgba(20,20,60,0.25)] ${className}`}
  >
    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 via-cyan-200/10 to-purple-200/10 opacity-70 mix-blend-soft-light" />
    <div className="relative p-6 md:p-8 space-y-4">
      {title && (
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {description}
        </p>
      )}
      <div className="relative">{children}</div>
    </div>
  </motion.section>
);
