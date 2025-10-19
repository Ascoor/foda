import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { request } from "@shared/lib/api";
import { useNotifications } from "@shared/contexts";
import { useOfflineSync } from "@shared/hooks";

export interface VolunteerTask {
  id: string;
  title: string;
  description: string;
  type: "visit" | "call" | "delivery";
  target?: string;
  dueAt?: string;
  status: "pending" | "completed" | "in_progress";
  priority?: "low" | "medium" | "high";
  lastCompletedAt?: string | null;
  completedOffline?: boolean;
  pendingUploads?: number;
}

export interface VisitAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  dataUrl: string;
}

export interface VisitSubmission {
  notes: string;
  followUpDate?: string;
  attachments: VisitAttachment[];
}

interface VolunteerTaskResponse {
  data?: VolunteerTask[];
}

interface CompleteTaskPayload {
  taskId: string;
  submission: VisitSubmission;
}

const VOLUNTEER_TASKS_QUERY = ["volunteer", "tasks"] as const;

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

export const useVolunteerTasks = () => {
  const queryClient = useQueryClient();
  const { pushNotification } = useNotifications();
  const { isOnline, enqueueMutation } = useOfflineSync();
  const [localTasks, setLocalTasks] = useState<VolunteerTask[]>([]);
  const processedMessagesRef = useRef(new Set<string>());

  const { data: tasksResponse, isLoading: isFetching } = useQuery({
    queryKey: VOLUNTEER_TASKS_QUERY,
    queryFn: async () => {
      const response = await request<VolunteerTaskResponse>({
        url: "/api/volunteer/tasks",
        method: "get",
      });
      return response.data ?? [];
    },
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    if (tasksResponse) {
      setLocalTasks((previous) => {
        const map = new Map(previous.map((task) => [task.id, task]));
        tasksResponse.forEach((task) => {
          map.set(task.id, {
            ...task,
            completedOffline: previous.find((item) => item.id === task.id)?.completedOffline,
            pendingUploads: previous.find((item) => item.id === task.id)?.pendingUploads,
          });
        });
        return Array.from(map.values());
      });
    }
  }, [tasksResponse]);

  const completeTaskMutation = useMutation({
    mutationFn: async ({ taskId, submission }: CompleteTaskPayload) => {
      await request({
        url: `/api/volunteer/tasks/${taskId}/complete`,
        method: "post",
        data: submission,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: VOLUNTEER_TASKS_QUERY });
    },
  });

  const markTaskAsCompletedLocally = useCallback(
    (taskId: string, submission: VisitSubmission, completedOffline: boolean) => {
      setLocalTasks((previous) =>
        previous.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status: "completed",
                completedOffline,
                pendingUploads: completedOffline ? submission.attachments.length : 0,
                lastCompletedAt: new Date().toISOString(),
              }
            : task,
        ),
      );
    },
    [],
  );

  const completeTask = useCallback(
    async (taskId: string, submission: VisitSubmission) => {
      if (isOnline) {
        await completeTaskMutation.mutateAsync({ taskId, submission });
        markTaskAsCompletedLocally(taskId, submission, false);
        return;
      }

      await enqueueMutation({
        url: `/api/volunteer/tasks/${taskId}/complete`,
        method: "POST",
        body: {
          ...submission,
          recordedAt: new Date().toISOString(),
        },
        metadata: {
          entity: "volunteer-task",
          taskId,
        },
      });

      markTaskAsCompletedLocally(taskId, submission, true);
    },
    [completeTaskMutation, enqueueMutation, isOnline, markTaskAsCompletedLocally],
  );

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      if (!event.data || event.data.type !== "PUSH_NOTIFICATION") return;
      const payload = event.data.payload as Record<string, any>;
      const messageId = String(payload?.messageId ?? payload?.id ?? Date.now());

      if (processedMessagesRef.current.has(messageId)) return;
      processedMessagesRef.current.add(messageId);

      pushNotification({
        id: Number(messageId) || Date.now(),
        type: "field",
        category: (payload?.data?.category as string) ?? payload?.category ?? "volunteer",
        title: payload?.notification?.title ?? payload?.title ?? "Volunteer alert",
        message: payload?.notification?.body ?? payload?.body ?? "New field update received.",
        priority:
          (payload?.data?.priority as "low" | "medium" | "high") ??
          (payload?.priority as "low" | "medium" | "high") ??
          "medium",
        meta: payload?.data ?? payload ?? {},
        read_at: null,
        created_at: new Date().toISOString(),
      });
    };

    navigator.serviceWorker.addEventListener("message", handleMessage);

    const registerPushChannel = async () => {
      try {
        const registration = await navigator.serviceWorker.ready;
        const existingSubscription = await registration.pushManager.getSubscription();
        const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

        if (!vapidKey) return;

        if (typeof Notification !== "undefined" && Notification.permission === "default") {
          await Notification.requestPermission();
        }

        if (typeof Notification !== "undefined" && Notification.permission !== "granted") {
          return;
        }

        const subscription =
          existingSubscription ??
          (await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidKey),
          }));

        const payload = subscription.toJSON();

        await request({
          url: "/api/volunteer/push/subscriptions",
          method: existingSubscription ? "put" : "post",
          data: payload,
        });
      } catch (error) {
        console.error("Failed to initialise push notifications", error);
      }
    };

    registerPushChannel();

    return () => {
      navigator.serviceWorker.removeEventListener("message", handleMessage);
    };
  }, [pushNotification]);

  const tasks = useMemo(() => localTasks, [localTasks]);

  return {
    tasks,
    isLoading: isFetching,
    completeTask,
  };
};
