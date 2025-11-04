import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Header } from "@/features/legacy/components/layout/Header";
import { useLanguage } from "@/infrastructure/shared/contexts/LanguageContext";
import { cn } from "@/infrastructure/shared/lib/utils";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

const cardVariants = {
  initial: { opacity: 0, y: 24, filter: "blur(16px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export const AuthLayout = ({
  title,
  subtitle,
  children,
  footer,
}: AuthLayoutProps) => {
  const { direction } = useLanguage();

  return (
    <div
      dir={direction}
      className={cn(
        "relative min-h-screen w-full overflow-hidden",
        "bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.12),_transparent_55%)]",
        "bg-[hsl(var(--background))] text-[hsl(var(--foreground))]",
      )}
    >
      <Header variant="public" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[hsla(var(--primary)/0.05)] to-[hsla(var(--accent)/0.08)]" />
      <main className="relative mx-auto flex min-h-[calc(100vh-4.25rem)] w-full max-w-5xl flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <motion.section
          variants={cardVariants}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "w-full overflow-hidden rounded-[32px] border",
            "border-[hsla(var(--border)/0.25)] bg-[hsla(var(--surface)/0.8)]",
            "shadow-[0_40px_120px_rgba(79,70,229,0.25)] backdrop-blur-2xl",
          )}
        >
          <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
            <div className="relative hidden flex-col justify-between border-e border-[hsla(var(--border)/0.15)] bg-gradient-to-b from-[hsla(var(--primary)/0.18)] via-transparent to-[hsla(var(--accent)/0.12)] px-10 py-12 lg:flex">
              <div className="space-y-6 text-start">
                <h1 className="text-3xl font-bold leading-tight text-gradient-primary">
                  {title}
                </h1>
                <p className="text-base text-muted-foreground">{subtitle}</p>
              </div>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p className="font-semibold text-foreground">{subtitle}</p>
                <p>
                  منصة موحدة تربط فريقك الميداني بالقيادة عبر مؤشرات واضحة
                  ودقيقة.
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="h-1 w-12 rounded-full bg-[hsla(var(--primary)/0.35)]" />
                  <span className="text-muted-foreground">
                    FODA Admin Suite
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-8 p-6 sm:p-10">
              <div className="space-y-3 text-center lg:text-start">
                <h2 className="text-2xl font-semibold text-foreground lg:text-3xl">
                  {title}
                </h2>
                <p className="text-sm text-muted-foreground lg:text-base">
                  {subtitle}
                </p>
              </div>
              {children}
              {footer && (
                <div className="text-center text-sm text-muted-foreground lg:text-start">
                  {footer}
                </div>
              )}
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default AuthLayout;
