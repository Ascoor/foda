import { animate, motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useMotionPreset } from "@/infrastructure/hooks/useMotionPreset";

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
  const bubblePreset = useMotionPreset("scaleIn");

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
      initial={bubblePreset?.initial}
      whileInView={bubblePreset?.animate}
      variants={bubblePreset?.variants}
      transition={bubblePreset?.transition}
      viewport={{ once: true, amount: 0.3 }}
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
  const headingPreset = useMotionPreset("fadeDown");
  const sectionPreset = useMotionPreset("fadeUp");

  return (
    <motion.section
      className="relative mx-auto mt-24 w-[94%] max-w-6xl"
      initial={sectionPreset?.initial}
      whileInView={sectionPreset?.animate}
      variants={sectionPreset?.variants}
      transition={sectionPreset?.transition}
      viewport={{ once: true, amount: 0.2 }}
    >
      <GlassPanel className="flex flex-col items-center gap-10 py-16">
        <motion.h2
          className="text-3xl font-bold text-slate-900 dark:text-white"
          initial={headingPreset?.initial}
          whileInView={headingPreset?.animate}
          variants={headingPreset?.variants}
          transition={headingPreset?.transition}
          viewport={{ once: true, amount: 0.3 }}
        >
          {t("statsTitle")}
        </motion.h2>
        <div className="flex flex-wrap items-center justify-center gap-8">
          <StatBubble label={t("voters")} value={1250000} />
          <StatBubble label={t("participation")} value={68} suffix="%" />
          <StatBubble label={t("campaigns")} value={142} />
        </div>
      </GlassPanel>
    </motion.section>
  );
};
