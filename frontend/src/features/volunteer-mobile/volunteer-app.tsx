import { Suspense } from "react";
import { motion } from "framer-motion";

import { TaskList } from "./components/task-list";
import { useVolunteerTasks } from "./hooks/use-volunteer-tasks";
import { useOfflineSync } from "@shared/hooks";

export const VolunteerApp = () => {
  const { tasks, completeTask, isLoading } = useVolunteerTasks();
  const { isOnline, syncNow, isSyncing, queue, lastSyncedAt } = useOfflineSync();

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1f2937] p-4 text-white">
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-lg">
          <div>
            <p className="text-xs uppercase tracking-widest text-white/60">
              تطبيق المتطوعين
            </p>
            <h1 className="text-lg font-bold">📋 مهامي اليومية</h1>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs ${isOnline ? "bg-emerald-500/20 text-emerald-200" : "bg-amber-500/20 text-amber-200"}`}
            >
              <span className="inline-block h-2 w-2 rounded-full bg-current" />
              {isOnline ? "متصل" : "بدون اتصال"}
            </span>
            <button
              onClick={() => void syncNow()}
              disabled={!queue.length || !isOnline || isSyncing}
              className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSyncing ? "جاري المزامنة" : "Sync Now"}
            </button>
          </div>
        </header>

        <motion.section
          layout
          className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-lg"
        >
          {!isOnline && queue.length > 0 && (
            <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-3 text-xs text-amber-100">
              لديك {queue.length} إجراءً سينفذ تلقائياً فور اتصالك بالإنترنت.
            </div>
          )}
          {lastSyncedAt && (
            <p className="text-right text-xs text-white/50">
              آخر مزامنة: {new Intl.DateTimeFormat("ar-EG", {
                hour: "2-digit",
                minute: "2-digit",
              }).format(lastSyncedAt)}
            </p>
          )}
          <Suspense fallback={<div className="text-center text-sm text-white/60">جارٍ التحميل...</div>}>
            <TaskList tasks={tasks} onComplete={completeTask} isLoading={isLoading} />
          </Suspense>
        </motion.section>
      </section>
    </main>
  );
};
