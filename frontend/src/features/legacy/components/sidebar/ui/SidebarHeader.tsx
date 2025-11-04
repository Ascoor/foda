import * as React from "react";

import { cn } from "@/infrastructure/shared/lib/utils";

export const SidebarHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-4", className)}
      {...props}
    />
  ),
);

SidebarHeader.displayName = "SidebarHeader";
