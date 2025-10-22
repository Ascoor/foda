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
    className={`relative overflow-hidden rounded-3xl bg-white/80 shadow-xl ring-1 ring-black/5 backdrop-blur-sm transition-colors duration-300 dark:bg-[rgba(30,41,59,0.85)] dark:ring-white/10 ${className}`}
  >
    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 via-cyan-200/10 to-purple-200/20 opacity-70 mix-blend-soft-light dark:from-white/10" />
    <div className="relative space-y-4 p-6 md:p-8">
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
