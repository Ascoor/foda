import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import type { VolunteerTask, VisitSubmission } from "../hooks/use-volunteer-tasks";
import { VisitForm } from "./visit-form";

interface TaskListProps {
  tasks: VolunteerTask[];
  onComplete: (taskId: string, payload: VisitSubmission) => Promise<void>;
  isLoading?: boolean;
}

const priorityColor: Record<NonNullable<VolunteerTask["priority"]>, string> = {
  low: "bg-emerald-500/10 text-emerald-600",
  medium: "bg-amber-500/10 text-amber-600",
  high: "bg-rose-500/10 text-rose-600",
};

export const TaskList = ({ tasks, onComplete, isLoading }: TaskListProps) => {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="grid gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-2xl bg-white/5"
          />
        ))}
      </div>
    );
  }

  if (!tasks.length) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-center text-sm text-white/70">
        لا توجد مهام لهذا اليوم. استمتع بوقتك واستعد للجولة القادمة!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        const isExpanded = expandedTaskId === task.id;
        return (
          <motion.article
            key={task.id}
            layout
            className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-md"
          >
            <button
              className="flex w-full items-start justify-between gap-3 text-right"
              onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
            >
              <div className="flex flex-1 flex-col gap-1">
                <h2 className="text-base font-semibold text-white">
                  {task.title}
                </h2>
                <p className="text-sm text-white/70">{task.description}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-indigo-200">
                    {task.type === "visit" ? "زيارة ميدانية" : task.type === "call" ? "اتصال" : "تسليم"}
                  </span>
                  {task.priority && (
                    <span className={`rounded-full px-3 py-1 ${priorityColor[task.priority]}`}>
                      أولوية {task.priority === "high" ? "قصوى" : task.priority === "medium" ? "متوسطة" : "منخفضة"}
                    </span>
                  )}
                  {task.dueAt && (
                    <span className="rounded-full bg-slate-500/10 px-3 py-1 text-slate-200">
                      {new Intl.DateTimeFormat("ar-EG", {
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(new Date(task.dueAt))}
                    </span>
                  )}
                  {task.completedOffline && (
                    <span className="rounded-full bg-amber-500/10 px-3 py-1 text-amber-300">
                      بانتظار المزامنة ({task.pendingUploads ?? 0})
                    </span>
                  )}
                  {task.status === "completed" && !task.completedOffline && (
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-200">
                      أُنجزت في {task.lastCompletedAt ? new Intl.DateTimeFormat("ar-EG", {
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(new Date(task.lastCompletedAt)) : "الآن"}
                    </span>
                  )}
                </div>
              </div>
              <span className="shrink-0 text-xs text-white/60">
                {isExpanded ? "إخفاء" : "فتح"}
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="pt-4">
                    <VisitForm
                      taskId={task.id}
                      onSubmit={onComplete}
                      disabled={task.status === "completed" && !task.completedOffline}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.article>
        );
      })}
    </div>
  );
};
