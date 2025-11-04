import { useEffect, useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { Calendar, Clock, Layers, ListTree } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/infrastructure/shared/ui/card";
import { Badge } from "@/infrastructure/shared/ui/badge";
import { Button } from "@/infrastructure/shared/ui/button";
import { SafeDataRenderer } from "@/infrastructure/shared/ui/safe-data-renderer";
import { Skeleton } from "@/infrastructure/shared/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/infrastructure/shared/ui/table";
import { fetchActivities } from "./api";
import { useCampaignContext } from "@/infrastructure/shared/contexts/CampaignContext";
import type { ActivitiesResponse, ActivityTimelineItem } from "./types";

const VIEW_MODES = [
  { value: "timeline", label: "Timeline", icon: ListTree },
  { value: "table", label: "Table", icon: Layers },
] as const;

type ViewMode = (typeof VIEW_MODES)[number]["value"];

const groupByDate = (items: ActivityTimelineItem[]) => {
  const map = new Map<string, ActivityTimelineItem[]>();
  items.forEach((item) => {
    const iso = item.reported_at ?? item.created_at;
    const key = format(parseISO(iso), "yyyy-MM-dd");
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)?.push(item);
  });

  return Array.from(map.entries()).map(([date, entries]) => ({
    date,
    displayDate: format(parseISO(date), "MMMM d, yyyy"),
    entries: entries.sort(
      (a, b) =>
        (a.reported_at ?? a.created_at).localeCompare(
          b.reported_at ?? b.created_at,
        ) * -1,
    ),
  }));
};

export const ActivitiesTimeline = () => {
  const { campaignId } = useCampaignContext();
  const [response, setResponse] = useState<ActivitiesResponse | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("timeline");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadActivities = async (pageNumber = 1, append = false) => {
    if (append) {
      setIsLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const payload = await fetchActivities({ page: pageNumber }, campaignId);
      setResponse((prev) => {
        if (append && prev) {
          return {
            ...payload,
            data: [...prev.data, ...payload.data],
          };
        }
        return payload;
      });
      setPage(pageNumber);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load activities",
      );
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, [campaignId]);

  const grouped = useMemo(() => groupByDate(response?.data ?? []), [response]);

  const canLoadMore = response
    ? response.meta.current_page < response.meta.last_page
    : false;

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-primary" />
          <div>
            <CardTitle className="text-xl">Activity timeline</CardTitle>
            <p className="text-sm text-muted-foreground">
              Track field operations, incidents, and reports grouped by day.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {VIEW_MODES.map(({ value, label, icon: Icon }) => (
            <Button
              key={value}
              variant={viewMode === value ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode(value)}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <SafeDataRenderer
          data={response ? [response] : []}
          loading={loading}
          error={error}
          onRetry={() => loadActivities(page)}
          emptyTitle="No activity yet"
          emptyDescription="When field teams submit reports, they will appear here."
        >
          {() => (
            <div className="space-y-6">
              {viewMode === "timeline" ? (
                <div className="space-y-6">
                  {grouped.map((group) => (
                    <div key={group.date} className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-1 w-10 rounded-full bg-primary/60" />
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase">
                          {group.displayDate}
                        </h3>
                      </div>
                      <div className="space-y-3 border-l border-dashed border-primary/30 pl-6">
                        {group.entries.map((activity) => (
                          <div
                            key={activity.id}
                            className="relative flex flex-col gap-2"
                          >
                            <span className="absolute -left-[13px] top-1 h-3 w-3 rounded-full bg-primary shadow-lg" />
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="secondary">{activity.type}</Badge>
                              {activity.status && (
                                <Badge variant="outline">
                                  {activity.status}
                                </Badge>
                              )}
                              {activity.area?.name && (
                                <Badge
                                  variant="outline"
                                  className="bg-muted/50"
                                >
                                  {activity.area.name}
                                </Badge>
                              )}
                              {activity.support_score !== null && (
                                <Badge
                                  variant="default"
                                  className="bg-primary/90"
                                >
                                  Support {activity.support_score}%
                                </Badge>
                              )}
                            </div>
                            <h4 className="text-base font-semibold">
                              {activity.title}
                            </h4>
                            {activity.description && (
                              <p className="text-sm text-muted-foreground whitespace-pre-line">
                                {activity.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>
                                {format(
                                  parseISO(
                                    activity.reported_at ?? activity.created_at,
                                  ),
                                  "HH:mm",
                                )}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-muted/40">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Support</TableHead>
                        <TableHead>Region</TableHead>
                        <TableHead>Reported</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {response?.data.map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell className="font-medium">
                            {activity.title}
                          </TableCell>
                          <TableCell>{activity.type}</TableCell>
                          <TableCell>{activity.status ?? "—"}</TableCell>
                          <TableCell>
                            {activity.support_score !== null
                              ? `${activity.support_score}%`
                              : "—"}
                          </TableCell>
                          <TableCell>{activity.area?.name ?? "—"}</TableCell>
                          <TableCell>
                            {format(
                              parseISO(
                                activity.reported_at ?? activity.created_at,
                              ),
                              "PPpp",
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {canLoadMore && (
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    disabled={isLoadingMore}
                    onClick={() => loadActivities(page + 1, true)}
                  >
                    {isLoadingMore ? "Loading…" : "Load more"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </SafeDataRenderer>
        {loading && (
          <div className="space-y-3 mt-4">
            {[0, 1, 2].map((index) => (
              <Skeleton key={index} className="h-20 w-full" />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivitiesTimeline;
