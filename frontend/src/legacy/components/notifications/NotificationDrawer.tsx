import { ComponentProps } from "react";

import { useNotifications } from "@shared/contexts/NotificationContext";
import { NotificationDrawer as LegacyNotificationDrawer } from "@legacy/components/NotificationDrawer";

export const NotificationDrawer = (props: ComponentProps<typeof LegacyNotificationDrawer>) => {
  try {
    useNotifications();
  } catch {
    return null;
  }

  return <LegacyNotificationDrawer {...props} />;
};
