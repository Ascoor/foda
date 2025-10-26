import type { BaseEntity, Nullable } from "./common";

export type NotificationChannel = "database" | "mail" | "sms" | "push";

export interface Notification extends BaseEntity {
  type: string;
  title: string;
  body: string;
  channel: NotificationChannel;
  read_at?: Nullable<string>;
  sent_at?: Nullable<string>;
  metadata?: Record<string, unknown>;
}
