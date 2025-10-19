import { BellRing } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { useTranslation } from "react-i18next";

const notifications = [
  { id: 1, titleKey: "newVolunteers", time: "2m" },
  { id: 2, titleKey: "donationReceived", time: "10m" },
  { id: 3, titleKey: "rallyReminder", time: "30m" },
];

export const NotificationList = () => {
  const { t } = useTranslation("dashboard");

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          <BellRing className="h-5 w-5 text-primary" />
          {t("notifications")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {notifications.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="text-sm font-medium text-foreground">
              {t(`notificationsList.${item.titleKey}`)}
            </div>
            <span className="text-xs text-muted-foreground">{item.time}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
