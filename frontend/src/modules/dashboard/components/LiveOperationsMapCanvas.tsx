import { memo, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import type { FeatureCollection, Feature, Point } from 'geojson';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@/vendor/leaflet-heat-stub';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix default marker icons when bundling with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface LiveOperationsMapCanvasProps {
  committees: FeatureCollection<Point, Record<string, any>>;
  activities: FeatureCollection<Point, Record<string, any>>;
}

const DEFAULT_CENTER: LatLngExpression = [30.0444, 31.2357];

const extractHeatPoints = (
  featureCollection: FeatureCollection<Point, Record<string, any>>,
): [number, number, number][] =>
  featureCollection.features
    .map((feature: Feature<Point, Record<string, any>>) => {
      const [lng, lat] = feature.geometry.coordinates;
      const weight = typeof feature.properties?.support_score === 'number'
        ? Math.max(0.1, feature.properties.support_score / 100)
        : 0.4;
      return [lat, lng, weight] as [number, number, number];
    })
    .filter((point): point is [number, number, number] => Number.isFinite(point[0]) && Number.isFinite(point[1]));

// Map hook to capture map instance
const MapHandler = ({ onMapReady }: { onMapReady: (map: L.Map) => void }) => {
  const map = useMapEvents({});
  useEffect(() => {
    onMapReady(map);
  }, [map, onMapReady]);
  return null;
};

export const LiveOperationsMapCanvas = memo(({ committees, activities }: LiveOperationsMapCanvasProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const heatRef = useRef<any | null>(null);

  const heatPoints = useMemo(() => extractHeatPoints(activities), [activities]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (heatRef.current) {
      heatRef.current.remove();
      heatRef.current = null;
    }

    if (!heatPoints.length) {
      return;
    }

    heatRef.current = (L as any)
      .heatLayer(heatPoints, { radius: 28, blur: 20, maxZoom: 12, minOpacity: 0.35 })
      .addTo(map);
  }, [heatPoints]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (!heatPoints.length && !committees.features.length) {
      return;
    }

    const bounds = L.latLngBounds([]);

    heatPoints.forEach(([lat, lng]) => bounds.extend([lat, lng]));
    committees.features.forEach((feature) => {
      const [lng, lat] = feature.geometry.coordinates;
      bounds.extend([lat, lng]);
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds.pad(0.2));
    }
  }, [heatPoints, committees]);

  return (
    <MapContainer
      className="h-[480px] w-full rounded-xl"
      center={DEFAULT_CENTER}
      zoom={6}
    >
      <MapHandler onMapReady={(map) => { mapRef.current = map; }} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {committees.features.map((feature) => {
        const [lng, lat] = feature.geometry.coordinates;
        const properties = feature.properties ?? {};

        return (
          <Marker key={properties.id ?? `${lat}-${lng}`} position={[lat, lng]}>
            <Popup>
              <div className="space-y-1">
                <p className="font-semibold text-sm">{properties.name}</p>
                {properties.geo_area && (
                  <p className="text-xs text-muted-foreground">{properties.geo_area}</p>
                )}
                <p className="text-xs">Agents: {properties.agents_count ?? 0}</p>
                <p className="text-xs">Voters: {properties.voters_count ?? 0}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
});

LiveOperationsMapCanvas.displayName = 'LiveOperationsMapCanvas';

export default LiveOperationsMapCanvas;
