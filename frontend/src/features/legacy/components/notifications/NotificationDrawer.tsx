import { ComponentProps } from "react";

import { useNotifications } from "@/infrastructure/shared/contexts/NotificationContext";
import { NotificationDrawer as LegacyNotificationDrawer } from "@/features/legacy/components/NotificationDrawer";

export const NotificationDrawer = (
  props: ComponentProps<typeof LegacyNotificationDrawer>,
) => {
  try {
    useNotifications();
  } catch {
    return null;
  }

  return <LegacyNotificationDrawer {...props} />;
};
