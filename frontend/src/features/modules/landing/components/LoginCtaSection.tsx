import { useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/infrastructure/shared/ui/dialog";
import { Button } from "@/infrastructure/shared/ui/button";
import { LoginForm } from "@/features/legacy/components/auth/LoginForm";
import { useLoginCtaAnimation } from "../hooks/useLoginCtaAnimation";

export const LoginCtaSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useTranslation();
  useLoginCtaAnimation(sectionRef);

  return (
    <section ref={sectionRef} className="relative z-10 -mt-24 px-4">
      <div
        data-login-card
        className="mx-auto flex max-w-5xl flex-col justify-between gap-6 rounded-3xl border border-white/10 bg-white p-8 text-slate-900 shadow-2xl md:flex-row md:items-center"
      >
        <div className="space-y-3">
          <h2 className="text-2xl font-bold md:text-3xl">
            هل لديك حساب بالفعل؟
          </h2>
          <p className="text-sm text-slate-600 md:text-base">
            قم بتسجيل الدخول لمتابعة حملتك الانتخابية، توزيع المهام، وقراءة
            التحليلات في الوقت الفعلي.
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-blue-900/80">
            <span className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1">
              تقارير فورية
            </span>
            <span className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1">
              خرائط تفاعلية
            </span>
            <span className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1">
              متابعة ميدانية
            </span>
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="bg-blue-700 text-white hover:bg-blue-800"
            >
              تسجيل الدخول الآن
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t("auth.login")}</DialogTitle>
            </DialogHeader>
            <LoginForm />
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};
