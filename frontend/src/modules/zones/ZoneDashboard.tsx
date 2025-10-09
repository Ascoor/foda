import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { MapContainer, Polygon, TileLayer, Tooltip } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { useZoneFilter } from './hooks/useZoneFilter';
import type { ElectoralZone, ElectoralZoneStatus } from './types';

const DEFAULT_CENTER: [number, number] = [31.037933, 31.381523];

const statusColors: Record<ElectoralZoneStatus, string> = {
  'مغطاة': '#16a34a',
  'غير مغطاة': '#dc2626',
  'أولوية قصوى': '#f97316',
};

const statusBadgeStyles: Record<ElectoralZoneStatus, string> = {
  'مغطاة': 'border-emerald-400/40 text-emerald-500 bg-emerald-500/10',
  'غير مغطاة': 'border-red-400/40 text-red-500 bg-red-500/10',
  'أولوية قصوى': 'border-amber-400/40 text-amber-500 bg-amber-500/10',
};

const statusOptions: Array<{ label: string; value: ElectoralZoneStatus | 'الكل' }> = [
  { label: 'جميع الحالات', value: 'الكل' },
  { label: 'مغطاة', value: 'مغطاة' },
  { label: 'غير مغطاة', value: 'غير مغطاة' },
  { label: 'أولوية قصوى', value: 'أولوية قصوى' },
];

const numberFormatter = new Intl.NumberFormat('ar-EG');

type LatLngPolygon = LatLngExpression[][];

const getLeafletPolygons = (zone: ElectoralZone): LatLngPolygon[] => {
  if (!zone.geometry) return [];

  if (zone.geometry.type === 'Polygon') {
    return [
      zone.geometry.coordinates.map((ring) =>
        ring.map(([lng, lat]) => [lat, lng] as [number, number])
      ),
    ];
  }

  return zone.geometry.coordinates.map((polygon) =>
    polygon.map((ring) => ring.map(([lng, lat]) => [lat, lng] as [number, number]))
  );
};

const getZoneCenter = (zones: ElectoralZone[]): [number, number] => {
  const points: Array<[number, number]> = [];

  zones.forEach((zone) => {
    const polygons = getLeafletPolygons(zone);
    polygons.forEach((polygon) => {
      polygon.forEach(([lat, lng]) => {
        points.push([lat, lng]);
      });
    });
  });

  if (!points.length) return DEFAULT_CENTER;

  const { latSum, lngSum } = points.reduce(
    (acc, [lat, lng]) => ({
      latSum: acc.latSum + lat,
      lngSum: acc.lngSum + lng,
    }),
    { latSum: 0, lngSum: 0 }
  );

  return [latSum / points.length, lngSum / points.length];
};

