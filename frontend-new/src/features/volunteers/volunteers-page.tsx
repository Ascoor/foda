import { Button, Header } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";
import { useTranslation } from "react-i18next";
import { CheckCircle, CloudOff, Upload } from "lucide-react";

const tasks = ["tasks.checkIn", "tasks.canvassing", "tasks.social", "tasks.training"];

const visitStatuses = [
  { key: "visitStatus.notHome", color: "bg-slate-200" },
  { key: "visitStatus.supporter", color: "bg-emerald-200" },
  { key: "visitStatus.undecided", color: "bg-amber-200" },
  { key: "visitStatus.needsFollowup", color: "bg-rose-200" }
];

export const Volunteers = () => {
  const { t } = useTranslation("volunteers");

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-white to-slate-100 pb-20 dark:from-background-dark dark:via-slate-900 dark:to-slate-950">
      <Header />
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
        <section className="rounded-3xl bg-primary/10 p-6 text-primary shadow">
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-sm opacity-80">{t("subtitle")}</p>
        </section>

        <section className="space-y-4 rounded-3xl bg-white p-6 shadow-lg dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {t("tasks.heading")}
            </h2>
          </div>
          <ul className="space-y-3">
            {tasks.map((taskKey) => (
              <li
                key={taskKey}
                className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm dark:border-slate-700 dark:text-slate-200"
              >
                {t(taskKey)}
                <span className="text-xs text-primary">•</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-lg dark:bg-slate-900">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
              {t("visitStatus.heading")}
            </h2>
            <div className="grid gap-3">
              {visitStatuses.map((status) => (
                <div
                  key={status.key}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700"
                >
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {t(status.key)}
                </span>
                <span className={cn("h-3 w-3 rounded-full", status.color)} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-between gap-4 rounded-3xl bg-white p-6 shadow-lg dark:bg-slate-900">
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {t("upload")}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Capture canvassing photos or leave notes for your coordinator.
              </p>
            </div>
            <Button className="w-full rounded-xl text-base">
              <Upload className="mr-2 h-4 w-4" />
              {t("upload")}
            </Button>
            <div className="flex items-center gap-2 rounded-2xl bg-amber-100 px-4 py-3 text-amber-700 dark:bg-amber-500/10 dark:text-amber-200">
              <CloudOff className="h-5 w-5" />
              <span className="text-sm font-medium">{t("offline")}</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
