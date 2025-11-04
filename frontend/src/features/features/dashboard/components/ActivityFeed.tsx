import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Activity, LucideIcon } from "lucide-react";

interface ActivityItem {
  id: number;
  type: string;
  title: string;
  time: string;
  icon: LucideIcon;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  const { t } = useTranslation();

  return (
    <div className="glass-card h-full">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold">
          {t("dashboard.recent_activity")}
        </h2>
      </div>

      <div className="space-y-4">
        {activities.length === 0 && (
          <p className="text-sm text-muted-foreground">{t("common.no_data")}</p>
        )}
        {activities.map((activity, index) => {
          const Icon = activity.icon;

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer"
            >
              {/* أيقونة */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/20 transition-all">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
              </div>

              {/* محتوى */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {activity.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {activity.time}
                </p>
              </div>

              {/* مؤشر نبض */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-2 h-2 bg-primary rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
              />
            </motion.div>
          );
        })}
      </div>

      {/* زر عرض الكل */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-6 py-3 text-sm font-medium text-primary hover:text-primary-glow transition-colors border-t border-white/10 pt-4"
      >
        {t("dashboard.view_all_activities")}
      </motion.button>
    </div>
  );
};
