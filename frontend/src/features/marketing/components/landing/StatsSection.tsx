import { animate, motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { GlassPanel } from "../ui/GlassPanel";
import { useFloatingExperienceStore } from "../layout";

interface StatBubbleProps {
  label: string;
  value: number;
  suffix?: string;
}

const StatBubble = ({ label, value, suffix = "" }: StatBubbleProps) => {
  const { language } = useFloatingExperienceStore();
  const animatedValue = useSpring(0, { stiffness: 80, damping: 20 });
  const rounded = useTransform(animatedValue, (latest) => Math.floor(latest));
  const formatted = useTransform(rounded, (latest) =>
    new Intl.NumberFormat(language === "ar" ? "ar-EG" : "en-US").format(latest),
  );

  useEffect(() => {
    animatedValue.set(0);
    const controls = animate(animatedValue, value, {
      duration: 2.4,
      ease: "easeOut",
    });
    return () => {
      controls.stop();
    };
  }, [animatedValue, value]);

  return (
    <motion.div
      className="relative flex h-48 w-48 flex-col items-center justify-center rounded-full border border-white/40 bg-white/50 shadow-[0_20px_45px_rgba(59,130,246,0.25)] backdrop-blur-2xl dark:bg-slate-900/60"
      whileHover={{ scale: 1.08 }}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-300/30 via-emerald-200/25 to-purple-300/30" />
      <div className="relative text-center">
        <motion.span className="text-4xl font-bold text-slate-900 dark:text-white">
          {formatted}
        </motion.span>
        <span className="ml-1 text-2xl font-semibold text-cyan-600 dark:text-cyan-300">
          {suffix}
        </span>
        <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
          {label}
        </p>
      </div>
    </motion.div>
  );
};

export const StatsSection = () => {
  const { t } = useTranslation("floating");

  return (
    <section className="relative mx-auto mt-24 w-[94%] max-w-6xl">
      <GlassPanel className="flex flex-col items-center gap-10 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-3xl font-bold text-slate-900 dark:text-white"
        >
          {t("statsTitle")}
        </motion.h2>
        <div className="flex flex-wrap items-center justify-center gap-8">
          <StatBubble label={t("voters")} value={1250000} />
          <StatBubble label={t("participation")} value={68} suffix="%" />
          <StatBubble label={t("campaigns")} value={142} />
        </div>
      </GlassPanel>
    </section>
  );
};
