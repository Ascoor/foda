import type { BaseEntity } from "./common";

export type AnalyticsScope = "organization" | "campaign" | "election";

export interface AnalyticsSnapshot extends BaseEntity {
  scope: AnalyticsScope;
  scope_uuid: string;
  captured_at: string;
  payload: Record<string, unknown>;
  metrics_version: string;
}
