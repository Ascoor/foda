import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { request } from "@shared/lib/api";
import { useNotifications } from "@shared/contexts";

export interface SystemMetrics {
  apiLatencyMs: number;
  socketUptime: number;
  errorsPerMinute: number;
  throughputPerMinute: number;
  timestamp: string;
}

export interface MetricsHistoryPoint extends SystemMetrics {
  label: string;
}

export interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  context: string;
  createdAt: string;
  ipAddress?: string;
}

export interface SecurityAlert {
  id: string;
  level: "info" | "warning" | "critical";
  message: string;
  triggeredAt: string;
  area?: string;
}

interface MetricsResponse {
  data: SystemMetrics;
}

interface LogsResponse {
  data: AuditLogEntry[];
}

interface SecurityResponse {
  alerts: SecurityAlert[];
}

const METRICS_QUERY_KEY = ["ops", "metrics"] as const;
const LOGS_QUERY_KEY = ["ops", "logs"] as const;
const SECURITY_QUERY_KEY = ["ops", "security"] as const;

export const useOps = () => {
  const { pushNotification } = useNotifications();
  const processedAlerts = useRef(new Set<string>());
  const [history, setHistory] = useState<MetricsHistoryPoint[]>([]);

  const metricsQuery = useQuery({
    queryKey: METRICS_QUERY_KEY,
    queryFn: async () => {
      const response = await request<MetricsResponse>({
        url: "/api/ops/metrics",
        method: "get",
      });
      return response.data;
    },
    refetchInterval: 30000,
  });

  const logsQuery = useQuery({
    queryKey: LOGS_QUERY_KEY,
    queryFn: async () => {
      const response = await request<LogsResponse>({
        url: "/api/ops/logs",
        method: "get",
      });
      return response.data ?? [];
    },
    refetchInterval: 60000,
  });

  const securityQuery = useQuery({
    queryKey: SECURITY_QUERY_KEY,
    queryFn: async () => {
      const response = await request<SecurityResponse>({
        url: "/api/ops/security",
        method: "get",
      });
      return response.alerts ?? [];
    },
    refetchInterval: 15000,
  });

  useEffect(() => {
    if (!metricsQuery.data) return;

    setHistory((prev) => {
      const next = [
        ...prev,
        {
          ...metricsQuery.data,
          label: new Intl.DateTimeFormat("ar-EG", {
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date(metricsQuery.data.timestamp)),
        },
      ];

      return next.slice(-20);
    });
  }, [metricsQuery.data]);

  useEffect(() => {
    if (!securityQuery.data?.length) return;

    securityQuery.data.forEach((alert) => {
      if (processedAlerts.current.has(alert.id)) return;

      processedAlerts.current.add(alert.id);

      if (alert.level === "critical") {
        pushNotification({
          id: Number(alert.id) || Date.now(),
          type: "risk",
          category: alert.area ?? "security",
          title: "تنبيه أمني عاجل",
          message: alert.message,
          priority: "high",
          meta: { triggeredAt: alert.triggeredAt, area: alert.area },
          read_at: null,
          created_at: alert.triggeredAt,
        });
      }
    });
  }, [pushNotification, securityQuery.data]);

  const refresh = useCallback(async () => {
    await Promise.all([
      metricsQuery.refetch(),
      logsQuery.refetch(),
      securityQuery.refetch(),
    ]);
  }, [logsQuery, metricsQuery, securityQuery]);

  const metrics = useMemo(() => metricsQuery.data, [metricsQuery.data]);

  return {
    metrics,
    metricsHistory: history,
    logs: logsQuery.data ?? [],
    alerts: securityQuery.data ?? [],
    isLoading: {
      metrics: metricsQuery.isLoading,
      logs: logsQuery.isLoading,
      alerts: securityQuery.isLoading,
    },
    refresh,
    lastUpdated: metricsQuery.data?.timestamp ?? null,
  };
};
