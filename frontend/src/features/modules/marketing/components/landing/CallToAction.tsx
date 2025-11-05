import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { GlowButton } from "../ui/GlowButton";

export const CallToAction = () => {
  const { t } = useTranslation("floating");

  return (
    <section className="relative mx-auto mt-24 w-[94%] max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[42px] border border-white/20 bg-white/40 p-12 text-center shadow-[0_25px_65px_rgba(129,140,248,0.35)] backdrop-blur-2xl dark:bg-slate-900/60"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 via-purple-400/25 to-emerald-400/30" />
        <div className="relative space-y-6">
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
            {t("ctaTitle")}
          </h3>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {t("ctaSubtitle")}
          </p>
          <div className="flex items-center justify-center">
            <GlowButton to="/experience" className="group">
              {t("viewDashboard")}
            </GlowButton>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
