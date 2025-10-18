import { motion } from "framer-motion";
import { Users, Target, Activity, TrendingUp } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { PieChartComponent } from "@/components/dashboard/PieChartComponent";
import { BarChartComponent } from "@/components/dashboard/BarChartComponent";

const pageTransition = {
  initial: { opacity: 0, y: 12, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0)" },
  exit: { opacity: 0, y: -12, filter: "blur(6px)" },
};

const DashboardOverview = () => {
  const stats = [
    {
      title: "إجمالي الناخبين",
      value: "24,680",
      description: "المسجلون في الحملات النشطة",
      trend: 6.5,
      trendLabel: "خلال آخر 30 يوماً",
      icon: Users,
    },
    {
      title: "نسبة التفاعل",
      value: "78%",
      description: "متوسط استجابة الرسائل الميدانية",
      trend: 3.2,
      trendLabel: "مقارنة بالشهر الماضي",
      icon: Activity,
    },
    {
      title: "نمو الحملات",
      value: "+12",
      description: "حملات جديدة تم إطلاقها",
      trend: 12.4,
      trendLabel: "آخر أسبوعين",
      icon: Target,
    },
    {
      title: "مؤشر الثقة",
      value: "92",
      description: "قياس شامل لرضا الفرق الميدانية",
      trend: -1.4,
      trendLabel: "المعدل اليومي",
      icon: TrendingUp,
    },
  ];

  return (
    <motion.div
      key="dashboard-overview"
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">لوحة المؤشرات العامة</h1>
        <p className="text-muted-foreground">
          نظرة شاملة على الأداء، الحملات، وفرق المتابعة عبر المناطق المختلفة.
        </p>
      </div>

      <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <DashboardCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <BarChartComponent title="حجم الأنشطة الأسبوعية" subtitle="عدد الفعاليات الميدانية عبر الفرق" />
        </div>
        <div className="xl:col-span-2">
          <PieChartComponent title="توزيع الحملات" />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <motion.div
          className="rounded-[28px] border border-[hsla(var(--border)/0.15)] bg-[hsla(var(--surface)/0.82)] p-6 shadow-[0_35px_90px_rgba(79,70,229,0.18)] backdrop-blur-2xl"
          initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">أحدث الأنشطة</h3>
              <p className="text-sm text-muted-foreground">متابعة مباشرة لأعمال الفرق الميدانية</p>
            </div>
            <span className="rounded-full bg-[hsla(var(--primary)/0.1)] px-3 py-1 text-xs font-medium text-[hsl(var(--primary))]">
              مباشر
            </span>
          </div>
          <ul className="mt-6 space-y-4 text-sm text-muted-foreground">
            {[
              "تم إغلاق 8 تقارير متابعة في منطقة شمال المدينة",
              "إطلاق حملة رسائل موجهة للمهتمين الجدد",
              "تعيين منسقين إضافيين لحملة الدعم المركزي",
            ].map((item) => (
              <li
                key={item}
                className="rounded-2xl border border-[hsla(var(--border)/0.1)] bg-[hsla(var(--surface-secondary)/0.35)] px-4 py-3 text-foreground shadow-sm"
              >
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          className="rounded-[28px] border border-[hsla(var(--border)/0.15)] bg-[hsla(var(--surface)/0.82)] p-6 shadow-[0_35px_90px_rgba(79,70,229,0.18)] backdrop-blur-2xl"
          initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
          transition={{ duration: 0.4, delay: 0.18 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">قنوات المتابعة</h3>
              <p className="text-sm text-muted-foreground">توزيع نقاط الاتصال خلال الأسبوع</p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 text-sm text-muted-foreground">
            {["المكاتب الميدانية", "الرسائل الرقمية", "المكالمات", "الفعاليات"]
              .map((channel, index) => (
                <div key={channel} className="space-y-2">
                  <div className="flex items-center justify-between text-foreground">
                    <span>{channel}</span>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {index === 0 ? "45%" : index === 1 ? "27%" : index === 2 ? "18%" : "10%"}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[hsla(var(--surface-secondary)/0.4)]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))]"
                      style={{ width: ["45%", "27%", "18%", "10%"][index] }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
};

export default DashboardOverview;
