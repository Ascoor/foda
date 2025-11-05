import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/infrastructure/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/infrastructure/shared/ui/card";
import { Switch } from "@/infrastructure/shared/ui/switch";
import { Badge } from "@/infrastructure/shared/ui/badge";
import { request } from "@/infrastructure/shared/lib/api";
import { cn } from "@/infrastructure/shared/lib/utils";
import { CalendarClock, RefreshCw } from "lucide-react";

interface AutomationTask {
  id: number;
  task: string;
  display_name: string;
  description: string | null;
  is_enabled: boolean;
  status: string | null;
  last_run_at: string | null;
  meta: Record<string, unknown>;
}

interface AutomationCollectionResponse {
  data: AutomationTask[];
}

const formatDate = (value: string | null) => {
  if (!value) return "Never";
  const date = new Date(value);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

export const AutomationDashboard = () => {
  const [tasks, setTasks] = useState<AutomationTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await request<AutomationCollectionResponse>({
          url: "/automation/config",
          method: "get",
        });
        setTasks(response.data ?? []);
      } catch (error) {
        console.error("Failed to load automation config", error);
        toast.error("Unable to load automation settings.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleToggle = async (taskName: string, isEnabled: boolean) => {
    setActiveTask(taskName);
    try {
      const response = await request<AutomationCollectionResponse>({
        url: "/automation/config",
        method: "put",
        data: {
          tasks: [{ task: taskName, is_enabled: isEnabled }],
        },
      });

      const updated = response.data?.[0];
      if (updated) {
        setTasks((prev) =>
          prev.map((task) =>
            task.task === taskName
              ? { ...task, is_enabled: updated.is_enabled }
              : task,
          ),
        );
      }
      toast.success(`Automation task ${isEnabled ? "enabled" : "paused"}.`);
    } catch (error) {
      console.error("Failed to update automation task", error);
      toast.error("Unable to update automation task.");
    } finally {
      setActiveTask(null);
    }
  };

  const handleTrigger = async (taskName: string) => {
    setActiveTask(taskName);
    try {
      const response = await request<{ data: AutomationTask }>({
        url: `/automation/config/${taskName}/trigger`,
        method: "post",
      });

      const updated = response.data;
      setTasks((prev) =>
        prev.map((task) =>
          task.task === taskName ? { ...task, ...updated } : task,
        ),
      );

      toast.success("Automation task triggered successfully.");
    } catch (error) {
      console.error("Failed to trigger automation task", error);
      toast.error("Failed to trigger automation task.");
    } finally {
      setActiveTask(null);
    }
  };

  const orderedTasks = useMemo(() => {
    return [...tasks].sort((a, b) =>
      a.display_name.localeCompare(b.display_name),
    );
  }, [tasks]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="glass-card p-6">
        <h1 className="text-3xl font-bold text-gradient-primary">
          Automation Control Center
        </h1>
        <p className="mt-2 text-muted-foreground">
          Toggle campaign automation, review last execution details, and trigger
          urgent jobs on-demand.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {loading && (
          <div className="md:col-span-2 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/30 p-8 text-center text-muted-foreground">
            Loading automation tasks...
          </div>
        )}

        {!loading &&
          orderedTasks.map((task) => (
            <Card
              key={task.task}
              className={cn(
                "border border-white/10 bg-background/60 backdrop-blur",
                !task.is_enabled && "opacity-80",
              )}
            >
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-xl font-semibold">
                    {task.display_name}
                  </CardTitle>
                  <CardDescription>{task.description}</CardDescription>
                </div>
                <Switch
                  checked={task.is_enabled}
                  onCheckedChange={(checked) =>
                    handleToggle(task.task, checked)
                  }
                  disabled={activeTask === task.task}
                />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4" /> Last run
                  </span>
                  <span>{formatDate(task.last_run_at)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Status</span>
                  <Badge
                    variant={
                      task.status === "failed" ? "destructive" : "secondary"
                    }
                    className="capitalize"
                  >
                    {task.status ?? "idle"}
                  </Badge>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTrigger(task.task)}
                    disabled={activeTask === task.task}
                  >
                    <RefreshCw
                      className={cn(
                        "mr-2 h-4 w-4",
                        activeTask === task.task && "animate-spin",
                      )}
                    />
                    Run now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </motion.div>
  );
};
