import { motion } from "framer-motion";
import { Switch } from "@/infrastructure/shared/ui/switch";
import { Button } from "@/infrastructure/shared/ui/button";
import { useState } from "react";

const pageTransition = {
  initial: { opacity: 0, y: 12, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0)" },
  exit: { opacity: 0, y: -12, filter: "blur(6px)" },
};

const SettingsPage = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false);

  return (
    <motion.div
      key="dashboard-settings"
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">
          إعدادات المنصة
        </h1>
        <p className="text-muted-foreground">
          تخصيص تجربة الفريق، التحكم في التنبيهات، وتهيئة خيارات الأمان
          والتزامن.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
        transition={{ duration: 0.35, delay: 0.08 }}
        className="grid gap-6 lg:grid-cols-2"
      >
        <section className="rounded-[28px] border border-[hsla(var(--border)/0.15)] bg-[hsla(var(--surface)/0.82)] p-6 shadow-[0_35px_90px_rgba(79,70,229,0.18)] backdrop-blur-2xl">
          <h2 className="text-lg font-semibold text-foreground">
            الإشعارات الذكية
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            قم بتفعيل التنبيهات الفورية للمخاطر، الأداء، والتغييرات المهمة في
            الحملات.
          </p>

          <div className="mt-6 space-y-5 text-sm text-muted-foreground">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-base font-semibold text-foreground">
                  تنبيهات الوقت الحقيقي
                </p>
                <p>إرسال إشعارات فورية عند ظهور مؤشرات حرجة.</p>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={(checked) => setNotificationsEnabled(checked)}
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-base font-semibold text-foreground">
                  ملخص يومي
                </p>
                <p>ملخص منسق لأبرز الأرقام يصل عبر البريد في نهاية اليوم.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-[hsla(var(--border)/0.15)] bg-[hsla(var(--surface)/0.82)] p-6 shadow-[0_35px_90px_rgba(79,70,229,0.18)] backdrop-blur-2xl">
          <h2 className="text-lg font-semibold text-foreground">
            الأمان والتزامن
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            حافظ على استقرار البيانات من خلال تفعيل التزامن الذكي وإدارة
            الجلسات.
          </p>

          <div className="mt-6 space-y-5 text-sm text-muted-foreground">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-base font-semibold text-foreground">
                  التزامن التلقائي
                </p>
                <p>تحديث قواعد البيانات كل 15 دقيقة لضمان دقة المعلومات.</p>
              </div>
              <Switch
                checked={autoSyncEnabled}
                onCheckedChange={(checked) => setAutoSyncEnabled(checked)}
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-base font-semibold text-foreground">
                  إدارة الجلسات
                </p>
                <p>متابعة الجلسات النشطة وإيقاف غير المصرح بها فوراً.</p>
              </div>
              <Button variant="outline" className="rounded-2xl">
                عرض الجلسات
              </Button>
            </div>
          </div>
        </section>
      </motion.div>
    </motion.div>
  );
};

export default SettingsPage;
