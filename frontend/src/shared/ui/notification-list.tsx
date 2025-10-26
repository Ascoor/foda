import { useMemo } from "react";
import { BellRing } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { useNotifications } from "@shared/contexts/NotificationContext";
import { useLanguage } from "@shared/hooks";

export const NotificationList = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { filteredNotifications, loading } = useNotifications();

  const items = useMemo(
    () => filteredNotifications.slice(0, 4),
    [filteredNotifications],
  );

  const formatTimestamp = (value: string | null) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "—";
    }
    return date.toLocaleTimeString(language, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          <BellRing className="h-5 w-5 text-primary" />
          {t("dashboard.notifications")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((key) => (
              <div
                key={key}
                className="h-10 rounded-[var(--radius-md)] bg-muted/40 animate-pulse"
              />
            ))}
          </div>
        ) : items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-[var(--radius-lg)] border border-border/40 bg-surface/60 px-3 py-2 backdrop-blur"
            >
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">
                  {item.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  {item.category}
                </span>
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                {formatTimestamp(item.created_at)}
              </span>
            </div>
          ))
        ) : (
          <p className="rounded-[var(--radius-lg)] bg-muted/20 px-3 py-4 text-sm text-muted-foreground">
            {t("dashboard.noNotifications")}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
