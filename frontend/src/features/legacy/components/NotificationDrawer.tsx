import { BellRing, CheckCheck, Loader2 } from "lucide-react";
import { useNotifications } from "@/infrastructure/shared/contexts/NotificationContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/infrastructure/shared/ui/sheet";
import { Button } from "@/infrastructure/shared/ui/button";
import { Badge } from "@/infrastructure/shared/ui/badge";
import { ScrollArea } from "@/infrastructure/shared/ui/scroll-area";
import { cn } from "@/infrastructure/shared/lib/utils";

const filterOptions = [
  { label: "All", value: "all" },
  { label: "Performance", value: "performance" },
  { label: "Field", value: "field" },
  { label: "Risk", value: "risk" },
] as const;

const priorityTone: Record<string, string> = {
  high: "border-destructive/60 bg-destructive/10 text-destructive",
  medium: "border-amber-500/60 bg-amber-500/10 text-amber-600",
  low: "border-emerald-500/60 bg-emerald-500/10 text-emerald-600",
};

export const NotificationDrawer = () => {
  const {
    filteredNotifications,
    filter,
    setFilter,
    unreadCount,
    markAsRead,
    markAllAsRead,
    isDrawerOpen,
    setDrawerOpen,
    loading,
  } = useNotifications();

  return (
    <Sheet open={isDrawerOpen} onOpenChange={setDrawerOpen}>
      <SheetContent
        side="right"
        className="w-full sm:w-[420px] border-l border-white/10 bg-background/95 backdrop-blur"
      >
        <SheetHeader className="space-y-1">
          <SheetTitle className="flex items-center gap-2 text-lg font-semibold">
            <BellRing className="h-5 w-5 text-primary" />
            Smart Alerts
            {unreadCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-auto bg-primary/10 text-primary"
              >
                {unreadCount} unread
              </Badge>
            )}
          </SheetTitle>
          <p className="text-sm text-muted-foreground">
            Live campaign intelligence and automation updates.
          </p>
        </SheetHeader>

        <div className="mt-4 flex items-center gap-2">
          {filterOptions.map((option) => (
            <Button
              key={option.value}
              size="sm"
              variant={filter === option.value ? "default" : "ghost"}
              className={cn(
                "flex-1 capitalize",
                filter === option.value ? "" : "text-muted-foreground",
              )}
              onClick={() => setFilter(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {filteredNotifications.length} notifications
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={markAllAsRead}
          >
            <CheckCheck className="mr-2 h-4 w-4" /> Mark all as read
          </Button>
        </div>

        <ScrollArea className="mt-4 h-[70vh] pr-4">
          {loading && (
            <div className="flex items-center justify-center py-10 text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading
              alerts...
            </div>
          )}

          {!loading && filteredNotifications.length === 0 && (
            <div className="rounded-lg border border-dashed border-muted-foreground/20 bg-muted/50 p-6 text-center text-muted-foreground">
              No notifications yet. Automation engine will deliver alerts here.
            </div>
          )}

          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => markAsRead(notification.id)}
                className={cn(
                  "w-full rounded-xl border bg-background/60 p-4 text-left transition-shadow hover:shadow-md",
                  notification.read_at
                    ? "border-border"
                    : "border-primary/60 shadow-sm shadow-primary/20",
                  priorityTone[notification.priority] ?? "border-border",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {notification.category}
                    </p>
                    <h3 className="mt-1 text-sm font-semibold leading-tight">
                      {notification.title}
                    </h3>
                  </div>
                  {!notification.read_at && (
                    <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                  )}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {notification.message}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground/80">
                  <span>
                    {notification.created_ago ??
                      new Date(notification.created_at).toLocaleString()}
                  </span>
                  <span className="font-medium capitalize">
                    Priority: {notification.priority}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
