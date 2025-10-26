import { PropsWithChildren } from "react";
import { motion } from "framer-motion";

interface GlassPanelProps {
  className?: string;
}

export const GlassPanel = ({
  children,
  className = "",
}: PropsWithChildren<GlassPanelProps>) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.7, ease: "easeOut" }}
    className={`relative overflow-hidden rounded-3xl border border-white/20 bg-white/40 shadow-[0_20px_50px_rgba(45,212,191,0.3)] backdrop-blur-2xl dark:bg-slate-900/60 dark:shadow-[0_20px_60px_rgba(167,139,250,0.35)] ${className}`}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-cyan-200/10 to-purple-200/10 opacity-70" />
    <div className="relative p-8">{children}</div>
  </motion.div>
);
