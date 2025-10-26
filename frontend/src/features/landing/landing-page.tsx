import { motion } from "framer-motion";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@shared/ui";
import { useAuth } from "@shared/hooks";

const features = [
  "توحيد كل فرقك في لوحة واحدة للتحكم في الحملات",
  "متابعة ذكية للمتطوعين والوكلاء على الأرض",
  "مؤشرات تحليلية لحظية تدعم قراراتك",
  "إدارة متكاملة للمناطق، اللجان، والدوائر",
  "تنبيهات ذكية عند ظهور المخاطر أو الفرص",
  "تكامل مرن مع أدوات الرسائل والتواصل",
];

export const LandingPage = () => {
  const { user, loading } = useAuth();

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="relative min-h-screen bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.12),_transparent_55%)] bg-background text-foreground">
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-8">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <span className="text-base font-semibold">FD</span>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">FODA Platform</p>
          <p className="text-sm font-semibold text-foreground">Campaign Intelligence</p>
        </div>
      </div>
      <nav className="flex items-center gap-3 text-sm">
        <Link to="/login" className="rounded-full px-4 py-2 text-muted-foreground transition hover:text-foreground">
          تسجيل الدخول
        </Link>
        <Button asChild className="rounded-full px-6 py-2 text-base">
          <Link to="/login">جرب المنصة</Link>
        </Button>
      </nav>
    </header>

    <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 pb-24 pt-12 sm:px-10">
      <section className="relative overflow-hidden rounded-[40px] border border-border/20 bg-background/80 shadow-[0_40px_120px_rgba(79,70,229,0.25)] backdrop-blur-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/75 to-transparent" />
        <div className="relative z-10 flex flex-col gap-10 px-8 py-16 sm:px-12 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl space-y-6"
          >
            <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
              منصة FODA الإدارية
            </span>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              منظومة متكاملة لإدارة الحملات والتحليلات الميدانية
            </h1>
            <p className="text-base text-muted-foreground sm:text-lg">
              صممنا الواجهة لتجمع بين الجمال والفاعلية: لوحة قيادة زجاجية، تنقل سلس، وتكامل مع جميع فرقك.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button asChild className="rounded-2xl px-6 py-3 text-base font-semibold">
                <Link to="/login">ابدأ رحلتك الآن</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-2xl px-6 py-3 text-base">
                <Link to="/login">تسجيل الدخول</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <h2 className="text-3xl font-semibold text-foreground">لماذا يثق بنا مدراء الحملات؟</h2>
          <p className="mt-2 text-muted-foreground">
            واجهة موحدة للتخطيط، المتابعة، والتحليل مع دعم كامل للغة العربية واتجاه RTL.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0)" }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[28px] border border-border/20 bg-background/85 p-6 text-start shadow-[0_30px_80px_rgba(79,70,229,0.18)] backdrop-blur-2xl"
            >
              <h3 className="text-lg font-semibold text-foreground">{feature}</h3>
            </motion.div>
          ))}
        </div>
      </section>
    </main>

      <footer className="border-t border-border/20 bg-background/70 py-6 text-center text-sm text-muted-foreground backdrop-blur-xl">
        © {new Date().getFullYear()} منصة FODA. جميع الحقوق محفوظة.
      </footer>
    </div>
  );
};

export default LandingPage;
