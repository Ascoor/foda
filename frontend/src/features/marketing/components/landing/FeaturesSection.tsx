import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { GlassPanel } from "../ui/GlassPanel";

export const FeaturesSection = () => {
  const { t } = useTranslation("floating");
  const featureCards = t("featureCards", { returnObjects: true }) as {
    title: string;
    description: string;
  }[];

  return (
    <section id="features" className="relative mx-auto mt-24 w-[94%] max-w-6xl">
      <div className="mb-12 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-3xl font-bold text-slate-900 dark:text-white md:text-4xl"
        >
          {t("featuresTitle")}
        </motion.h2>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        {featureCards.map((feature) => (
          <GlassPanel key={feature.title} className="group">
            <motion.div
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 30px rgba(0,255,200,0.4)",
              }}
              className="space-y-4 text-center"
            >
              <div className="mx-auto h-20 w-20 rounded-3xl bg-gradient-to-br from-cyan-400/50 via-emerald-300/50 to-purple-400/50 shadow-[0_15px_40px_rgba(45,212,191,0.25)] backdrop-blur-xl" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {feature.description}
              </p>
            </motion.div>
          </GlassPanel>
        ))}
      </div>
    </section>
  );
};