const ZoneMap = ({
  zones,
  selectedZoneId,
  onSelect,
}: {
  zones: ElectoralZone[];
  selectedZoneId: string | null;
  onSelect: (zone: ElectoralZone) => void;
}) => {
  const center = useMemo(() => getZoneCenter(zones), [zones]);

  return (
    <div className="h-[520px] w-full overflow-hidden rounded-2xl border border-border/60 bg-card/60 shadow-inner">
      <MapContainer
        center={center}
        zoom={13}
        className="h-full w-full"
        scrollWheelZoom
        style={{ direction: 'ltr' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {zones.map((zone) => {
          const polygons = getLeafletPolygons(zone);
          const isSelected = zone.id === selectedZoneId;

          if (!polygons.length) return null;

          return polygons.map((polygon, index) => (
            <Polygon
              key={`${zone.id}-${index}`}
              positions={polygon}
              pathOptions={{
                color: statusColors[zone.status],
                weight: isSelected ? 4 : 2,
                fillOpacity: isSelected ? 0.45 : 0.25,
                fillColor: statusColors[zone.status],
              }}
              eventHandlers={{
                click: () => onSelect(zone),
              }}
            >
              <Tooltip direction="top" sticky>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-base">{zone.name}</span>
                    <Badge
                      variant="outline"
                      className={cn('rounded-full px-2 py-0.5 text-xs font-medium', statusBadgeStyles[zone.status])}
                    >
                      {zone.status}
                    </Badge>
                  </div>
                  <p>الناخبون: {numberFormatter.format(zone.voters)}</p>
                  <p>المتطوعون: {numberFormatter.format(zone.volunteers)}</p>
                  <p>اللجان: {numberFormatter.format(zone.committees)}</p>
                </div>
              </Tooltip>
            </Polygon>
          ));
        })}
      </MapContainer>
    </div>
  );
};

const ZoneTable = ({
  zones,
  selectedZoneId,
  onSelect,
}: {
  zones: ElectoralZone[];
  selectedZoneId: string | null;
  onSelect: (zone: ElectoralZone) => void;
}) => (
  <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/60 shadow-inner">
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/30 hover:bg-muted/30">
          <TableHead className="text-right text-sm font-semibold">الاسم</TableHead>
          <TableHead className="text-right text-sm font-semibold">الحالة</TableHead>
          <TableHead className="text-right text-sm font-semibold">الناخبون</TableHead>
          <TableHead className="text-right text-sm font-semibold">المتطوعون</TableHead>
          <TableHead className="text-right text-sm font-semibold">اللجان</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {zones.map((zone) => {
          const isSelected = zone.id === selectedZoneId;

          return (
            <TableRow
              key={zone.id}
              className={cn(
                'cursor-pointer border-b border-border/60 transition-colors hover:bg-muted/40',
                isSelected && 'bg-muted/50'
              )}
              onClick={() => onSelect(zone)}
            >
              <TableCell className="text-right font-medium">{zone.name}</TableCell>
              <TableCell className="text-right">
                <Badge
                  variant="outline"
                  className={cn('rounded-full px-3 py-1 text-xs font-medium', statusBadgeStyles[zone.status])}
                >
                  {zone.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {numberFormatter.format(zone.voters)}
              </TableCell>
              <TableCell className="text-right">
                {numberFormatter.format(zone.volunteers)}
              </TableCell>
              <TableCell className="text-right">
                {numberFormatter.format(zone.committees)}
              </TableCell>
            </TableRow>
          );
        })}
        {!zones.length && (
          <TableRow>
            <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
              لا توجد مناطق مطابقة للبحث الحالي
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
);

export const ZoneDashboard = () => {
  const { direction } = useLanguage();
  const [view, setView] = useState<'map' | 'list'>('map');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ElectoralZoneStatus | 'الكل'>('الكل');
  const [selectedZone, setSelectedZone] = useState<ElectoralZone | null>(null);

  const { filteredZones, totalZones, totalVoters, totalVolunteers, totalCommittees } = useZoneFilter(
    searchTerm,
    statusFilter
  );

  useEffect(() => {
    if (selectedZone && !filteredZones.some((zone) => zone.id === selectedZone.id)) {
      setSelectedZone(null);
    }
  }, [filteredZones, selectedZone]);

  const handleZoneSelect = (zone: ElectoralZone) => {
    setSelectedZone(zone);
  };

  return (
    <div className="space-y-6" dir={direction}>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gradient-primary">مناطق المنصورة الانتخابية</h1>
        <p className="text-muted-foreground">
          إدارة ومراقبة تغطية المناطق الانتخابية داخل مدينة وحي المنصورة بمحافظة الدقهلية.
        </p>
      </div>

      <Card className="glass-card border-border/60 bg-card/80">
        <CardHeader>
          <CardTitle className="text-xl">نظرة عامة على المناطق</CardTitle>
          <CardDescription>
            استكشف حالة التغطية، أعداد الناخبين والمتطوعين، ومراكز اللجان لكل منطقة انتخابية.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 flex-col gap-3 md:flex-row">
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="ابحث عن منطقة..."
                className="glass max-w-md"
              />
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as ElectoralZoneStatus | 'الكل')}
              >
                <SelectTrigger className="glass w-full max-w-[220px]">
                  <SelectValue placeholder="تصفية حسب الحالة" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatBlock label="المناطق" value={numberFormatter.format(totalZones)} />
              <StatBlock label="الناخبون" value={numberFormatter.format(totalVoters)} />
              <StatBlock label="المتطوعون" value={numberFormatter.format(totalVolunteers)} />
              <StatBlock label="اللجان" value={numberFormatter.format(totalCommittees)} />
            </div>
          </div>

          <Tabs value={view} onValueChange={(val) => setView(val as 'map' | 'list')}>
            <TabsList className="grid w-full grid-cols-2 md:w-fit">
              <TabsTrigger value="map">الخريطة</TabsTrigger>
              <TabsTrigger value="list">القائمة</TabsTrigger>
            </TabsList>
            <TabsContent value="map" className="mt-4">
              {filteredZones.length ? (
                <ZoneMap
                  zones={filteredZones}
                  selectedZoneId={selectedZone?.id ?? null}
                  onSelect={handleZoneSelect}
                />
              ) : (
                <EmptyState message="لا توجد مناطق لعرضها على الخريطة." />
              )}
            </TabsContent>
            <TabsContent value="list" className="mt-4">
              <ZoneTable
                zones={filteredZones}
                selectedZoneId={selectedZone?.id ?? null}
                onSelect={handleZoneSelect}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {selectedZone && (
        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle className="text-xl">تفاصيل المنطقة المختارة</CardTitle>
            <CardDescription>
              نظرة أعمق على الإحصائيات الحالية للمنطقة المختارة من الخريطة أو القائمة.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <InfoBlock title="المنطقة" value={selectedZone.name} />
              <InfoBlock
                title="الحالة"
                value={
                  <Badge
                    variant="outline"
                    className={cn('rounded-full px-3 py-1 text-xs font-medium', statusBadgeStyles[selectedZone.status])}
                  >
                    {selectedZone.status}
                  </Badge>
                }
              />
              <InfoBlock title="عدد الناخبين" value={numberFormatter.format(selectedZone.voters)} />
              <InfoBlock title="عدد المتطوعين" value={numberFormatter.format(selectedZone.volunteers)} />
              <InfoBlock title="عدد اللجان" value={numberFormatter.format(selectedZone.committees)} />
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-border/60 bg-card/70">
        <CardHeader>
          <CardTitle className="text-xl">مؤشرات الأداء الحالية</CardTitle>
          <CardDescription>
            تلخيص سريع لأهم المؤشرات عبر المناطق المعروضة حاليًا.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatBlock label="إجمالي المناطق المعروضة" value={numberFormatter.format(totalZones)} subtle />
            <StatBlock label="إجمالي الناخبين" value={numberFormatter.format(totalVoters)} subtle />
            <StatBlock label="إجمالي المتطوعين" value={numberFormatter.format(totalVolunteers)} subtle />
            <StatBlock label="إجمالي اللجان" value={numberFormatter.format(totalCommittees)} subtle />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const StatBlock = ({
  label,
  value,
  subtle,
}: {
  label: string;
  value: string;
  subtle?: boolean;
}) => (
  <div
    className={cn(
      'rounded-xl border border-border/60 bg-background/60 p-4 text-right shadow-sm backdrop-blur',
      subtle && 'bg-background/40'
    )}
  >
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-2xl font-semibold text-foreground">{value}</p>
  </div>
);

const InfoBlock = ({
  title,
  value,
}: {
  title: string;
  value: ReactNode;
}) => (
  <div className="rounded-xl border border-border/60 bg-background/60 p-4 text-right shadow-sm backdrop-blur">
    <p className="text-xs text-muted-foreground">{title}</p>
    <div className="text-lg font-semibold text-foreground">
      {value}
    </div>
  </div>
);

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex h-[320px] items-center justify-center rounded-2xl border border-dashed border-border/40 bg-card/40">
    <p className="text-sm text-muted-foreground">{message}</p>
  </div>
);

export default ZoneDashboard;
