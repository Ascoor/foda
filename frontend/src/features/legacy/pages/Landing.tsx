import { motion } from "framer-motion";
import { Header } from "@/features/legacy/components/layout/Header";
import { Button } from "@/infrastructure/shared/ui/button";
import landingImage from "@/assets/img/landing.webp";

const features = [
  "توحيد كل فرقك في لوحة واحدة للتحكم في الحملات",
  "متابعة ذكية للمتطوعين والوكلاء على الأرض",
  "مؤشرات تحليلية لحظية تدعم قراراتك",
  "إدارة متكاملة للمناطق، اللجان، والدوائر",
  "تنبيهات ذكية عند ظهور المخاطر أو الفرص",
  "تكامل مرن مع أدوات الرسائل والتواصل",
];

const LandingPage = () => (
  <div className="relative min-h-screen bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.12),_transparent_55%)] bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
    <Header variant="public" />
    <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-24 px-4 pb-24 pt-20 sm:px-6 lg:px-10">
      <section className="relative overflow-hidden rounded-[40px] border border-[hsla(var(--border)/0.15)] bg-[hsla(var(--surface)/0.85)] shadow-[0_40px_120px_rgba(79,70,229,0.25)] backdrop-blur-2xl">
        <div className="absolute inset-0">
          <img
            src={landingImage}
            alt="خلفية المنصة"
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[hsla(var(--background)/0.92)] via-[hsla(var(--background)/0.6)] to-transparent" />
        </div>
        <div className="relative z-10 flex flex-col gap-10 px-8 py-16 sm:px-12 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl space-y-6"
          >
            <span className="inline-flex items-center rounded-full bg-[hsla(var(--primary)/0.12)] px-4 py-1 text-sm font-semibold text-[hsl(var(--primary))]">
              منصة FODA الإدارية
            </span>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              منظومة متكاملة لإدارة الحملات والتحليلات الميدانية
            </h1>
            <p className="text-base text-muted-foreground sm:text-lg">
              صممنا الواجهة لتجمع بين الجمال والفاعلية: لوحة قيادة زجاجية، تنقل
              سلس، وتكامل مع جميع فرقك.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button
                asChild
                className="rounded-2xl bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] px-6 py-3 text-base font-semibold shadow-lg shadow-[hsla(var(--primary)/0.35)]"
              >
                <a href="/auth/register">ابدأ رحلتك الآن</a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-2xl px-6 py-3 text-base"
              >
                <a href="/auth/login">تسجيل الدخول</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <h2 className="text-3xl font-semibold text-foreground">
            لماذا يثق بنا مدراء الحملات؟
          </h2>
          <p className="mt-2 text-muted-foreground">
            واجهة موحدة للتخطيط، المتابعة، والتحليل مع دعم كامل للغة العربية
            واتجاه RTL.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0)" }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[28px] border border-[hsla(var(--border)/0.15)] bg-[hsla(var(--surface)/0.85)] p-6 text-start shadow-[0_30px_80px_rgba(79,70,229,0.18)] backdrop-blur-2xl"
            >
              <h3 className="text-lg font-semibold text-foreground">
                {feature}
              </h3>
            </motion.div>
          ))}
        </div>
      </section>
    </main>

    <footer className="border-t border-[hsla(var(--border)/0.15)] bg-[hsla(var(--surface)/0.75)] py-6 text-center text-sm text-muted-foreground backdrop-blur-xl">
      © {new Date().getFullYear()} منصة FODA. جميع الحقوق محفوظة.
    </footer>
  </div>
);

export default LandingPage;
