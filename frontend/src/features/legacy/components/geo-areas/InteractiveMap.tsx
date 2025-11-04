import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import { LatLngBounds, LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useLanguage } from "@/infrastructure/shared/contexts/LanguageContext";
import { GeoAreaData } from "@/infrastructure/shared/data/mockGeoData";
import { MapPin, Users, UserCheck, Target, Layers } from "lucide-react";
import { Card, CardContent } from "@/infrastructure/shared/ui/card";
import { Badge } from "@/infrastructure/shared/ui/badge";
import { Button } from "@/infrastructure/shared/ui/button";

// Fix Leaflet default markers
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface InteractiveMapProps {
  geoAreas: GeoAreaData[];
  selectedArea?: GeoAreaData | null;
  onAreaClick?: (area: GeoAreaData) => void;
  onAreaHover?: (area: GeoAreaData | null) => void;
  filterStatus?: string;
  className?: string;
}

// Component to handle map controls and effects
const MapController: React.FC<{
  selectedArea?: GeoAreaData | null;
  geoAreas: GeoAreaData[];
}> = ({ selectedArea, geoAreas }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedArea?.coordinates.bounds) {
      const bounds = new LatLngBounds(
        [
          selectedArea.coordinates.bounds.south,
          selectedArea.coordinates.bounds.west,
        ],
        [
          selectedArea.coordinates.bounds.north,
          selectedArea.coordinates.bounds.east,
        ],
      );
      map.fitBounds(bounds, { padding: [20, 20] });
    } else if (geoAreas.length > 0) {
      // Fit all areas
      const bounds = new LatLngBounds([]);
      geoAreas.forEach((area) => {
        if (area.coordinates.bounds) {
          bounds.extend([
            area.coordinates.bounds.south,
            area.coordinates.bounds.west,
          ]);
          bounds.extend([
            area.coordinates.bounds.north,
            area.coordinates.bounds.east,
          ]);
        } else {
          bounds.extend([area.coordinates.lat, area.coordinates.lng]);
        }
      });
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [selectedArea, geoAreas, map]);

  return null;
};

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  geoAreas,
  selectedArea,
  onAreaClick,
  onAreaHover,
  filterStatus,
  className = "",
}) => {
  const { t, language } = useLanguage();
  const [hoveredArea, setHoveredArea] = useState<GeoAreaData | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const filteredAreas = geoAreas.filter(
    (area) =>
      !filterStatus ||
      filterStatus === "all" ||
      area.campaignStatus === filterStatus,
  );

  const handleAreaClick = (area: GeoAreaData) => {
    onAreaClick?.(area);
  };

  const handleAreaHover = (area: GeoAreaData | null) => {
    setHoveredArea(area);
    onAreaHover?.(area);
  };

  const getPolygonCoordinates = (area: GeoAreaData): LatLng[] => {
    if (!area.coordinates.bounds) {
      // Create a simple polygon around the point
      const { lat, lng } = area.coordinates;
      const offset = 0.05;
      return [
        new LatLng(lat - offset, lng - offset),
        new LatLng(lat - offset, lng + offset),
        new LatLng(lat + offset, lng + offset),
        new LatLng(lat + offset, lng - offset),
      ];
    }

    const { bounds } = area.coordinates;
    return [
      new LatLng(bounds.south, bounds.west),
      new LatLng(bounds.south, bounds.east),
      new LatLng(bounds.north, bounds.east),
      new LatLng(bounds.north, bounds.west),
    ];
  };

  const getAreaOpacity = (area: GeoAreaData) => {
    if (selectedArea?.id === area.id) return 0.8;
    if (hoveredArea?.id === area.id) return 0.6;
    return 0.4;
  };

  const getAreaStrokeWidth = (area: GeoAreaData) => {
    if (selectedArea?.id === area.id) return 4;
    if (hoveredArea?.id === area.id) return 3;
    return 2;
  };

  return (
    <div
      className={`relative w-full h-[600px] glass-card overflow-hidden ${className}`}
    >
      {/* Map Container */}
      <MapContainer
        center={[30.0444, 31.2357]} // Cairo coordinates
        zoom={8}
        className="w-full h-full rounded-lg"
        whenReady={() => setMapLoaded(true)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="filter brightness-95 dark:brightness-75 dark:hue-rotate-180 dark:invert"
        />

        <MapController selectedArea={selectedArea} geoAreas={filteredAreas} />

        {/* Area Polygons */}
        {filteredAreas.map((area) => (
          <Polygon
            key={area.id}
            positions={getPolygonCoordinates(area)}
            pathOptions={{
              color: area.color,
              fillColor: area.color,
              fillOpacity: getAreaOpacity(area),
              weight: getAreaStrokeWidth(area),
            }}
            eventHandlers={{
              click: () => handleAreaClick(area),
              mouseover: () => handleAreaHover(area),
              mouseout: () => handleAreaHover(null),
            }}
          />
        ))}

        {/* Area Markers */}
        {filteredAreas.map((area) => (
          <Marker
            key={`marker-${area.id}`}
            position={[area.coordinates.lat, area.coordinates.lng]}
            eventHandlers={{
              click: () => handleAreaClick(area),
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-lg mb-2">
                  {language === "ar" ? area.name : area.nameEn}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span>
                      {t("geo_areas.total_voters")}:{" "}
                      {area.stats.totalVoters.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-secondary" />
                    <span>
                      {t("geo_areas.registered_voters")}:{" "}
                      {area.stats.registeredVoters.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-accent" />
                    <span>
                      {t("geo_areas.coverage_percentage")}:{" "}
                      {area.stats.coverage}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">
                      {t("geo_areas.campaign_status")}:
                    </span>
                    <Badge
                      variant="outline"
                      className="text-xs"
                      style={{ borderColor: area.color, color: area.color }}
                    >
                      {t(`geo_areas.status.${area.campaignStatus}`)}
                    </Badge>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Legend */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-4 right-4 z-[1000]"
      >
        <Card className="glass-card p-3 min-w-[200px]">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm">
              {t("geo_areas.campaign_coverage")}
            </span>
          </div>
          <div className="space-y-2">
            {[
              { status: "covered", color: "#22c55e" },
              { status: "pending", color: "#f59e0b" },
              { status: "high_priority", color: "#ef4444" },
              { status: "uncovered", color: "#94a3b8" },
            ].map(({ status, color }) => (
              <div key={status} className="flex items-center gap-2 text-xs">
                <div
                  className="w-3 h-3 rounded border"
                  style={{ backgroundColor: color, borderColor: color }}
                />
                <span>{t(`geo_areas.status.${status}`)}</span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Selected Area Info Panel */}
      {selectedArea && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-4 left-4 z-[1000]"
        >
          <Card className="glass-card p-4 min-w-[300px]">
            <CardContent className="p-0">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-lg">
                    {language === "ar"
                      ? selectedArea.name
                      : selectedArea.nameEn}
                  </h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    {t(`geo_areas.types.${selectedArea.type}`)}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  style={{
                    borderColor: selectedArea.color,
                    color: selectedArea.color,
                  }}
                >
                  {t(`geo_areas.status.${selectedArea.campaignStatus}`)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium">
                        {selectedArea.stats.totalVoters.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t("geo_areas.total_voters")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-secondary" />
                    <div>
                      <p className="font-medium">
                        {selectedArea.stats.registeredVoters.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t("geo_areas.registered_voters")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-accent" />
                    <div>
                      <p className="font-medium">
                        {selectedArea.stats.coverage}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t("geo_areas.coverage_percentage")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-success" />
                    <div>
                      <p className="font-medium">
                        {selectedArea.stats.activeVolunteers}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t("geo_areas.active_volunteers")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedArea.description && (
                <p className="mt-3 text-xs text-muted-foreground">
                  {selectedArea.description}
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Loading Overlay */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-[1001]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">
              {t("common.loading")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;
