import { motion } from "framer-motion";
import { Plus, RefreshCw, Settings2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useFloatingExperienceStore } from "./store";

interface FloatingActionsProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const FloatingActions = ({ onRefresh, isRefreshing = false }: FloatingActionsProps) => {
  const { language } = useFloatingExperienceStore();
  const { t } = useTranslation("floating");

  const actions = [
    {
      key: "refresh",
      icon: RefreshCw,
      label: t("dashboard.actions.refresh", "تحديث الإحصاءات"),
      type: "button" as const,
      onClick: onRefresh,
      disabled: !onRefresh,
    },
    {
      key: "create",
      icon: Plus,
      label: t("dashboard.actions.createActivity", "إضافة نشاط"),
      type: "link" as const,
      href: "/app/campaigns",
    },
    {
      key: "settings",
      icon: Settings2,
      label: t("dashboard.actions.openSettings", "إعدادات التطبيق"),
      type: "link" as const,
      href: "/app/settings",
    },
  ];

  return (
    <motion.div
      className={`fixed bottom-8 flex flex-col gap-3 ${language === "ar" ? "left-8 items-start" : "right-8 items-end"}`}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
    >
      {actions.map(({ key, icon: Icon, label, type, href, onClick, disabled }, index) => {
        const commonClasses =
          "group relative flex items-center gap-3 rounded-full border border-white/20 bg-gradient-to-r from-cyan-400/40 via-purple-400/40 to-pink-400/40 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_35px_rgba(14,165,233,0.45)] backdrop-blur-2xl";

        const content = (
          <>
            <div className="flex size-10 items-center justify-center rounded-full bg-white/80 text-cyan-600 shadow-lg group-hover:shadow-[0_0_20px_rgba(34,211,238,0.5)]">
              <Icon className={`size-5 ${key === "refresh" && isRefreshing ? "animate-spin" : ""}`} />
            </div>
            <span className={`${language === "ar" ? "pl-2" : "pr-2"} text-slate-900 drop-shadow dark:text-white`}>
              {key === "refresh" && isRefreshing
                ? t("dashboard.actions.refreshing", "جاري التحديث...")
                : label}
            </span>
          </>
        );

        if (type === "link" && href) {
          return (
            <motion.a
              key={key}
              href={href}
              whileHover={{ scale: 1.08, rotate: index === 0 ? 2 : 0 }}
              whileTap={{ scale: 0.95 }}
              className={commonClasses}
            >
              {content}
            </motion.a>
          );
        }

        return (
          <motion.button
            key={key}
            type="button"
            whileHover={{ scale: disabled ? 1 : 1.08, rotate: index === 0 ? 2 : 0 }}
            whileTap={{ scale: 0.95 }}
            onClick={disabled ? undefined : onClick}
            disabled={disabled || isRefreshing}
            className={`${commonClasses} ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
          >
            {content}
          </motion.button>
        );
      })}
    </motion.div>
  );
};
