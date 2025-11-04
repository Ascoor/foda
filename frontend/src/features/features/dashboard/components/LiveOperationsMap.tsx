  import { lazy, Suspense, useEffect, useMemo, useState } from "react";
  import type { Feature, FeatureCollection, Point } from "geojson";
  import { Filter, MapPin, RadioTower } from "lucide-react";
  import { Card, CardContent, CardHeader, CardTitle } from "@/infrastructure/shared/ui/card";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/infrastructure/shared/ui/select";
  import { Badge } from "@/infrastructure/shared/ui/badge";
  import { Skeleton } from "@/infrastructure/shared/ui/skeleton";
  import { toast } from "sonner";
  import { fetchCommitteeGeo, fetchRecentActivityGeo } from "../api";
  import { useCampaignContext } from "@/infrastructure/shared/contexts/CampaignContext";
  import { getEcho } from "@/infrastructure/shared/lib/echo";
  import { Button } from "@/infrastructure/shared/ui/button";

  const LiveOperationsMapCanvas = lazy(() =>
    import("./LiveOperationsMapCanvas").then((module) => ({
      default: module.LiveOperationsMapCanvas,
    })),
  );

  const EMPTY_COLLECTION: FeatureCollection<Point, Record<string, any>> = {
    type: "FeatureCollection",
    features: [],
  };

  const isFeatureCollection = (
    value: unknown,
  ): value is FeatureCollection<Point, Record<string, any>> =>
    Boolean(
      value &&
        typeof value === "object" &&
        "type" in value &&
        (value as { type?: unknown }).type === "FeatureCollection" &&
        Array.isArray((value as { features?: unknown }).features),
    );

  type FilterValue = "all" | string;

  interface Filters {
    region: FilterValue;
    status: FilterValue;
    type: FilterValue;
  }

  const toFeature = (
    activity: Record<string, any>,
  ): Feature<Point, Record<string, any>> | null => {
    if (
      typeof activity.longitude !== "number" ||
      typeof activity.latitude !== "number"
    ) {
      return null;
    }

    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [activity.longitude, activity.latitude],
      },
      properties: {
        id: activity.id,
        type: activity.type,
        status: activity.status,
        support_score: activity.support_score,
        area_id: activity.area?.id ?? activity.area_id,
        area_name: activity.area?.name ?? activity.area_name,
        title: activity.title,
        reported_at: activity.reported_at,
      },
    };
  };

  const defaultFilters: Filters = {
    region: "all",
    status: "all",
    type: "all",
  };

  export const LiveOperationsMap = () => {
    const { campaignId } = useCampaignContext();
    const [committees, setCommittees] =
      useState<FeatureCollection<Point, Record<string, any>>>(EMPTY_COLLECTION);
    const [activities, setActivities] =
      useState<FeatureCollection<Point, Record<string, any>>>(EMPTY_COLLECTION);
    const [filters, setFilters] = useState<Filters>(defaultFilters);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      let isMounted = true;

      const load = async () => {
        setLoading(true);
        try {
          const [committeesGeo, activityGeo] = await Promise.all([
            fetchCommitteeGeo(campaignId),
            fetchRecentActivityGeo({ limit: 150 }, campaignId),
          ]);

          if (!isMounted) return;

          setCommittees(
            isFeatureCollection(committeesGeo) ? committeesGeo : EMPTY_COLLECTION,
          );
          setActivities(
            isFeatureCollection(activityGeo) ? activityGeo : EMPTY_COLLECTION,
          );
        } catch (error) {
          console.error("Failed to load live operations map", error);
          toast.error("Unable to load map overlays.");
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };

      load();

      return () => {
        isMounted = false;
      };
    }, [campaignId]);

    useEffect(() => {
      const echo = getEcho();
      if (!echo) return;

      const channel = echo.channel("activities");

      const handler = (payload: { data: Record<string, any> }) => {
        const feature = toFeature(payload?.data ?? {});
        if (!feature) return;

        toast.success("New field report received", {
          description: feature.properties?.title ?? "Live update from the field.",
          duration: 4000,
        });

        setActivities((previous) => ({
          type: "FeatureCollection",
          features: [feature, ...previous.features].slice(0, 200),
        }));
      };

      channel.listen(".App\\Events\\ActivityCreated", handler);

      return () => {
        channel.stopListening(".App\\Events\\ActivityCreated", handler);
      };
    }, []);

    const filteredActivities = useMemo(() => {
      const filtered = activities.features.filter((feature) => {
        const props = feature.properties ?? {};
        if (
          filters.region !== "all" &&
          String(props.area_id) !== filters.region
        ) {
          return false;
        }
        if (filters.status !== "all" && props.status !== filters.status) {
          return false;
        }
        if (filters.type !== "all" && props.type !== filters.type) {
          return false;
        }
        return true;
      });

      return {
        type: "FeatureCollection",
        features: filtered,
      } as FeatureCollection<Point, Record<string, any>>;
    }, [activities, filters]);

    const regionOptions = useMemo(() => {
      const entries = new Map<string, string>();
      activities.features.forEach((feature) => {
        const areaId = feature.properties?.area_id;
        const areaName = feature.properties?.area_name;
        if (areaId && !entries.has(String(areaId))) {
          entries.set(String(areaId), areaName ?? `Region ${areaId}`);
        }
      });
      return Array.from(entries.entries());
    }, [activities]);

    const statusOptions = useMemo(() => {
      const statuses = new Set<string>();
      activities.features.forEach((feature) => {
        if (feature.properties?.status) {
          statuses.add(feature.properties.status);
        }
      });
      return Array.from(statuses.values());
    }, [activities]);

    const typeOptions = useMemo(() => {
      const types = new Set<string>();
      activities.features.forEach((feature) => {
        if (feature.properties?.type) {
          types.add(feature.properties.type);
        }
      });
      return Array.from(types.values());
    }, [activities]);

    const averageSupport = useMemo(() => {
      if (!filteredActivities.features.length) return 0;
      const total = filteredActivities.features.reduce((sum, feature) => {
        const support = feature.properties?.support_score ?? 0;
        return sum + Number(support || 0);
      }, 0);
      return total / filteredActivities.features.length;
    }, [filteredActivities]);

    return (
      <Card className="glass-card">
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <RadioTower className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-xl">Live field operations</CardTitle>
              <p className="text-sm text-muted-foreground">
                Monitor committees and real-time field intelligence across Egypt.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline">
              {filteredActivities.features.length} active signals
            </Badge>
            <Badge variant="secondary">
              Avg. support {averageSupport.toFixed(1)}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                Filters
              </span>
            </div>
            <Select
              value={filters.region}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, region: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All regions</SelectItem>
                {regionOptions.map(([id, name]) => (
                  <SelectItem key={id} value={id}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.type}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Activity type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {typeOptions.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilters(defaultFilters)}
            >
              Reset
            </Button>
          </div>

          <Suspense
            fallback={
              <div className="flex flex-col items-center justify-center h-[480px] rounded-xl border border-dashed border-muted">
                <MapPin className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Loading map overlays…
                </p>
                <Skeleton className="h-[280px] w-3/4 mt-4" />
              </div>
            }
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center h-[480px] rounded-xl border border-dashed border-muted">
                <MapPin className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Preparing map layers…
                </p>
                <Skeleton className="h-[280px] w-3/4 mt-4" />
              </div>
            ) : (
              <LiveOperationsMapCanvas
                committees={committees}
                activities={filteredActivities}
              />
            )}
          </Suspense>

          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-12 rounded-full bg-gradient-to-r from-green-300 via-orange-300 to-red-400" />
              <span>
                Heat intensity represents support level & turnout pressure.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-primary" />
              <span>Committee locations</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  export default LiveOperationsMap;
