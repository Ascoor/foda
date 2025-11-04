import { motion } from "framer-motion";
import { Megaphone, Users2, CalendarClock } from "lucide-react";
import { DashboardCard } from "@/features/legacy/components/dashboard/DashboardCard";

const pageTransition = {
  initial: { opacity: 0, y: 12, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0)" },
  exit: { opacity: 0, y: -12, filter: "blur(6px)" },
};

const campaignHighlights = [
  {
    title: "الحملات الجارية",
    value: "18 حملة",
    description: "تشمل الحملات الرقمية والميدانية",
    trend: 8.1,
    trendLabel: "نمو أسبوعي",
    icon: Megaphone,
  },
  {
    title: "فرق المشاركة",
    value: "64 فريق",
    description: "فرق نشطة موزعة على 9 مناطق",
    trend: 5.4,
    trendLabel: "زيادة خلال آخر 14 يوماً",
    icon: Users2,
  },
  {
    title: "أنشطة الأسبوع",
    value: "142 نشاط",
    description: "يتضمن اللقاءات والندوات والمراسلات",
    trend: 3.8,
    trendLabel: "إجمالي الأنشطة في آخر 7 أيام",
    icon: CalendarClock,
  },
];

const timeline = [
  {
    date: "السبت 12 أكتوبر",
    title: "إطلاق حملة التواصل مع الشباب",
    description: "جدولة سلسلة ورش عمل تفاعلية في الجامعات الرئيسية.",
  },
  {
    date: "الأحد 13 أكتوبر",
    title: "تحديث رسائل الدعم المركزي",
    description: "تخصيص المحتوى الإعلامي وفقاً للبيانات الميدانية الجديدة.",
  },
  {
    date: "الثلاثاء 15 أكتوبر",
    title: "جولة المنسقين في المناطق الشرقية",
    description: "زيارات ميدانية مع فرق المتابعة لتقييم مستوى الحضور",
  },
];

const CampaignsPage = () => (
  <motion.div
    key="dashboard-campaigns"
    variants={pageTransition}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.4 }}
    className="space-y-8"
  >
    <div className="space-y-2">
      <h1 className="text-3xl font-semibold text-foreground">إدارة الحملات</h1>
      <p className="text-muted-foreground">
        متابعة الحملات الجارية، التخطيط للأنشطة القادمة، وتحليل التغطية
        الجغرافية.
      </p>
    </div>

    <section className="grid gap-6 lg:grid-cols-3">
      {campaignHighlights.map((item) => (
        <DashboardCard key={item.title} {...item} />
      ))}
    </section>

    <motion.div
      initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="rounded-[28px] border border-[hsla(var(--border)/0.15)] bg-[hsla(var(--surface)/0.82)] p-6 shadow-[0_35px_90px_rgba(79,70,229,0.18)] backdrop-blur-2xl"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            الجدول الزمني للحملات
          </h2>
          <p className="text-sm text-muted-foreground">
            استعرض نقاط التحول الأساسية خلال الأسبوع الحالي
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {timeline.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-[hsla(var(--border)/0.12)] bg-[hsla(var(--surface-secondary)/0.35)] p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {item.date}
              </span>
              <span className="rounded-full bg-[hsla(var(--primary)/0.1)] px-3 py-1 text-xs font-medium text-[hsl(var(--primary))]">
                مجدول
              </span>
            </div>
            <h3 className="mt-3 text-base font-semibold text-foreground">
              {item.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  </motion.div>
);

export default CampaignsPage;
