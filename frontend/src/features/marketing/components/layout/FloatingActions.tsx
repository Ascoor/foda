import { motion } from "framer-motion";
import { Plus, RefreshCw, Settings2 } from "lucide-react";
import { useFloatingExperienceStore } from "./store";

const actions = [
  { icon: Plus, label: "إضافة بيانات جديدة" },
  { icon: RefreshCw, label: "تحديث الإحصاءات" },
  { icon: Settings2, label: "إعدادات العرض" },
];

export const FloatingActions = () => {
  const { language } = useFloatingExperienceStore();

  return (
    <motion.div
      className={`fixed bottom-8 flex flex-col gap-3 ${language === "ar" ? "left-8 items-start" : "right-8 items-end"}`}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
    >
      {actions.map(({ icon: Icon, label }, index) => (
        <motion.button
          key={label}
          whileHover={{ scale: 1.08, rotate: index === 1 ? 2 : 0 }}
          whileTap={{ scale: 0.95 }}
          className="group relative flex items-center gap-3 rounded-full border border-white/20 bg-gradient-to-r from-cyan-400/40 via-purple-400/40 to-pink-400/40 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_35px_rgba(14,165,233,0.45)] backdrop-blur-2xl"
        >
          <div className="flex size-10 items-center justify-center rounded-full bg-white/80 text-cyan-600 shadow-lg group-hover:shadow-[0_0_20px_rgba(34,211,238,0.5)]">
            <Icon className="size-5" />
          </div>
          <span
            className={`${language === "ar" ? "pl-2" : "pr-2"} text-slate-900 drop-shadow dark:text-white`}
          >
            {label}
          </span>
        </motion.button>
      ))}
    </motion.div>
  );
};
