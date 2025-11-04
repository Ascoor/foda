import * as React from "react";

import { cn } from "@/infrastructure/shared/lib/utils";
import { Separator } from "@/infrastructure/shared/ui/separator";

export const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => (
  <Separator
    ref={ref}
    data-sidebar="separator"
    className={cn("mx-4 w-auto bg-sidebar-border", className)}
    {...props}
  />
));

SidebarSeparator.displayName = "SidebarSeparator";
