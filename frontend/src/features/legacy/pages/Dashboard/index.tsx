import { motion } from "framer-motion";

import { Activity, Target, TrendingUp, Users } from "lucide-react";

import { BarChartComponent } from "@/features/legacy/components/dashboard/BarChartComponent";
import { DashboardCard } from "@/features/legacy/components/dashboard/DashboardCard";
import { LineChartComponent } from "@/features/legacy/components/dashboard/LineChartComponent";
import { PieChartComponent } from "@/features/legacy/components/dashboard/PieChartComponent";

const pageTransition = {
  initial: { opacity: 0, y: 18, filter: "blur(10px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -18, filter: "blur(10px)" },
};

const heroHighlights = [
  {
    title: "نسبة الإنجاز",
    value: "86%",
    caption: "المستهدف المحقق هذا الربع",
  },
  {
    title: "متوسط زمن الاستجابة",
    value: "2.4 ساعة",
    caption: "للبلاغات الميدانية",
  },
  {
    title: "القنوات الفعّالة",
    value: "رسائل + فرق",
    caption: "أكثر وسائل التواصل تأثيراً",
  },
];

const activityFeed = [
  "تمت المصادقة على 12 مراقباً جديداً في القطاع الغربي",
  "تفعيل حملة الرسائل الصوتية للناخبين المترددين",
  "مؤشر المخاطر انخفض 8% بعد تحديث قواعد البيانات",
  "تسجيل 4 فعاليات ميدانية خلال عطلة نهاية الأسبوع",
];

const channelDistribution = [
  { label: "الفرق الميدانية", value: "45%" },
  { label: "الرسائل الرقمية", value: "27%" },
  { label: "المكالمات", value: "18%" },
  { label: "الفعاليات", value: "10%" },
];

const DashboardOverview = () => {
  const stats = [
    {
      title: "إجمالي الناخبين",
      value: "24,680",
      description: "المسجلون في الحملات النشطة",
      trend: 6.5,
      trendLabel: "خلال آخر 30 يوماً",
      icon: Users,
      delay: 0,
    },
    {
      title: "نسبة التفاعل",
      value: "78%",
      description: "متوسط استجابة الرسائل الميدانية",
      trend: 3.2,
      trendLabel: "مقارنة بالشهر الماضي",
      icon: Activity,
      delay: 0.05,
    },
    {
      title: "نمو الحملات",
      value: "+12",
      description: "حملات جديدة تم إطلاقها",
      trend: 12.4,
      trendLabel: "آخر أسبوعين",
      icon: Target,
      delay: 0.1,
    },
    {
      title: "مؤشر الثقة",
      value: "92",
      description: "قياس شامل لرضا الفرق الميدانية",
      trend: -1.4,
      trendLabel: "المعدل اليومي",
      icon: TrendingUp,
      delay: 0.15,
    },
  ];

  return (
    <motion.div
      key="dashboard-overview"
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-10"
    >
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative overflow-hidden rounded-[32px] border border-[hsla(var(--border)/0.12)] bg-[hsla(var(--surface)/0.8)] p-8 shadow-[0_45px_95px_rgba(79,70,229,0.18)] backdrop-blur-2xl"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[hsla(var(--primary)/0.18)] via-transparent to-[hsla(var(--accent)/0.16)] opacity-80" />
          <div className="absolute -top-24 left-16 h-32 w-32 rounded-full bg-[radial-gradient(circle,_hsla(var(--primary)/0.24),_transparent_70%)] blur-3xl" />
          <div className="absolute -bottom-24 right-16 h-40 w-40 rounded-full bg-[radial-gradient(circle,_hsla(var(--accent)/0.24),_transparent_70%)] blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[hsla(var(--primary)/0.15)] px-4 py-1 text-xs font-semibold text-[hsl(var(--primary))]">
              لوحة القيادة الميدانية
            </span>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
                متابعة حية لأداء الحملات والفرق التنظيمية
              </h1>
              <p className="max-w-2xl text-sm text-muted-foreground">
                لوحة رقمية حديثة تجمع المؤشرات الرئيسية، حالة الحملات، وإشعارات
                المخاطر في مكان واحد لتسهيل اتخاذ القرارات السريعة.
              </p>
            </div>
            <div className="grid gap-4 text-sm sm:grid-cols-3">
              {heroHighlights.map((highlight) => (
                <div
                  key={highlight.title}
                  className="rounded-2xl border border-[hsla(var(--border)/0.15)] bg-[hsla(var(--surface-secondary)/0.35)] p-4 shadow-sm"
                >
                  <p className="text-xs text-muted-foreground">
                    {highlight.title}
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {highlight.value}
                  </p>
                  <p className="text-xs text-muted-foreground/80">
                    {highlight.caption}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid w-full max-w-sm grid-cols-2 gap-3 rounded-[28px] border border-[hsla(var(--border)/0.12)] bg-[hsla(var(--surface-secondary)/0.45)] p-4 text-sm">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">
                تقارير اليوم
              </span>
              <span className="text-2xl font-semibold text-foreground">64</span>
              <span className="text-xs text-emerald-400">+12% نمو</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">
                إشعارات المخاطر
              </span>
              <span className="text-2xl font-semibold text-foreground">5</span>
              <span className="text-xs text-rose-400">-3% عن الأمس</span>
            </div>
            <div className="col-span-2 rounded-2xl border border-[hsla(var(--border)/0.1)] bg-[hsla(var(--surface)/0.6)] p-3 text-xs text-muted-foreground">
              آخر تحديث منذ 6 دقائق • مزامنة تلقائية مع النظام المركزي
            </div>
          </div>
        </div>
      </motion.section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <DashboardCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <BarChartComponent
            title="حجم الأنشطة الأسبوعية"
            subtitle="عدد الفعاليات الميدانية عبر الفرق"
            delay={0.1}
          />
        </div>
        <div className="xl:col-span-2 grid gap-6">
          <LineChartComponent
            title="معدل المشاركة"
            subtitle="تفاعل الناخبين عبر القنوات"
            delay={0.12}
          />
          <PieChartComponent title="توزيع الحملات" delay={0.14} />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <motion.div
          className="relative overflow-hidden rounded-[28px] border border-[hsla(var(--border)/0.12)] bg-[hsla(var(--surface)/0.82)] p-6 shadow-[0_45px_95px_rgba(79,70,229,0.18)] backdrop-blur-2xl"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[hsla(var(--primary)/0.14)] via-transparent to-[hsla(var(--accent)/0.12)]" />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  أحدث الأنشطة
                </h3>
                <p className="text-sm text-muted-foreground">
                  متابعة مباشرة لأعمال الفرق الميدانية
                </p>
              </div>
              <span className="rounded-full bg-[hsla(var(--primary)/0.15)] px-3 py-1 text-xs font-semibold text-[hsl(var(--primary))]">
                مباشر الآن
              </span>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {activityFeed.map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  className="rounded-2xl border border-[hsla(var(--border)/0.12)] bg-[hsla(var(--surface-secondary)/0.45)] px-4 py-3 text-foreground"
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.div
          className="relative overflow-hidden rounded-[28px] border border-[hsla(var(--border)/0.12)] bg-[hsla(var(--surface)/0.82)] p-6 shadow-[0_45px_95px_rgba(79,70,229,0.18)] backdrop-blur-2xl"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12 }}
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[hsla(var(--accent)/0.14)] via-transparent to-[hsla(var(--primary)/0.14)]" />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  قنوات المتابعة
                </h3>
                <p className="text-sm text-muted-foreground">
                  توزيع نقاط الاتصال خلال الأسبوع
                </p>
              </div>
              <span className="rounded-full bg-[hsla(var(--accent)/0.18)] px-3 py-1 text-xs font-semibold text-[hsl(var(--accent))]">
                محدث آلياً
              </span>
            </div>
            <div className="space-y-4 text-sm text-muted-foreground">
              {channelDistribution.map((channel, index) => (
                <div key={channel.label} className="space-y-2">
                  <div className="flex items-center justify-between text-foreground">
                    <span>{channel.label}</span>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {channel.value}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[hsla(var(--surface-secondary)/0.4)]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[hsl(var(--primary))] via-[hsl(var(--accent))] to-[hsl(var(--primary))]"
                      style={{ width: channel.value }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
};

export default DashboardOverview;
